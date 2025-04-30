import React, { useState } from "react";
import { LostItem } from "../types/index";
import ItemCard from "../components/ui/ItemCard";
import ItemForm from "../components/ui/ItemForm";
import PlusButton from "../components/ui/PlusButton";
import { useNavigate } from "react-router-dom";
import Sidebar from '../components/ui/Sidebar';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import { Student } from '../types';
import '../styles/Lost.css';
import airpords from '../assets/AirPods.jpg';
const LostPage: React.FC = () => {
    const [student, setStudent] = useState<Student>({
        id: '1',
        name: 'John Smith',
        profileImage: profileImg,
    });
    const [items, setItems] = useState<LostItem[]>([{
        id: "1",
        category: "Electronics",
        name: "Apple AirPods Pro2",
        date: "2025-01-03",
        description: "Lost near library",
        image: airpords,
        contact: "9876543210",
        location: "Library",
        owner: "John Doe",
        enrollment: "IIITL12345",
        email: "lcs20220XX@iiitl.ac.in"
    }]);

    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();

    const handleAddItem = (item: LostItem) => {
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
                    <h1 className="lost-item-heading">LOST</h1>
                    <PlusButton onClick={() => setShowForm(!showForm)} />
                    {showForm && <ItemForm type="lost" onSubmit={(item) => handleAddItem(item as LostItem)} />}
                    <div className="Lost-item">
                        {items.map(item => (
                            <ItemCard
                                key={item.id}
                                item={item}
                                onClick={() => navigate(`/lost/${item.id}`, { state: { item } })}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LostPage;
