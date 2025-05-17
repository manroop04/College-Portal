import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import AttendanceCard from '../components/ui/AttendanceCard';
import { Student, CourseAttendance } from '../types';
import '../styles/Attendance.css';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';

const AttendancePage: React.FC = () => {
  const [student] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,

  });
  
  const [courses] = useState<CourseAttendance[]>([
    {
      courseName: 'DBMS',
      attendancePercentage: 80,
      totalClasses: 50,
      attendedClasses: 40,
      absentClasses: 10
    },
    {
      courseName: 'CN',
      attendancePercentage: 90,
      totalClasses: 50,
      attendedClasses: 45,
      absentClasses: 5
    },
    {
      courseName: 'Sports',
      attendancePercentage: 75,
      totalClasses: 48,
      attendedClasses: 36,
      absentClasses: 12
    },
    {
      courseName: 'OOPS',
      attendancePercentage: 40,
      totalClasses: 20,
      attendedClasses: 8,
      absentClasses: 12
    },
    {
      courseName: 'Maths',
      attendancePercentage: 60,
      totalClasses: 45,
      attendedClasses: 27,
      absentClasses: 18
    }
  ]);

  const getAttendanceLevel = (percentage: number) => {
    if (percentage >= 80) return 'high';
    if (percentage >= 60) return 'medium';
    return 'low';
  };

  return (
    <div className="attendance-page">
      <Sidebar student={student} activePage="attendance" />
      
      <main className="content">
        <header className="page-header">
          <div>
            <h1>Student</h1>
          </div>
          <img src={logo} alt="School Logo" className="header-logo" />
        </header>
        
        <div className="attendance-cards">
          {courses.map(course => (
            <div 
              key={course.courseName}
              className="attendance-card"
              data-percentage={getAttendanceLevel(course.attendancePercentage)}
            >
              <AttendanceCard course={course} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AttendancePage;