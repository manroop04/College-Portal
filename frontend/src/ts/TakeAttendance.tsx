import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import Card from '../components/ui/card';
import { Loader2, Upload, CheckCircle2, ClipboardList } from "lucide-react";
import { Progress } from '../components/ui/Progress';
import { Badge } from '../components/ui/Badge';
import Sidebar from '../components/ui/Sidebar';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import '../styles/TakeAttendance.css';

interface RecognizedFace {
  name: string;
  confidence: number;
}

interface AttendanceData {
  name: string;
  attendancePercentage: number;
  status: string;
}

const TakeAttendance: React.FC = () => {
  const [student] = useState({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  const [displayText, setDisplayText] = useState<string>('');
  const [recognizedFaces, setRecognizedFaces] = useState<RecognizedFace[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData[]>([]);
  const [processing, setProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const fetchAttendance = async () => {
    try {
      setDisplayText('Fetching attendance data...');
      const response = await axios.get('http://localhost:5000/api/attendance/summary');
      
      if (response.data.error) {
        throw new Error(response.data.error);
      }
    
      const data = response.data;
      const attendanceData: AttendanceData[] = Object.entries(data).map(([name, details]: [string, any]) => ({
        name: name.replace(/_/g, " "),
        attendancePercentage: details.attendance_percentage,
        status: details.status
      }));
      
      setAttendance(attendanceData);
      setDisplayText('Attendance data loaded successfully');
      
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setDisplayText(`Failed to fetch attendance: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setAttendance([]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setProcessing(true);
    setUploadProgress(0);
    setDisplayText('Starting video processing...');
    setRecognizedFaces([]);
  
    try {
      const formData = new FormData();
      formData.append('video', file);

      const uploadResponse = await axios.post(
        'http://localhost:5000/api/upload/video',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(progress);
            }
          },
          timeout: 120000
        }
      );

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.message || 'Upload failed');
      }

      const recognizedNames: string[] = (uploadResponse.data as { recognized?: string[] }).recognized || [];
      setRecognizedFaces(recognizedNames.map((name: string) => ({
        name,
        confidence: 100
      })));
        
      await fetchAttendance();
      setDisplayText('Video processing completed!');

    } catch (error) {
      console.error('Upload/processing error:', error);
      let errorMessage = 'Processing failed';
      
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.error || 
                     error.message || 
                     'Network error';
      }
      
      setDisplayText(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="attendance" />
      
      <div className="content">
        <header className="page-header">
          <h1>Admin</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>

        <div className="attendance-container">
          <Card className="upload-section">
            <Card.Header>
              <Card.Title>Upload Attendance Video</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="upload-area">
                <Upload className="upload-icon" size={48} />
                <h3>Drag & drop your video file here</h3>
                <p className="upload-subtext">or</p>
                
                <Button asChild className="upload-button">
                  <label htmlFor="videoUpload">
                    {/* Select File */}
                    <input
                      id="videoUpload"
                      type="file"
                      accept="video/*"
                      onChange={handleUpload}
                      disabled={processing}
                    />
                  </label>
                </Button>
                
                <p className="upload-note">
                  Supported formats: MP4, MOV, AVI (Max 100MB)
                </p>
              </div>
            </Card.Content>
          </Card>

          {processing && (
            <Card className="processing-card">
              <Card.Header>
                <Card.Title>Processing Video</Card.Title>
              </Card.Header>
              <Card.Content className="processing-content">
                <Loader2 className="spinner" />
                <Progress value={uploadProgress} className="progress-bar" />
                <span>{uploadProgress}% uploaded</span>
                <p className="status-text">{displayText}</p>
              </Card.Content>
            </Card>
          )}

          {recognizedFaces.length > 0 && (
            <Card className="results-section">
              <Card.Header>
                <Card.Title>Attendance Results</Card.Title>
              </Card.Header>
              <Card.Content>
                <div className="results-grid">
                  <div className="recognized-section">
                    <h3>Recognized Students</h3>
                    <ul className="student-list">
                      {recognizedFaces.map((face, index) => (
                        <li key={index} className="student-item">
                          <CheckCircle2 className="success-icon" />
                          <span className="student-name">{face.name}</span>
                          <Badge variant="success">Verified</Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="stats-section">
                    <h3>Summary</h3>
                    <div className="stats-grid">
                      <div className="stat-card present">
                        <span className="stat-value">{recognizedFaces.length}</span>
                        <span className="stat-label">Present</span>
                      </div>
                      <div className="stat-card total">
                        <span className="stat-value">{attendance.length}</span>
                        <span className="stat-label">Total</span>
                      </div>
                      <div className="stat-card percentage">
                        <span className="stat-value">
                          {((recognizedFaces.length / (attendance.length || 1)) * 100).toFixed(1)}%
                        </span>
                        <span className="stat-label">Attendance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>
              <Card.Footer className="results-footer">
                <Button 
                  onClick={() => navigate('/view-attendance')}
                  variant="secondary"
                >
                  <ClipboardList className="button-icon" />
                  View Full Records
                </Button>
              </Card.Footer>
            </Card>
          )}

          {displayText && !processing && !recognizedFaces.length && (
            <Card className="status-card">
              <Card.Content>
                <p>{displayText}</p>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;