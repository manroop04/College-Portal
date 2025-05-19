// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google'; // <-- Import this

import { Button } from '../components/ui/button';
import TakeAttendance from './TakeAttendance';
import ViewAttendance from './ViewAttendance';
import RegisterStudent from './RegisterStudent';
import AttendancePage from './AttendancePage';
import TimetablePage from './TimetablePage';
import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import LostAndFoundPage from "./LostFoundPage";
import LostItemsPage from "./LostPage";
import FoundItemsPage from "./FoundPage";
import LostItemDetail from "./LostItemDetails";
import FoundItemDetail from "./FoundItemDetails";
import Dashboard from "./Dashboard"
import AdminAttendance from "./AdminAttendance"
import ClassroomPage from './ClassroomPage';
import Inbox from "./Inbox";
const theme = createTheme();

const App = () => {
  return (
    <GoogleOAuthProvider clientId="703173289000-1cv9pbio5nl31q8vaq7s7uona6lbh81c.apps.googleusercontent.com"> {/* 🔑 Add your Google OAuth Client ID */}
      <ThemeProvider theme={theme}>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-lg">
              <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                  <div className="flex items-center space-x-4">
                    {/* Navigation buttons can go here */}
                  </div>
                </div>
              </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/sign-up" element={<SignupPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route path="/timetable" element={<TimetablePage />} />
                <Route path="/take-attendance" element={<TakeAttendance />} />
                <Route path="/view-attendance" element={<ViewAttendance />} />
                <Route path="/register-student" element={<RegisterStudent />} />
                <Route path="/lost-found" element={<LostAndFoundPage />} />
                <Route path="/lost" element={<LostItemsPage />} />
                <Route path="/found" element={<FoundItemsPage />} />
                <Route path="/lost/:id" element={<LostItemDetail />} />
                <Route path="/found/:id" element={<FoundItemDetail />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/register-face" element={<RegisterStudent />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-attendance" element={<AdminAttendance />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/classroom" element={<ClassroomPage/>} />
                {/* Redirect root to attendance */}
                <Route path="/" element={<Navigate to="/attendance" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
