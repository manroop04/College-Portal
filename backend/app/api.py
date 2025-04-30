from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import cv2
import numpy as np
import base64
import os
import pickle
import pandas as pd
from datetime import datetime
import imutils
from imutils import paths 
import threading
import time
from werkzeug.utils import secure_filename
import face_recognition
import config
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from flask import make_response
from fpdf import FPDF
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ENCODINGS_PATH = config.ENCODINGS_PATH
ATTENDANCE_PATH = config.ATTENDANCE_PATH
PROTOTXT_PATH = config.PROTOTXT_PATH
MODEL_PATH = config.MODEL_PATH
CAPTURE_DURATION = config.CAPTURE_DURATION
DATASET = config.DATASET

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def face_detection(image, prototxt, model, min_confidence=0.5):
    """Detect faces in an image using OpenCV DNN"""
    (h, w) = image.shape[:2]
    resized = cv2.resize(image, (300, 300))
    blob = cv2.dnn.blobFromImage(resized, 1.0, (300, 300), (104.0, 177.0, 123.0))
    
    net = cv2.dnn.readNetFromCaffe(prototxt, model)
    net.setInput(blob)
    detections = net.forward()

    boxes = []
    confidences = []
    for i in range(detections.shape[2]):
        confidence = detections[0, 0, i, 2]
        if confidence > min_confidence:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            boxes.append(box.astype("int"))
            confidences.append(confidence)

    return boxes, confidences

class FaceDetectionAPI:
    def __init__(self):
        self.prototxt = PROTOTXT_PATH
        self.model = MODEL_PATH
        self.capture_count = 0
        self.current_output_dir = None

    def detect_faces(self, image, min_confidence=0.5):
        """Detect faces in an image and return bounding boxes"""
        orig = image.copy()
        (boxes, confidences) = face_detection(
            image=image, 
            prototxt=self.prototxt, 
            model=self.model, 
            min_confidence=min_confidence
        )
        
        # Draw rectangles and confidence on the image
        for ((startX, startY, endX, endY), confidence) in zip(boxes, confidences):
            cv2.rectangle(image, (startX, startY), (endX, endY), (0, 255, 0), 2)
            text = "{:.2f}".format(confidence * 100)
            y = startY - 10 if startY - 10 > 10 else startY + 10
            cv2.putText(image, text, (startX, y), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 255, 0), 2)
        
        return image, boxes, confidences, orig

    def capture_face(self, orig_image, output_dir):
        """Save the original image with faces"""
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
        
        self.capture_count += 1
        filename = f"{str(self.capture_count).zfill(5)}.png"
        save_path = os.path.join(output_dir, filename)
        cv2.imwrite(save_path, orig_image)
        
        return save_path

# Global instance
face_detector = FaceDetectionAPI()

