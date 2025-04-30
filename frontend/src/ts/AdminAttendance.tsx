import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/ui/Sidebar';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import AttendanceCard from '../components/ui/AttendanceCard';
import '../styles/AdminAttendance.css';


interface Student {
  id: string;
  name: string;
  profileImage: string;
}

const AdminAttendance = () => {
  const navigate = useNavigate();
  
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="attendance" />
      
      <div className="content">
        <header className="page-header">
          <h1>Admin</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>

        <div className="attendance-container">
          <div className="attendance-actions">
            <button 
              className="attendance-button take-attendance"
              onClick={() => navigate('/take-attendance')}
            >
              <span className="button-icon">📷</span>
              <span className="button-text">Take Attendance</span>
            </button>

            <button 
              className="attendance-button view-attendance"
              onClick={() => navigate('/view-attendance')}
            >
              <span className="button-icon">📊</span>
              <span className="button-text">View Attendance</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;