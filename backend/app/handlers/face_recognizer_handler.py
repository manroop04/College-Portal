# backend/app/handlers/face_recognition_handler.py
import cv2
import pickle
import pandas as pd
import numpy as np
from datetime import datetime
from face_recognizer.recognize_faces_video import FaceRecognizer
import config

class FaceRecognitionHandler:
    def __init__(self):
        self.recognizer = FaceRecognizer(config.PROTOTXT_PATH, config.MODEL_PATH)
        self.data = pickle.loads(open(config.ENCODINGS_PATH, "rb").read())
        self.df = pd.read_csv(config.ATTENDANCE_PATH, index_col=0)
        self.counter = {name: 0 for name in self.data["names"]}

    def recognize_faces(self, image: np.ndarray):
        boxes, encodings = self.recognizer.encodeFace(image)
        names = self.recognizer.matchFace(encodings, self.data, self.counter)

        results = []
        for ((startX, startY, endX, endY), name) in zip(boxes, names):
            results.append({
                "box": [int(startX), int(startY), int(endX), int(endY)],
                "name": name
            })

        return results

    def save_attendance(self):
        self.counter = {k: 1 if v >= 10 else 0 for k, v in self.counter.items()}
        date_col = datetime.now().strftime("%A, %b %d, %Y %H:%M")
        self.df[date_col] = self.df["names"].map(lambda name: self.counter[name])
        self.df.to_csv(config.ATTENDANCE_PATH)
