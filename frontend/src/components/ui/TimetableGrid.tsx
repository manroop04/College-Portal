import React from 'react';
import { TimeSlot } from "../../types/index";
import '../../styles/Timetable.css';

interface TimetableGridProps {
  timeSlots: TimeSlot[];
}

const TimetableGrid: React.FC<TimetableGridProps> = ({ timeSlots }) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = [
    '8:00 - 9:00am',
    '9:00 - 10:00am',
    '10:00 - 11:00am',
    '11:00 - 12:00pm',
    '12:00 - 1:00pm',
    '2:00 - 3:00pm',
    '3:00 - 4:00pm',
    '4:00 - 5:00pm'
  ];
  
  const hasClass = (day: string, time: string): boolean => {
    const [startTime] = time.split(' - ');
    return timeSlots.some(slot => 
      slot.day === day && 
      slot.startTime === startTime
    );
  };
  
  return (
    <div className="timetable-container">
      <table className="timetable-grid">
        <thead>
          <tr>
            <th></th>
            {days.map(day => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map(time => (
            <tr key={time}>
              <td className="time-cell">{time}</td>
              {days.map(day => (
                <td 
                  key={`${day}-${time}`} 
                  className={hasClass(day, time) ? 'class-cell' : 'empty-cell'}
                >
                  {hasClass(day, time) && 
                    timeSlots.find(slot => slot.day === day && slot.startTime === time.split(' - ')[0])?.subject
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableGrid;