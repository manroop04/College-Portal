// src/pages/AssignmentPage.tsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar";
import profileImg from "../assets/profile.png";
import logo from "../assets/logo.png";
import { Student } from "../types";
import AssignmentDetailsCard from "../components/ui/AssignmentDetailsCard";

const AssignmentPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const [student] = useState<Student>({
    id: "1",
    name: "John Smith",
    profileImage: profileImg,
  });

  // Convert "ai-assignment-01" to "AI Assignment 01"
  const formattedTitle = assignmentId
    ? assignmentId
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="classroom" />
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <h1 className="semester-title">{formattedTitle}</h1>
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
          <p className="text-lg text-gray-700">
            <AssignmentDetailsCard
  title="ASSIGNMENT 1"
  description={[
    "Write questions and their respective answer in a notebook.",
    "Scan the answers",
    "Create a pdf of scanned answer",
    "Attach it to the google classroom"
  ]}
  pdfName="questions.pdf"
  deadlineText="Tomorrow 11:59pm"
  onUpload={() => alert("Upload clicked")}
  onSubmit={() => alert("Submit clicked")}
/>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
