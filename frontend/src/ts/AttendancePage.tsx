import React, { useState, useEffect } from 'react';
import Sidebar from '../components/ui/Sidebar';
import AttendanceCard from '../components/ui/AttendanceCard';
import { Student, CourseAttendance } from '../types';
import '../styles/Attendance.css';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import axios from 'axios';

const AttendancePage: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });
  
  const [courses, setCourses] = useState<CourseAttendance[]>([
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
    // {
    //   courseName: 'Maths',
    //   attendancePercentage: 75,
    //   totalClasses: 48,
    //   attendedClasses: 36,
    //   absentClasses: 12
    // },
    {
      courseName: 'Sports',
      attendancePercentage: 40,
      totalClasses: 20,
      attendedClasses: 8,
      absentClasses: 12
    },
    {
      courseName: 'OOPS',
      attendancePercentage: 60,
      totalClasses: 45,
      attendedClasses: 27,
      absentClasses: 18
    }
  ]);

  useEffect(() => {
    interface MathsAttendanceAPIResponse {
      roll_no: string;
      subject: string;
      attended: number;
      absent: number;
      total_classes: number;
      attendance_percentage: number;
    }
  
    axios
    .get<MathsAttendanceAPIResponse[]>('http://localhost:5000/api/attendance/maths')
      .then((res) => {
        const student = res.data.find((s) => s.roll_no === 'LCI2022026'); // Can replace dynamically later for other students
        if (student) {
          const mathsData: CourseAttendance = student
            ? {
            courseName: student.subject,
            totalClasses: student.total_classes,
            attendedClasses: student.attended,
            absentClasses: student.absent,
            attendancePercentage: student.attendance_percentage,
            }
          : {
            courseName: 'Maths',
            totalClasses: 0,
            attendedClasses: 0,
            absentClasses: 0,
            attendancePercentage: 0,
            };

          setCourses((prev) => [
            ...prev.filter(course => course.courseName !== 'Maths'),
            mathsData
          ]);          
        }
      })
      .catch((err) => {
        console.error('Failed to fetch Maths attendance:', err);
      });
  }, []);
  
  
  return (
    <div className="attendance-page">
      <Sidebar student={student} activePage="attendance" />
      
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        
        <div className="attendance-cards">
          {courses.map(course => (
            <AttendanceCard key={course.courseName} course={course} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;