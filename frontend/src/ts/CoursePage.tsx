// pages/StudyMaterialPage.tsx
import React, { useState } from "react";
import StudyMaterialCard from "../components/ui/StudyMaterial";
import "../styles/StudyMaterialCard.css";
import profileImg from "../assets/profile.png";
import logo from "../assets/logo.png";
import { Student } from "../types";
import Sidebar from "../components/ui/Sidebar";
import courseNotesImg from "../assets/course-notes.png"
import bookImg from "../assets/book.png"
import referenceVideoImg from "../assets/reference-video.png"
import AssignmentTile from "../components/ui/AssignmentTile";
import { useNavigate } from "react-router-dom";

const StudyMaterialPage: React.FC = () => {
  const navigate = useNavigate();
  const handleClickStudyMaterial = (type: string) => {
    alert(`Opening ${type}`);
  };
  // const handleClickAssignment = (type: string) => {
  //   alert(`Opening ${type}`);
  // };
    const [student, setStudent] = useState<Student>({
        id: '1',
        name: 'John Smith',
        profileImage: profileImg,
      });
      const handleClickAssignment = (type: string) => {
    // Example: convert title to ID-friendly format or fetch real ID
    const id = type.replace(/\s+/g, '-').toLowerCase(); // e.g., "AI Assignment 01" → "ai-assignment-01"
    navigate(`/assignment/${id}`);
  };
  return (
     <div className="main-content">
      <Sidebar student={student} activePage="classroom" />
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <h1 className="semester-title">Study Material </h1>
        <div className="study-material-container">
            <StudyMaterialCard
                title="Course Notes"
                imageSrc={courseNotesImg}
                altText="Course Notes"
                onClick={() => handleClickStudyMaterial("Course Notes")}
            />
            <StudyMaterialCard
                title="Reference Book"
                imageSrc={bookImg}
                altText="Reference Book"
                onClick={() => handleClickStudyMaterial("Reference Book")}
            />
            <StudyMaterialCard
                title="Reference Videos"
                imageSrc={referenceVideoImg}
                altText="Reference Videos"
                onClick={() => handleClickStudyMaterial("Reference Videos")}
            />
        </div>
        <h1 className="semester-title">Assignments</h1>
         <div className="study-material-container">
            <AssignmentTile
                      title="AI Assignment 01"
                       missingCheck={true}
                       submittedCheck={false} 
                       dueDate={"2025-05-04"}
                      onClick={() => handleClickAssignment('AI Assignment 02')}            />
            <AssignmentTile
                title="AI Assignment 02"
                       missingCheck={false}
                       submittedCheck={true} 
                       dueDate={"2025-05-04"}
                onClick={() => handleClickAssignment('AI Assignment 02')}
            />
        </div>
      </div>
    </div>
   
  );
};

export default StudyMaterialPage;
