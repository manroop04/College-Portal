import React from 'react';
import { Student } from '../../types';
import '../../styles/Sidebar.css';

interface SidebarProps {
  student: Student;
  activePage: 'dashboard' | 'inbox' | 'timetable' | 'profile' | 'attendance' | 'lost-found' | 'classroom';
  onClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ student, activePage, onClose, isMobile }) => {
  const navItems = [
    { id: 'dashboard', icon: 'grid_view', label: 'Dashboard' },
    { id: 'inbox', icon: 'email', label: 'Inbox' },
    { id: 'timetable', icon: 'calendar_today', label: 'Timetable' },
    { id: 'profile', icon: 'person', label: 'Profile' },
    { id: 'attendance', icon: 'check_circle', label: 'Attendance' },
    { id: 'lost-found', icon: 'search', label: 'Lost & Found' },
    { id: 'classroom', icon: 'school', label: 'Classroom' }
  ];

  return (
    <div className={`sidebar ${isMobile ? 'mobile' : ''}`}>
      {isMobile && (
        <button className="sidebar-close" onClick={onClose}>
          <span className="material-icons">close</span>
        </button>
      )}

      <div className="sidebar-content">
        <div className="profile-section">
          <div className="profile-image">
            <img src={student.profileImage} alt={student.name} />
          </div>
          <h3 className="student-name">{student.name}</h3>
          <p className="student-role">Student</p>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`/${item.id}`}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
            >
              <span className="material-icons nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button">
            <span className="material-icons">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;