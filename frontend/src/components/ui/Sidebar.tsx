import React from 'react';
import { Student } from '../../types';
import '../../styles/Sidebar.css';


interface SidebarProps {
  student: Student;
  activePage: 'dashboard' | 'inbox' | 'timetable' | 'profile' | 'attendance' | 'lost-found' | 'classroom';
}

const Sidebar: React.FC<SidebarProps> = ({ student, activePage }) => {
  return (
    <div className="sidebar">
      <div className="profile-section">
        <div className="profile-image">
          <img src={student.profileImage} alt={student.name} />
        </div>
        <h3 className="student-name">{student.name}</h3>
      </div>

      <nav className="nav-links">
        <a href="/dashboard" className={`nav-item ${activePage === 'dashboard' ? 'active' : ''}`}>
          <i className="icon dashboard-icon"></i>
          <span>Dashboard</span>
        </a>
        
        <a href="/inbox" className={`nav-item ${activePage === 'inbox' ? 'active' : ''}`}>
          <i className="icon inbox-icon"></i>
          <span>Inbox</span>
        </a>
        
        <a href="/timetable" className={`nav-item ${activePage === 'timetable' ? 'active' : ''}`}>
          <i className="icon timetable-icon"></i>
          <span>Timetable</span>
        </a>
        
        <a href="/profile" className={`nav-item ${activePage === 'profile' ? 'active' : ''}`}>
          <i className="icon profile-icon"></i>
          <span>Profile</span>
        </a>
        
        <a href="/attendance" className={`nav-item ${activePage === 'attendance' ? 'active' : ''}`}>
          <i className="icon attendance-icon"></i>
          <span>Attendance</span>
        </a>
        
        <a href="/lost-found" className={`nav-item ${activePage === 'lost-found' ? 'active' : ''}`}>
          <i className="icon lost-found-icon"></i>
          <span>Lost and Found</span>
        </a>
        
        <a href="/classroom" className={`nav-item ${activePage === 'classroom' ? 'active' : ''}`}>
          <i className="icon classroom-icon"></i>
          <span>Classroom</span>
        </a>
      </nav>
      
      <div className="logout-section">
        <button className="logout-button">
          <i className="icon logout-icon"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;