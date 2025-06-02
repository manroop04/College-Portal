// src/components/ui/AssignmentDetailsCard.tsx
import React from "react";
import pdfIcon from "../../assets/pdf-icon.jpeg"; // replace with your pdf icon
import "../../styles/AssignmentDetailsCard.css";
interface AssignmentDetailsCardProps {
  title: string;
  description: string[];
  pdfName: string;
  deadlineText: string;
  onUpload: () => void;
  onSubmit: () => void;
}

const AssignmentDetailsCard: React.FC<AssignmentDetailsCardProps> = ({
  title,
  description,
  pdfName,
  deadlineText,
  onUpload,
  onSubmit,
}) => {
  return (
    <div className="assignment-card-wrapper">
      <div className="assignment-card">
        <div className="assignment-title">
          <h2>{title}</h2>
        </div>
        <hr className="assignment-divider" />

        <ol className="assignment-list">
          {description.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ol>

        <p className="assignment-note">
          Note: Submit your answer before the deadline. Submission after the given deadline will not be entertained.
        </p>

        <div className="assignment-pdf">
          <img src={pdfIcon} alt="PDF Icon" className="assignment-pdf-icon" />
          <span>{pdfName}</span>
        </div>

        <div className="assignment-footer">
          <div className="assignment-deadline">
            Deadline: {deadlineText}
          </div>
          <div className="assignment-actions">
            <button className="upload-btn" onClick={onUpload}>Upload</button>
            <button className="submit-btn" onClick={onSubmit}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailsCard;