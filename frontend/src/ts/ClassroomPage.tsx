import React, { useState } from "react";
import { Course, Student } from "../types";
import Sidebar from "../components/ui/Sidebar";
import CourseTile from "../components/ui/CourseTile";
import profileImg from "../assets/profile.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import '../styles/Classroom.css';
import aiImg from '../assets/math.jpeg';
import mathImg from '../assets/math.jpeg';
import mlImg from '../assets/math.jpeg';
import iotImg from '../assets/math.jpeg';

const ClassroomPage: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      code: "SS",
      name: "Artificial Intelligence",
      backgroundImage: aiImg,
      teacher: "Saurabh Shukla",
      assignments: []
    },
    {
      id: "2",
      code: "SSB",
      name: "Mathematics for CS",
      backgroundImage: mathImg,
      teacher: "Sirsendu Barman",
      assignments: []
    },
    {
      id: "3",
      code: "SKT",
      name: "Machine Learning",
      backgroundImage: mlImg,
      teacher: "Sushil Kumar Tiwari",
      assignments: []
    },
    {
      id: "4",
      code: "NA",
      name: "AI for IoT",
      backgroundImage: iotImg,
      teacher: "Niharika Anand",
      assignments: []
    }
  ]);

  const navigate = useNavigate();

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="classroom" />
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="classroom-container">
          <h1 className="semester-title">Semester 5 courses</h1>
          <div className="courses-grid">
            {courses.map(course => (
              <CourseTile
                key={course.id}
                course={course}
                onClick={() => navigate(`/course/${course.id}`)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassroomPage;