import React from "react";
import "../../styles/Assignment.css";
import done from "../../assets/done.png"
import notDone from "../../assets/not-done.jpeg"
interface AssignmentTileProps {
  title: string;
  missingCheck: boolean;
  submittedCheck: boolean;
  dueDate: string;
  onClick: () => void;
}

const AssignmentTile: React.FC<AssignmentTileProps> = ({
  title,
  missingCheck,
  submittedCheck,
  dueDate,
  onClick,
}) => {
  return (
    <div className="assignment-container">
        <h3 className="missing-check">{missingCheck? "Missing" : "Assigned"}</h3>
      <h2 className="assignment-title">{title}</h2>
      <h3 className="due-date">{dueDate}</h3>
      <div className="submitted-check">
        <img 
        src={submittedCheck ? done : notDone} 
        alt={submittedCheck? "Submitted" : "Not Submitted"}></img>
        </div>
      <button className="assignment-button" onClick={onClick}>
        View
      </button>
    </div>
  );
};

export default AssignmentTile;
