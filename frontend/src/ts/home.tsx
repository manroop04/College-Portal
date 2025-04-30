import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './home'; // Assuming the path is correct
import RegisterStudentPage from './RegisterStudent'; // Your student registration page
import TakeAttendancePage from './TakeAttendance'; // Your attendance page
import ViewAttendancePage from './ViewAttendance'; // Your attendance view page

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register-student" element={<RegisterStudentPage />} />
        <Route path="/take-attendance" element={<TakeAttendancePage />} />
        <Route path="/view-attendance" element={<ViewAttendancePage />} />
      </Routes>
    </Router>
  );
};

export default App;
