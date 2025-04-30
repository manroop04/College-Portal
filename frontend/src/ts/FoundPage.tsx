import React, { useState } from "react";
import { FoundItem, Student } from "../types/index";
import ItemCard from "../components/ui/ItemCard";
import ItemForm from "../components/ui/ItemForm";
import PlusButton from "../components/ui/PlusButton";
import Sidebar from "../components/ui/Sidebar";
import profileImg from "../assets/profile.png";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import '../styles/Lost.css'; 
import key from '../assets/Key.jpg'

const FoundPage: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  const [items, setItems] = useState<FoundItem[]>([
    {
      id: "1",
      category: "Key",
      name: "Key Chain",
      date: "01/03/2025",
      description: "Found near staircase",
      contact: "9876543210",
      image: key,
      foundBy: "Alice",
      foundLocation: "Main Building Staircase",
      enrollment : "lCS20220XX",
      email : "lcs20220XX@iiitl.ac.in"
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleAddItem = (item: FoundItem) => {
    setItems(prev => [...prev, item]);
    setShowForm(false);
  };

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="lost-found" />
      <div className="content">
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
      <div>
        <h1 className="found-item-heading">FOUND</h1>
        <PlusButton onClick={() => setShowForm(!showForm)} />
        {showForm && <ItemForm type="found" onSubmit={(item) => handleAddItem(item as FoundItem)} />}
        <div className="Found-item">
          {items.map(item => (
            <ItemCard
              key={item.id}
              item={item}
              onClick={() => navigate(`/found/${item.id}`, { state: { item } })}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundPage;