import React from "react";
import { Course } from "../../types";

interface CourseTileProps {
  course: Course;
  onClick: () => void;
}

const getCodeColor = (code: string) => {
  switch(code) {
    case "SS": return "#7BAF47"; // Blue
    case "SSB": return "#A17B9D"; // Red
    case "SKT": return "#DB7878"; // Yellow
    case "NA": return "#E3A677"; // Green
    default: return "#5F6368"; // Gray
  }
};

const CourseTile: React.FC<CourseTileProps> = ({ course, onClick }) => {
  const codeColor = getCodeColor(course.code);
  
  return (
    <div className="course-tile" onClick={onClick}>
      <div className="course-name-container">
        <div className="code-bubble" style={{ backgroundColor: codeColor }}>
        {course.code}
      </div>
        <div className="course-name">{course.name}</div>
      </div>
    </div>
  );
};

export default CourseTile;