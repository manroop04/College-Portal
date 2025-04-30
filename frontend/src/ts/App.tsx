// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { Button } from '../components/ui/button';
// import LoginPage from './login';
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


const theme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-between h-16">
                {/* <div className="flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800">
                    Campus Connect
                  </Link>
                </div> */}
                <div className="flex items-center space-x-4">
                  {/* <Link to="/login">
                    <Button variant="ghost">Login</Button>
                  </Link> */}
                  {/* <Link to="/take-attendance">
                    <Button variant="ghost">Take Attendance</Button>
                  </Link> */}
                  {/* <Link to="/view-attendance">
                    <Button variant="ghost">View Attendance</Button>
                  </Link> */}
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              {/* <Route path="/" element={<Home />} /> */}
              {/* <Route path="/login" element={<LoginPage />} /> */}
              <Route path="/take-attendance" element={<TakeAttendance />} />
              <Route path="/view-attendance" element={<ViewAttendance />} />
              <Route path="/register-student" element={<RegisterStudent />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/sign-up" element={<SignupPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/timetable" element={<TimetablePage />} />
              <Route path="/" element={<Navigate to="/attendance" replace />} />
              <Route path="/lost-found" element={<LostAndFoundPage />} />
              <Route path="/lost" element={<LostItemsPage />} />
              <Route path="/found" element={<FoundItemsPage />} />
              <Route path="/lost/:id" element={<LostItemDetail />} />
              <Route path="/found/:id" element={<FoundItemDetail />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/register-face" element={<RegisterStudent />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin-attendance" element={<AdminAttendance />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
};

// const Home = () => (
//   <div className="text-center">
//     <h1 className="text-4xl font-bold mb-8">Welcome to Campus Connect</h1>
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//       {/* Login Button */}
//       <Link to="/login" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//         <h2 className="text-xl font-semibold mb-2">Login</h2>
//         <p className="text-gray-600">Access your account</p>
//       </Link>

//       {/* Take Attendance Button */}
//       <Link to="/take-attendance" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//         <h2 className="text-xl font-semibold mb-2">Take Attendance</h2>
//         <p className="text-gray-600">Record student attendance</p>
//       </Link>

//       {/* View Attendance Button */}
//       <Link to="/view-attendance" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//         <h2 className="text-xl font-semibold mb-2">View Attendance</h2>
//         <p className="text-gray-600">Check attendance records</p>
//       </Link>

//       {/* Register Student Button */}
//       <Link to="/register-student" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
//         <h2 className="text-xl font-semibold mb-2">Register Student</h2>
//         <p className="text-gray-600">Register a new student</p>
//       </Link>
//     </div>
//   </div>
// );


export default App;
