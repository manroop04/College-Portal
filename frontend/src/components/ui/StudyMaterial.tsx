import React from "react";
import "../../styles/StudyMaterialCard.css";

interface StudyMaterialCardProps {
  title: string;
  imageSrc: string;
  altText: string;
  onClick: () => void;
}

const StudyMaterialCard: React.FC<StudyMaterialCardProps> = ({
  title,
  imageSrc,
  altText,
  onClick,
}) => {
  return (
    <div className="card-container">
      <h2 className="card-title">{title}</h2>
      <img src={imageSrc} alt={altText} className="card-image" />
      <button className="card-button" onClick={onClick}>
        View
      </button>
    </div>
  );
};

export default StudyMaterialCard;
