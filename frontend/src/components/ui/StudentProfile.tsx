import React from 'react';
import { Student } from "../../types/index";
import '../styles/StudentProfile.css';

interface StudentProfileProps {
  student: Student;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ student }) => {
  return (
    <div className="student-profile-header">
      <div className="student-avatar">
        <img src={student.profileImage} alt={student.name} />
      </div>
      <div className="student-info">
        <h2 className="student-name">{student.name}</h2>
        <p className="student-id">ID: {student.id}</p>
      </div>
    </div>
  );
};

export default StudentProfile;