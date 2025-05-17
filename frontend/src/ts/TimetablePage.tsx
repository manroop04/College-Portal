import React, { useState } from 'react';
import Sidebar from '../components/ui/Sidebar';
import TimetableGrid from '../components/ui/TimetableGrid';
import { Student, TimeSlot } from '../types';
import '../styles/Timetable.css';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';

const TimetablePage: React.FC = () => {
  const [student] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });
  
  const [timeSlots] = useState<TimeSlot[]>([
    // Monday
    { id: 1, day: 'Monday', startTime: '8:00', endTime: '9:00', subject: 'DBMS', location: 'Room 120' },
    { id: 2, day: 'Monday', startTime: '10:00', endTime: '11:00', subject: 'OOPS', location: 'Room 108' },
    { id: 3, day: 'Monday', startTime: '12:00', endTime: '1:00', subject: 'Maths', location: 'Room 103' },
    { id: 4, day: 'Monday', startTime: '3:00', endTime: '4:00', subject: 'CN', location: 'Room 118' },
    
    // Tuesday
    { id: 5, day: 'Tuesday', startTime: '9:00', endTime: '10:00', subject: 'DBMS', location: 'Room 120' },
    { id: 6, day: 'Tuesday', startTime: '11:00', endTime: '12:00', subject: 'Sports', location: 'Wifi Garden' },
    { id: 7, day: 'Tuesday', startTime: '12:00', endTime: '1:00', subject: 'OOPS', location: 'Room 108' },
    { id: 8, day: 'Tuesday', startTime: '3:00', endTime: '4:00', subject: 'Maths', location: 'Room 103' },
    
    // Wednesday
    { id: 9, day: 'Wednesday', startTime: '9:00', endTime: '10:00', subject: 'CN', location: 'Room 118' },
    { id: 10, day: 'Wednesday', startTime: '10:00', endTime: '11:00', subject: 'DBMS', location: 'Room 120' },
    { id: 11, day: 'Wednesday', startTime: '12:00', endTime: '1:00', subject: 'Sports', location: 'Wifi Garden' },
    { id: 12, day: 'Wednesday', startTime: '2:00', endTime: '3:00', subject: 'OOPS', location: 'Room 108' },
    { id: 13, day: 'Wednesday', startTime: '4:00', endTime: '5:00', subject: 'Maths', location: 'Room 103' },
    
    // Thursday
    { id: 14, day: 'Thursday', startTime: '8:00', endTime: '9:00', subject: 'CN', location: 'Room 118' },
    { id: 15, day: 'Thursday', startTime: '10:00', endTime: '11:00', subject: 'OOPS', location: 'Room 108' },
    { id: 16, day: 'Thursday', startTime: '12:00', endTime: '1:00', subject: 'Maths', location: 'Room 103' },
    { id: 17, day: 'Thursday', startTime: '3:00', endTime: '4:00', subject: 'DBMS', location: 'Room 120' },
    
    // Friday
    { id: 18, day: 'Friday', startTime: '8:00', endTime: '9:00', subject: 'Sports', location: 'Wifi Garden' },
    { id: 19, day: 'Friday', startTime: '10:00', endTime: '11:00', subject: 'CN', location: 'Room 118' },
    { id: 20, day: 'Friday', startTime: '12:00', endTime: '1:00', subject: 'DBMS', location: 'Room 120' },
    { id: 21, day: 'Friday', startTime: '3:00', endTime: '4:00', subject: 'OOPS', location: 'Room 103' },
  ]);

  return (
    <div className="timetable-page">
      <Sidebar student={student} activePage="timetable" />
      
      <main className="content">
        <header className="page-header">
          <div>
            <h1>Student</h1>
          </div>
          <img src={logo} alt="School Logo" className="header-logo" />
        </header>
        
        <div className="timetable-container">
          <TimetableGrid timeSlots={timeSlots} />
        </div>
      </main>
    </div>
  );
};

export default TimetablePage;