@app.route('/api/detect', methods=['POST'])
def detect():
    """Endpoint for face detection"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Read image
    image_stream = file.read()
    nparr = np.frombuffer(image_stream, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Get parameters
    min_confidence = float(request.form.get('min_confidence', 0.5))
    output_dir = request.form.get('output_dir')
    capture = request.form.get('capture', 'false').lower() == 'true'
    
    # Process image
    processed_image, boxes, confidences, orig_image = face_detector.detect_faces(
        image, min_confidence=min_confidence
    )
    
    # Handle capture if requested
    saved_path = None
    if capture and output_dir:
        saved_path = face_detector.capture_face(orig_image, output_dir)
    
    # Convert processed image to base64
    _, buffer = cv2.imencode('.jpg', processed_image)
    processed_image_base64 = base64.b64encode(buffer).decode('utf-8')
    
    # Prepare response
    response = {
        'processed_image': f"data:image/jpeg;base64,{processed_image_base64}",
        'faces_detected': len(boxes),
        'boxes': boxes,
        'confidences': confidences,
        'captured': saved_path is not None,
        'captured_path': saved_path
    }
    
    return jsonify(response)

@app.route('/api/set-output-dir', methods=['POST'])
def set_output_dir():
    """Set the output directory for captured faces"""
    output_dir = request.json.get('output_dir')
    if not output_dir:
        return jsonify({'error': 'output_dir parameter is required'}), 400
    
    # Create directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    face_detector.current_output_dir = output_dir
    face_detector.capture_count = 0
    
    return jsonify({
        'status': 'output directory set',
        'output_dir': output_dir,
        'capture_count_reset': True
    })

@app.route('/api/capture', methods=['POST'])
def capture():
    """Endpoint to manually capture a face"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    if not face_detector.current_output_dir:
        return jsonify({'error': 'Output directory not set'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    # Read image
    image_stream = file.read()
    nparr = np.frombuffer(image_stream, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    # Process with capture
    _, boxes, _, orig_image = face_detector.detect_faces(image)
    saved_path = face_detector.capture_face(orig_image, face_detector.current_output_dir)
    
    if not saved_path:
        return jsonify({'error': 'No faces detected to capture'}), 400
    
    return jsonify({
        'success': True,
        'captured_path': saved_path,
        'capture_count': face_detector.capture_count
    })

class FaceRecognizer:
    """Face recognition handler class"""
    def __init__(self, prototxt, model):
        self.prototxt = prototxt
        self.model = model
    
    def encodeFace(self, image):
        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        boxes = face_recognition.face_locations(rgb, model="hog")
        encodings = face_recognition.face_encodings(rgb, boxes)
        return boxes, encodings
    
    def matchFace(self, encodings, known_data, face_counter):
        names = []
        for encoding in encodings:
            matches = face_recognition.compare_faces(
                known_data["encodings"], encoding)
            name = "Unknown"
            
            if True in matches:
                matched_idxs = [i for (i, b) in enumerate(matches) if b]
                counts = {}
                for i in matched_idxs:
                    name = known_data["names"][i]
                    counts[name] = counts.get(name, 0) + 1
                name = max(counts, key=counts.get)
                face_counter[name] = face_counter.get(name, 0) + 1
            names.append(name)
        return names
    
    def drawFaceBB(self, image, boxes, names, ratio=1):
        for ((top, right, bottom, left), name) in zip(boxes, names):
            top = int(top * ratio)
            right = int(right * ratio)
            bottom = int(bottom * ratio)
            left = int(left * ratio)
            
            cv2.rectangle(image, (left, top), (right, bottom), (0, 255, 0), 2)
            cv2.rectangle(image, (left, bottom - 35), (right, bottom), (0, 255, 0), cv2.FILLED)
            cv2.putText(image, name, (left + 6, bottom - 6), 
                       cv2.FONT_HERSHEY_DUPLEX, 0.8, (255, 255, 255), 1)
        return image 
       

class FaceRecognizerAPI:
    def __init__(self):
        self.prototxt = PROTOTXT_PATH
        self.model = MODEL_PATH
        self.recognizer_active = False
        self.frame = None
        self.latest_results = []
        self.face_counter = {}
        self.recognized_names = []
        self.encodings_path = "output/encodings.pickle"
        self.data = self.load_encodings()
        if not os.path.exists(self.encodings_path):
            self.save_encodings()
        
        # Load known face encodings
        # self.data = self.load_encodings()
        self.df = self.load_attendance()
        
        # Initialize recognizer
        self.face_recognizer = FaceRecognizer(self.prototxt, self.model)
        self.processing_complete = False  # Add this flag
    # ... rest of your existing init code ...

# Add this method to your FaceRecognizerAPI class
    def set_processing_complete(self, status):
        self.processing_complete = status
        
    def update_attendance(self, name):
        """Update attendance record for a single person"""
        if self.current_date not in self.df.columns:
            self.df[self.current_date] = 0
            
        if name not in self.df['names'].values:
            new_row = {'names': name}
            new_row.update({col: 0 for col in self.df.columns if col != 'names'})
            self.df = self.df.append(new_row, ignore_index=True)
        
        self.df.loc[self.df['names'] == name, self.current_date] = 1
    
    def load_encodings(self):
        if not os.path.exists(self.encodings_path):
            # Initialize empty encodings if file doesn't exist
            return {"names": [], "encodings": []}
        
        try:
            with open(self.encodings_path, "rb") as f:
                # Check if file is empty
                if os.path.getsize(self.encodings_path) == 0:
                    return {"names": [], "encodings": []}
                return pickle.load(f)
        except (EOFError, pickle.UnpicklingError):
            print("Warning: Encodings file corrupted. Creating new one.")
            return {"names": [], "encodings": []}
    
    def load_attendance(self):
        if os.path.exists(ATTENDANCE_PATH):
            return pd.read_csv(ATTENDANCE_PATH, index_col=0)
        return pd.DataFrame(columns=['names'])
    
    def process_frame(self):
        """Continuous frame processing for video feed"""
        video_capture = cv2.VideoCapture(0)
        time.sleep(2)  # Warm up camera
        
        while self.recognizer_active:
            ret, frame = video_capture.read()
            if not ret:
                continue
                
            # Resize frame for faster processing
            small_frame = imutils.resize(frame, width=750)
            ratio = small_frame.shape[1] / float(frame.shape[1])
            
            # Detect and recognize faces
            (boxes, encodings) = self.face_recognizer.encodeFace(small_frame)
            names = self.face_recognizer.matchFace(encodings, self.data, self.face_counter)
            
            # Store results
            self.latest_results = list(zip(boxes, names))
            self.frame = self.face_recognizer.drawFaceBB(small_frame, boxes, names, ratio)
            
        video_capture.release()
    def save_encodings(self):
        try:
            with open(self.encodings_path, "wb") as f:
                pickle.dump(self.data, f, protocol=pickle.HIGHEST_PROTOCOL)
        except Exception as e:
            print(f"Error saving encodings: {e}")
            # Try backup save
            backup_path = self.encodings_path + ".bak"
            with open(backup_path, "wb") as f:
                pickle.dump(self.data, f)    
    
    def recognize_image(self, image):
        """Recognize faces in a single image"""
        image = imutils.resize(image, width=750)
        ratio = image.shape[1] / float(image.shape[1])
        
        (boxes, encodings) = self.face_recognizer.encodeFace(image)
        names = self.face_recognizer.matchFace(encodings, self.data, self.face_counter)
        processed_image = self.face_recognizer.drawFaceBB(image, boxes, names, ratio)
        
        return processed_image, boxes, names
    
    def save_attendance(self):
        """Save attendance data to CSV"""
        date_col = datetime.now().strftime("%A, %b %d, %Y %H:%M")
        face_counter = {key: 1 if value >= 10 else 0 
                       for key, value in self.face_counter.items()}
        
        if date_col not in self.df.columns:
            self.df[date_col] = 0
            
        for name, present in face_counter.items():
            if name in self.df['names'].values:
                self.df.loc[self.df['names'] == name, date_col] = present
        
        self.df.to_csv(ATTENDANCE_PATH)
        return True

# Global recognizer instance
recognizer = FaceRecognizerAPI()

def process_uploaded_video(video_path):
    """Process uploaded video file for attendance"""
    try:
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = int(fps)  # Process 1 frame per second
        
        frame_count = 0
        while recognizer.recognizer_active and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            if frame_count % frame_interval != 0:
                continue
                
            # Process frame
            small_frame = imutils.resize(frame, width=750)
            (boxes, encodings) = recognizer.face_recognizer.encodeFace(small_frame)
            names = recognizer.face_recognizer.matchFace(encodings, recognizer.data, recognizer.face_counter)
            
            # Update latest results
            recognizer.latest_results = list(zip(boxes, names))
            recognizer.frame = recognizer.face_recognizer.drawFaceBB(small_frame, boxes, names, 1.0)
            
        cap.release()
        recognizer.save_attendance()  # Save attendance when done
        
    except Exception as e:
        print(f"Video processing error: {str(e)}")
    finally:
        recognizer.recognizer_active = False

@app.route('/api/recognize/image', methods=['POST'])
def recognize_image():
    """Endpoint for recognizing faces in a single image"""
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
        
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        # Read image
        image_stream = file.read()
        nparr = np.frombuffer(image_stream, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if image is None:
            return jsonify({'error': 'Could not decode image'}), 400
        
        # Process image
        processed_image, boxes, names = recognizer.recognize_image(image)
        
        if not names:
            return jsonify({
                'processed_image': '',
                'recognized_faces': [],
                'boxes': []
            })
        
        # Convert processed image to base64
        _, buffer = cv2.imencode('.jpg', processed_image)
        processed_image_base64 = base64.b64encode(buffer).decode('utf-8')
        
        # Prepare response
        response = {
            'processed_image': f"data:image/jpeg;base64,{processed_image_base64}",
            'recognized_faces': names,
            'boxes': boxes
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recognize/start', methods=['POST'])
def start_recognition():
    """Start face recognition from either webcam or uploaded video"""
    try:
        if recognizer.recognizer_active:
            return jsonify({'error': 'recognition already running'}), 400

        recognizer.face_counter = {name: 0 for name in recognizer.data["names"]}
        recognizer.current_date = datetime.now().strftime("%A, %b %d, %Y %H:%M")
        
        # Check if processing video file
        video_path = request.json.get('video_path') if request.is_json else None
        
        if video_path:
            if not os.path.exists(video_path):
                return jsonify({'error': 'video file not found'}), 404
                
            threading.Thread(
                target=process_video_file,
                args=(recognizer, video_path),
                daemon=True
            ).start()
        else:
            threading.Thread(
                target=recognizer.process_frame,
                daemon=True
            ).start()
        
        recognizer.recognizer_active = True
        return jsonify({
            'status': 'recognition started',
            'source': 'video_file' if video_path else 'webcam'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

# Configuration
DATASET = config.DATASET
ENCODINGS_PATH = config.ENCODINGS_PATH
PROTOTXT_PATH = config.PROTOTXT_PATH
MODEL_PATH = config.MODEL_PATH


class FaceEncoder:
    def __init__(self, facesPath, encodings, attendance, prototxt, model):
        self.facesPath = facesPath
        self.encodings = encodings
        self.attendance = attendance
        self.prototxt = prototxt
        self.model = model
        self.knowEncodings = []
        self.KnowNames = []
        
    def encode_faces(self):
        image_paths = list(paths.list_images(self.facesPath))
        
        for (i, image_path) in enumerate(image_paths):
            name = image_path.split(os.path.sep)[-2]
            image = cv2.imread(image_path)
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            
            # Detect faces using face_recognition or your model
            boxes = face_recognition.face_locations(rgb, model="hog")
            encodings = face_recognition.face_encodings(rgb, boxes)
            
            for encoding in encodings:
                self.knowEncodings.append(encoding)
                self.KnowNames.append(name)
    
    def save_face_encodings(self):
        data = {"names": self.KnowNames, "encodings": self.knowEncodings}
        
        # Save encodings
        with open(self.encodings, "wb") as f:
            f.write(pickle.dumps(data))
        
        # Update attendance
        if os.path.exists(self.attendance):
            df = pd.read_csv(self.attendance)
            existing_names = set(df['names'])
        else:
            df = pd.DataFrame(columns=['names'])
            existing_names = set()
            
        # Add new names
        new_names = set(self.KnowNames) - existing_names
        if new_names:
            new_df = pd.DataFrame({'names': list(new_names)})
            df = pd.concat([df, new_df], ignore_index=True)
            df.to_csv(self.attendance, index=False)
            
# # API Endpoints
# @import os
# import cv2
# from werkzeug.utils import secure_filename
# from flask import request, jsonify
# import face_recognition


# Configuration
@app.route('/api/register', methods=['POST'])
def register_student():
    try:
        # Handle both form data and file upload
        if 'student_name' not in request.form:
            return jsonify({"error": "Student name is required"}), 400
        
        student_name = request.form['student_name'].strip()
        if not student_name:
            return jsonify({"error": "Student name cannot be empty"}), 400
        
        # Sanitize name for directory
        sanitized_name = student_name.replace(" ", "_")
        student_dir = os.path.join(DATASET, sanitized_name)
        os.makedirs(student_dir, exist_ok=True)
        
        # Handle image upload if present
        if 'image' in request.files:
            file = request.files['image']
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
                
            # Save the image with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
            file_ext = os.path.splitext(file.filename)[1].lower()
            filename = f"{timestamp}{file_ext}"
            image_path = os.path.join(student_dir, filename)
            file.save(image_path)
            
            # Verify the image contains a face
            image = cv2.imread(image_path)
            if image is None:
                os.remove(image_path)
                return jsonify({"error": "Invalid image file"}), 400
            
            rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
            boxes = face_recognition.face_locations(rgb, model="hog")
            if not boxes:
                os.remove(image_path)
                return jsonify({"error": "No face detected in image"}), 400
        
        # Count existing images
        image_count = len([f for f in os.listdir(student_dir) 
                         if os.path.isfile(os.path.join(student_dir, f))])
        
        return jsonify({
            "success": True,
            "student_name": student_name,
            "image_count": image_count,
            "message": "Registration successful"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/encode', methods=['POST'])
def encode_faces():
    try:
        # Initialize face encoder
        encoder = FaceEncoder(DATASET, ENCODINGS_PATH, ATTENDANCE_PATH, PROTOTXT_PATH, MODEL_PATH)
        encoder.encode_faces()
        encoder.save_face_encodings()
        
        return jsonify({
            "success": True,
            "message": "Faces encoded successfully",
            "encoding_count": len(encoder.knowEncodings)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/students', methods=['GET'])
def get_students():
    try:
        students = []
        if os.path.exists(DATASET):
            students = [name.replace("_", " ") for name in os.listdir(DATASET) 
                       if os.path.isdir(os.path.join(DATASET, name))]
        return jsonify({
            "success": True,
            "students": students,
            "count": len(students)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update your process_video_file function
# Update process_video_file function
def process_video_attendance(recognizer, video_path):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Process every second (skip frames)
        frame_count += 1
        if frame_count % int(fps) != 0:
            continue
            
        # Resize and detect faces
        small_frame = cv2.resize(frame, (0,0), fx=0.5, fy=0.5)
        rgb_frame = small_frame[:, :, ::-1]
        
        # Face detection
        face_locations = face_recognition.face_locations(rgb_frame)
        face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
        
        # Recognition
        for face_encoding in face_encodings:
            matches = face_recognition.compare_faces(recognizer.data["encodings"], face_encoding)
            name = "Unknown"
            confidence = 0
            
            if True in matches:
                match_index = matches.index(True)
                name = recognizer.data["names"][match_index]
                confidence = face_recognition.face_distance(
                    [recognizer.data["encodings"][match_index]], 
                    face_encoding
                )[0]
                confidence = (1 - confidence) * 100  # Convert to percentage
                
                # Update attendance
                update_student_attendance(name, recognizer.current_date)
                
        # Optional: Save frame with bounding boxes for debugging
        # draw_bounding_boxes(frame, face_locations, names)
        
    cap.release()
    update_attendance_percentages()

def update_student_attendance(name, date):
    df = pd.read_csv(ATTENDANCE_PATH)
    
    if date not in df.columns:
        df[date] = 0
        
    if name not in df['name'].values:
        df.loc[len(df)] = {'name': name, date: 1}
    else:
        df.loc[df['name'] == name, date] = 1
        
    df.to_csv(ATTENDANCE_PATH, index=False)

def update_attendance_percentages():
    df = pd.read_csv(ATTENDANCE_PATH)
    date_columns = [col for col in df.columns if col != 'name']
    
    df['total_days'] = len(date_columns)
    df['present_days'] = df[date_columns].sum(axis=1)
    df['percentage'] = (df['present_days'] / df['total_days']) * 100
    
    df.to_csv(ATTENDANCE_PATH, index=False)
    
def process_video_file(recognizer, video_path):
    """Process frames from uploaded video file and update attendance"""
    try:
        recognizer.processing_complete = False
        cap = cv2.VideoCapture(video_path)
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_interval = max(1, int(fps))  # Process ~1 frame per second
        
        while recognizer.recognizer_active and cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
                
            # Process frame
            small_frame = imutils.resize(frame, width=750)
            ratio = small_frame.shape[1] / float(frame.shape[1])
            (boxes, encodings) = recognizer.face_recognizer.encodeFace(small_frame)
            names = recognizer.face_recognizer.matchFace(encodings, recognizer.data, recognizer.face_counter)
            
            # Update attendance for recognized faces
            for name in names:
                if name != "Unknown":
                    recognizer.update_attendance(name)
            
            recognizer.latest_results = list(zip(boxes, names))
            recognizer.frame = recognizer.face_recognizer.drawFaceBB(small_frame, boxes, names, ratio)
            
            # Skip frames
            for _ in range(frame_interval - 1):
                if not cap.read()[0]:
                    break
                    
        cap.release()
        recognizer.save_attendance()
        
    except Exception as e:
        print(f"Video processing error: {str(e)}")
    finally:
        recognizer.processing_complete = True
        recognizer.recognizer_active = False

@app.route('/api/recognize/stop', methods=['POST'])
def stop_recognition():
    """Stop continuous recognition and save attendance"""
    if recognizer.recognizer_active:
        recognizer.recognizer_active = False
        recognizer.save_attendance()
        return jsonify({
            'status': 'recognition stopped',
            'attendance_saved': True
        })
    return jsonify({
        'error': 'recognition not running',
        'completed': recognizer.processing_complete  # Return status
    }), 400

@app.route('/api/recognize/status', methods=['GET'])
def recognition_status():
    return jsonify({
        'active': recognizer.recognizer_active,
        'completed': recognizer.processing_complete,
        'recognized_faces': recognizer.recognized_names,  # Return all unique names
        'current_frame_faces': [name for (_, name) in recognizer.latest_results]
    })
    
def generate_frames():
    """Generator function for video streaming"""
    while recognizer.recognizer_active:
        if recognizer.frame is not None:
            ret, buffer = cv2.imencode('.jpg', recognizer.frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        time.sleep(0.1)

@app.route('/api/recognize/video_feed')
def video_feed():
    """Video streaming route"""
    return Response(generate_frames(),
                    mimetype='multipart/x-mixed-replace; boundary=frame')
    

@app.route('/api/attendance/summary', methods=['GET'])
def attendance_summary():
    try:
        if not os.path.exists(ATTENDANCE_PATH):
            return jsonify({'error': 'Attendance data not found'}), 404

        df = pd.read_csv(ATTENDANCE_PATH)
        
        # Group by hour if you want hourly summaries
        date_columns = [col for col in df.columns if col != 'name']
        df['present_hours'] = df[date_columns].sum(axis=1)
        
        # Or keep exact timestamps in response
        summary = {}
        for _, row in df.iterrows():
            student_data = {
                'name': row['name'],
                'timestamps': {},
                'total_present': int(row['present_hours'])
            }
            
            for col in date_columns:
                if row[col] == 1:
                    student_data['timestamps'][col] = True
            
            summary[row['name']] = student_data
            
        return jsonify(summary)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
        

@app.route('/api/attendance/search/<name>', methods=['GET'])
def search_attendance(name):
    """Search attendance by student name"""
    try:
        if not os.path.exists(ATTENDANCE_PATH):
            return jsonify({'error': 'Attendance data not found'}), 404
            
        df = pd.read_csv(ATTENDANCE_PATH, index_col=0)
        name = name.replace("_", " ")
        
        if name not in df['names'].values:
            return jsonify([])
            
        student_data = df[df['names'] == name]
        total_days = len(student_data.columns) - 1
        present_days = student_data.iloc[:, 1:].sum(axis=1).values[0]
        percentage = (present_days / total_days) * 100 if total_days > 0 else 0
        
        # Get last seen date

        
        # Determine status
        if percentage >= 90:
            status = "Good"
        elif percentage >= 80:
            status = "Warning"
        else:
            status = "Danger"
        
        result = {
            "name": name,
            "attendance_percentage": round(percentage, 2),
            "status": status
        }
        
        return jsonify([result])
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

from flask import send_file
import io

from flask import make_response, jsonify
from fpdf import FPDF
from datetime import datetime
import pandas as pd
import os

@app.route('/api/attendance/pdf', methods=['GET'])
def generate_pdf_report():
    """Generate beautiful PDF attendance report"""
    try:
        if not os.path.exists(ATTENDANCE_PATH):
            return jsonify({'error': 'Attendance data not found'}), 404
            
        df = pd.read_csv(ATTENDANCE_PATH)
        
        # Create PDF
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Arial", size=12)
        
        # Title
        pdf.cell(200, 10, txt="Attendance Report", ln=1, align='C')
        pdf.cell(200, 10, txt=f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M')}", ln=1, align='C')
        pdf.ln(10)
        
        # Table header
        col_widths = [60] + [30] * (len(df.columns) - 1)
        pdf.set_font("Arial", 'B', 12)
        for i, col in enumerate(df.columns):
            pdf.cell(col_widths[i], 10, txt=col, border=1, align='C')
        pdf.ln()
        
        # Table rows
        pdf.set_font("Arial", size=10)
        for _, row in df.iterrows():
            for i, col in enumerate(df.columns):
                cell_value = 'Present' if i > 0 and row[col] == 1 else 'Absent' if i > 0 else row[col]
                pdf.cell(col_widths[i], 10, txt=str(cell_value), border=1, align='C')
            pdf.ln()
        
        # Convert bytearray to bytes directly
        pdf_bytes = bytes(pdf.output(dest='S'))  # No encode here!

        # Create response
        response = make_response(pdf_bytes)
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = 'attachment; filename=attendance_report.pdf'
        
        return response
        
    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/attendance/csv', methods=['GET'])
def generate_csv_report():
    try:
        if not os.path.exists(ATTENDANCE_PATH):
            return jsonify({'error': 'Attendance data not found'}), 404

        df = pd.read_csv(ATTENDANCE_PATH)

        # Convert DataFrame to CSV
        csv_data = df.to_csv(index=False)

        # Create response
        response = make_response(csv_data)
        response.headers['Content-Type'] = 'text/csv'
        response.headers['Content-Disposition'] = 'attachment; filename=attendance_report.csv'

        return response

    except Exception as e:
        return jsonify({'error': str(e)}), 500

from io import BytesIO
from flask import send_file

@app.route('/api/attendance/excel', methods=['GET'])
def generate_excel_report():
    try:
        if not os.path.exists(ATTENDANCE_PATH):
            return jsonify({'error': 'Attendance data not found'}), 404

        df = pd.read_csv(ATTENDANCE_PATH)

        # Write to a BytesIO stream
        output = BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, index=False, sheet_name='Attendance')

        output.seek(0)  # Go to the beginning of the BytesIO buffer

        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='attendance_report.xlsx'
        )

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
@app.route('/api/attendance/view', methods=['GET'])
def view_attendance():
    """Return attendance data for web display"""
    try:
        if not os.path.exists(ATTENDANCE_PATH):
            return jsonify({'error': 'Attendance data not found'}), 404

        df = pd.read_csv(ATTENDANCE_PATH)
        
        # Convert to list of dictionaries for easy frontend rendering
        records = []
        for _, row in df.iterrows():
            record = {'name': row['name']}
            for col in df.columns[1:]:  # Skip name column
                if pd.notna(row[col]):
                    record[col] = 'Present' if row[col] == 1 else 'Absent'
            records.append(record)
            
        return jsonify({
            'columns': list(df.columns),
            'data': records
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    
def update_attendance_records(present_students):
    """Update CSV with exact timestamp"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    if os.path.exists(ATTENDANCE_PATH):
        df = pd.read_csv(ATTENDANCE_PATH)
    else:
        df = pd.DataFrame(columns=['name'])
    
    # Create new column with exact time
    df[timestamp] = 0
    
    for student in present_students:
        if student in df['name'].values:
            df.loc[df['name'] == student, timestamp] = 1
        else:
            df.loc[len(df)] = {'name': student, timestamp: 1}
    
    df.to_csv(ATTENDANCE_PATH, index=False)
    return True;
 
def process_video_for_attendance(video_path):
    """Process video frames and return set of present students"""
    present_students = set()
    cap = cv2.VideoCapture(video_path)
    
    # Load known face encodings
    if not recognizer.data.get("encodings"):
        return present_students
    
    frame_count = 0
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Process every second (skip frames)
        frame_count += 1
        if frame_count % 30 != 0:  # Assuming 30fps
            continue
            
        try:
            # Resize and convert frame
            small_frame = cv2.resize(frame, (0, 0), fx=0.25, fy=0.25)
            rgb_frame = small_frame[:, :, ::-1]  # BGR to RGB
            
            # Detect faces
            face_locations = face_recognition.face_locations(rgb_frame)
            if not face_locations:
                continue
                
            # Get encodings for each face
            face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
            
            # Compare with known faces
            for face_encoding in face_encodings:
                matches = face_recognition.compare_faces(
                    recognizer.data["encodings"], 
                    face_encoding,
                    tolerance=0.6
                )
                
                if True in matches:
                    match_index = matches.index(True)
                    name = recognizer.data["names"][match_index]
                    present_students.add(name)
                    
        except Exception as e:
            app.logger.error(f"Error processing frame: {str(e)}")
            continue
            
    cap.release()
    return present_students

def get_attendance_summary():
    """Calculate attendance statistics with proper type handling"""
    if not os.path.exists(ATTENDANCE_PATH):
        return 0, {}
        
    try:
        df = pd.read_csv(ATTENDANCE_PATH)
        
        # Ensure we have the required columns
        if 'name' not in df.columns:
            return 0, {}
            
        # Convert date columns to numeric, coerce errors to NaN
        date_columns = [col for col in df.columns if col != 'name']
        for col in date_columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
        
        # Calculate statistics
        df['present_days'] = df[date_columns].sum(axis=1)
        df['percentage'] = (df['present_days'] / len(date_columns)) * 100
        
        # Create summary dictionary
        summary = {}
        for _, row in df.iterrows():
            name = row['name']
            percentage = row['percentage']
            
            if percentage >= 90:
                status = "Good"
            elif percentage >= 80:
                status = "Warning"
            else:
                status = "Danger"
                
            summary[name.replace(" ", "_")] = {
                "attendance_percentage": round(percentage, 2),
                "status": status
            }
            
        return len(df), summary
        
    except Exception as e:
        app.logger.error(f"Error processing attendance: {str(e)}")
        return 0, {}
    
@app.route('/api/upload/video', methods=['POST'])
def upload_video():
    try:
        if 'video' not in request.files:
            return jsonify({'error': 'No video file'}), 400
            
        file = request.files['video']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Save uploaded file
        filename = secure_filename(file.filename)
        video_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(video_path)
        
        # Process video - pass both recognizer and video_path
        present_students = process_video_file(recognizer, video_path)
        for student in present_students:
            print(student)
        # Update attendance
        update_attendance_records(present_students)
        
        return jsonify({
            'success': True,
            'recognized': list(present_students),
            'message': 'Video processed successfully'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

def process_video_file(recognizer, video_path):
    """Process video file and return set of present students"""
    present_students = set()
    cap = cv2.VideoCapture(video_path)
    
    # Get video properties
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = 0
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
            
        # Process every second (skip frames)
        frame_count += 1
        if frame_count % int(fps) != 0:
            continue
            
        try:
            # Resize frame for processing
            small_frame = imutils.resize(frame, width=750)
            ratio = small_frame.shape[1] / float(frame.shape[1])
            
            # Detect and recognize faces
            (boxes, encodings) = recognizer.face_recognizer.encodeFace(small_frame)
            names = recognizer.face_recognizer.matchFace(encodings, recognizer.data, recognizer.face_counter)
            
            # Add recognized names (excluding "Unknown")
            for name in names:
                if name != "Unknown":
                    present_students.add(name)
                    
        except Exception as e:
            print(f"Error processing frame: {str(e)}")
            continue
            
    cap.release()
    return present_students

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)