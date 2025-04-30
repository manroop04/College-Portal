import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterStudent.css';

interface RegisterStudentProps {
  initialName?: string;
  onComplete?: (studentName: string, imageCount: number) => void;
  showBackButton?: boolean;
}

interface RegisteredStudent {
  name: string;
  imageCount?: number;
}


export default function RegisterStudent({ initialName = '', onComplete, showBackButton = true }: RegisterStudentProps) {
  const navigate = useNavigate();
  const [lastCapturedImage, setLastCapturedImage] = useState<string | null>(null);
  const [studentName, setStudentName] = useState(initialName);
  const [capturedFacesCount, setCapturedFacesCount] = useState(0);
  const [registerStatus, setRegisterStatus] = useState('');
  const [videoVisible, setVideoVisible] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [registeredStudents, setRegisteredStudents] = useState<RegisteredStudent[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 500 },
          height: { ideal: 500 },
          facingMode: 'user' 
        },
        audio: false 
      });
      
      if (videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
        videoRef.current.play().catch(error => {
          console.error("Error playing video:", error);
        });
      }
    } catch (error) {
      console.error("Camera error:", error);
      alert("Could not access camera. Please check permissions.");
      throw error;
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const takeImages = async () => {
    if (!studentName?.trim()) {
      alert("Please enter student name");
      return;
    }
    
    try {
      setVideoVisible(true);
      setIsRecording(true);
      setCapturedFacesCount(0);
      await startCamera();
    } catch (error) {
      setVideoVisible(false);
      setIsRecording(false);
    }
  };

  const capture = async () => {
    if (!videoRef.current || !studentName.trim()) return;

    try {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error("Could not get canvas context");

      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      
      const blob = await new Promise<Blob|null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9);
      });

      if (!blob) throw new Error("Failed to create image blob");

      // Create preview URL
      const imageUrl = URL.createObjectURL(blob);
      setLastCapturedImage(imageUrl);

      // Prepare form data
      const formData = new FormData();
      formData.append('image', blob, `${studentName}_${Date.now()}.jpg`);
      formData.append('student_name', studentName);

      // Send to API
      const response = await axios.post('http://localhost:5000/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data?.image_count !== undefined) {
        setCapturedFacesCount(response.data.image_count);
        setRegisterStatus(`${studentName}: ${response.data.image_count} images captured`);
        return true;
      }
    } catch (error) {
      console.error('Capture failed:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      alert(`Capture failed: ${message}`);
    }
    return false;
  };

  const register = async () => {
    if (!studentName.trim()) {
      alert("Please enter student name");
      return;
    }
    
    if (capturedFacesCount === 0) {
      alert("Please capture or upload at least one face image");
      return;
    }
  
    try {
      const response = await axios.post('http://localhost:5000/api/encode', {
        student_name: studentName
      });
      
      if (response.data.status === 'success') {
        setRegisterStatus(`${studentName} successfully registered with ${capturedFacesCount} faces`);
        // Refresh the list of registered students
        // fetchRegisteredStudents();
        return true;
      }
    } catch (error) {
      const err = error as AxiosError | Error;
      const message = axios.isAxiosError(err) 
        ? err.response?.data?.error || err.message
        : err.message;
      // alert(`Registration failed: ${message}`);
    }
    return false;
  };

  const quit = async () => {
    stopCamera();
    setVideoVisible(false);
    setIsRecording(false);
    
    if (capturedFacesCount > 0) {
      try {
        const success = await register();
        if (success && onComplete) {
          onComplete(studentName, capturedFacesCount);
          alert(`${studentName} registered with ${capturedFacesCount} faces`);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Registration failed';
        // alert(`Registration failed: ${message}`);
      }
    } else {
      alert('No faces were successfully captured and saved');
    }
  };

  const routing = () =>{
    navigate('/dashboard')
  }

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!studentName.trim()) {
      alert("Please enter student name");
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
      formData.append('student_name', studentName);

      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 'success') {
        setCapturedFacesCount(files.length);
        setRegisterStatus(`${files.length} images uploaded for ${studentName}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload images');
    }
  };

  // const register = async () => {
  //   if (!studentName.trim()) {
  //     alert("Please enter student name");
  //     return;
  //   }
    
  //   if (capturedFacesCount === 0) {
  //     alert("Please capture or upload at least one face image");
  //     return;
  //   }
  
  //   try {
  //     const response = await axios.post('http://localhost:5000/api/encode');
      
  //     if (response.data.status === 'success') {
  //       setRegisterStatus(`${studentName} successfully registered with ${capturedFacesCount} faces`);
  //     }
  //   } catch (error) {
  //     const message = axios.isAxiosError(error) 
  //       ? error.response?.data?.error || error.message
  //       : error instanceof Error ? error.message : 'Registration failed';
  //     alert(`Registration failed: ${message}`);
  //   }
  // };

  const viewAttendance = () => {
    navigate('/attendance');
  };

  const goBack = () => {
    navigate('/sign-up');
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h1 className="register-title">Student Enrollment</h1>
        <p className="register-subtitle">Click images from different angles for attendance</p>
      </div>
  
      {showBackButton && (
        <button className="back-button" onClick={goBack}>
          ← Back
        </button>
      )}
  
      <div className="form-section">
        <div className="flex items-center justify-between">
          <label className="form-label">Student Full Name:</label>
          <input
            type="text"
            className="form-input w-2/3"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student's full name"
          />
        </div>
      </div>
  
      <div className="action-buttons">
        <button 
          className={`btn ${isRecording ? 'btn-primary cursor-not-allowed' : 'btn-primary'}`}
          onClick={takeImages}
          disabled={isRecording}
        >
          {isRecording ? (
            <>
              <span className="recording-indicator mr-2">●</span> 
              <span>Recording...</span>
            </>
          ) : (
            'Start Camera'
          )}
        </button>
        
        {/* <button className="btn btn-success" onClick={handleFileUploadClick}>
          Upload Images
        </button>
        <input 
          type="file" 
          accept="image/*" 
          multiple
          className="hidden" 
          onChange={uploadImage}
          ref={fileInputRef}
        /> */}
      </div>
  
      {videoVisible && (
        <div className="camera-container">
          <div className="camera-split-view">
            {/* Live Camera Feed (Left Side) */}
            <div className="camera-feed">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
              />
              {capturedFacesCount > 0 && (
                <div className="capture-count">
                  Captured: {capturedFacesCount}
                </div>
              )}
            </div>
  
            {/* Last Captured Image Preview (Right Side) */}
            <div className={`image-preview ${!lastCapturedImage ? 'empty' : ''}`}>
              {lastCapturedImage ? (
                <img src={lastCapturedImage} alt="Last captured preview" />
              ) : (
                <span>No image captured yet</span>
              )}
            </div>
          </div>
          
          <div className="camera-controls">
            <button 
              className="btn btn-warning flex-1"
              onClick={capture}
            >
              <span className="mr-2">📸</span> Capture
            </button>
            <button 
              className="btn btn-danger flex-1"
              onClick={quit}
            >
              <span className="mr-2">⏹️</span> Stop
            </button>
          </div>
        </div>
      )}

     
  
      {registerStatus && (
        <div className={`status-message ${
          registerStatus.includes('success') ? 'status-success' : 'status-info'
        }`}>
          {registerStatus}
        </div>
      )}
       <div>
        <button className='btn btn-success' onClick={routing}>
          Complete Signup
        </button>

      </div>
  
      {/* <div className="students-list">
        <h2 className="students-title">Registered Students</h2>
        <div className="students-container">
          {registeredStudents.length > 0 ? (
            <ul>
              {registeredStudents.map((student, index) => (
                <li key={index} className="student-item">
                  {student.name} 
                  {student.imageCount && (
                    <span className="student-image-count">({student.imageCount} images)</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No students registered yet</p>
          )}
        </div>
      </div> */}
  
      {/* <div className="action-buttons">
        <button 
          className="btn btn-secondary"
          onClick={viewAttendance}
        >
          <span className="mr-2">📊</span> View Attendance
        </button>
        <button 
          className="btn btn-secondary"
          onClick={goBack}
        >
          <span className="mr-2">←</span> Back to Home
        </button>
      </div> */}
    </div>
  )};