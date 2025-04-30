import React, { useState, useEffect } from 'react';
import Sidebar from '../../../frontend/src/components/ui/Sidebar';
import { Student } from '../types';
import '../styles/LostFound.css';
import { useNavigate } from 'react-router-dom';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';

const LostFound: React.FC = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="lost-found" />
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="lost-found">
        <div className="lostandfound">
          <div className="buttons-container">
            <button
              className="lostandfounditem"
              id="lost"
              onClick={() => navigate('/lost')}
            >
              Lost
            </button>
            <button
              className="lostandfounditem"
              id="found"
              onClick={() => navigate('/found')}
            >
              Found
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LostFound;