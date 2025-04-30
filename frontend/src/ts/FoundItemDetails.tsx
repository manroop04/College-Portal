import React, { useState } from "react";
import Sidebar from '../../../frontend/src/components/ui/Sidebar';
import { useLocation } from 'react-router-dom';
import { FoundItem } from '../types';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import { Student } from '../types';
import '../styles/LostItemDetails.css';

const FoundItemDetail: React.FC = () => {
  const [student] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  const location = useLocation();
  const item = location.state?.item as FoundItem;

  if (!item) {
    return <div className="lost-detail-container">No item details available.</div>;
  }

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="lost-found" />
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="lost-found-item-page"> 
        <div className="lost-item-page">
          <h1>{item.name}</h1>
          <button>{item.category}</button>
          <div className="lost-detail-content">
            <p><strong>Product image</strong>  {item.image && (
              <img src={item.image} alt="Found item" className="lost-detail-image" />
            )}</p>
            <p><strong>Found Location</strong> <strong>{item.foundLocation}</strong></p>
            <p><strong>Found By</strong> <strong>{item.foundBy}</strong></p>
            <p><strong>Contact</strong> <strong>{item.contact}</strong></p>
            <p><strong>Enrollment No</strong>  <strong>{item.enrollment}</strong></p>
            <p><strong>Email id </strong>  <strong>{item.email}</strong></p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundItemDetail;
