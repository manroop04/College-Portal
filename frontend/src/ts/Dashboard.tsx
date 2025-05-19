import React, { useState, useEffect } from 'react';
import { Clock, CalendarDays, TrendingUp, Plus, X } from "lucide-react";
import Sidebar from '../components/ui/Sidebar';
import '../styles/Dashboard.css';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';


const Dashboard = () => {
  const [student] = useState({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg
  });

  const [time, setTime] = useState(new Date());
  const [gpa, setGpa] = useState(8.62);
  const [todos, setTodos] = useState<string[]>([]);
  const [newTodo, setNewTodo] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Add new todo
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, newTodo]);
      setNewTodo('');
    }
  };

  // Remove todo
  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  // Calendar setup
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1).getDay();

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="dashboard" />
      
      <div className="content">
        {/* Top Header - Similar to LostPage */}
        <header className="page-header">
          <h1>Student</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>

        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1>Welcome back, {student.name}!</h1>
            <p className="quote">"Education is the passport to the future, for tomorrow belongs to those who prepare for it today."</p>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="dashboard-widgets">
          {/* GPA Tracker */}
          <div className="widget gpa-tracker">
            <div className="widget-header">
              <TrendingUp size={20} />
              <h3>GPA Tracker</h3>
            </div>
            <div className="gpa-display">
              <span className="gpa-value">{gpa.toFixed(2)}</span>
              <span className="gpa-scale">/ 10.0</span>
            </div>
            <div className="gpa-progress-container">
              <div 
                className="gpa-progress-bar" 
                style={{ width: `${(gpa / 10.0) * 100}%` }}
              ></div>
            </div>
            <div className="gpa-message">
              {gpa >= 8 ? 'Excellent standing!' : 'Keep improving!'}
            </div>
          </div>

          {/* Clock Widget */}
          <div className="widget clock-widget">
            <div className="widget-header">
              <Clock size={20} />
              <h3>Current Time</h3>
            </div>
            <div className="time-display">
              {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="date-display">
              {time.toLocaleDateString([], { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </div>

          {/* Todo Widget */}
          <div className="widget todo-widget">
            <div className="widget-header">
              <h3>My To-Do List</h3>
              <span className="todo-count">{todos.length}</span>
            </div>
            <div className="todo-input-container">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              />
              <button onClick={addTodo} className="add-button">
                <Plus size={10} />
              </button>
            </div>
            <ul className="todo-list">
              {todos.map((todo, index) => (
                <li key={index} className="todo-item">
                  <span>{todo}</span>
                  <button 
                    onClick={() => removeTodo(index)} 
                    className="delete-button"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Calendar Widget */}
          <div className="widget calendar-widget">
            <div className="widget-header">
              <CalendarDays size={20} />
              <h3>{currentMonth} {currentYear}</h3>
            </div>
            <div className="calendar-grid">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                <div key={day} className="day-header">{day}</div>
              ))}
              {Array(firstDayOfMonth).fill(null).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}
              {Array(daysInMonth).fill(null).map((_, i) => {
                const day = i + 1;
                const isToday = day === today.getDate() && today.getMonth() === new Date().getMonth();
                return (
                  <div 
                    key={day} 
                    className={`calendar-day ${isToday ? 'today' : ''}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;