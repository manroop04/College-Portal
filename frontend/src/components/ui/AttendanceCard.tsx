import React, { useRef, useEffect } from 'react';
import { CourseAttendance } from "../../types/index";
import '../../styles/Attendance.css';

interface AttendanceCardProps {
  course: CourseAttendance;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ course }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        // donut chart
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;
        const radius = Math.min(centerX, centerY) * 0.8;
        
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // absent portion
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = '#CC0A11';
        ctx.lineWidth = radius * 0.5;
        ctx.stroke();
        
        // present portion
        const presentPercentage = course.attendancePercentage / 100;
        ctx.beginPath();
        ctx.arc(
          centerX, 
          centerY, 
          radius, 
          -Math.PI / 2, 
          2 * Math.PI * presentPercentage - Math.PI / 2, 
          false
        );
        ctx.strokeStyle = '#89D73C';
        ctx.lineWidth = radius * 0.5;
        ctx.stroke();
      }
    }
  }, [course]);
  
  return (
    <div className="attendance-card">
      <h3 className="course-name">{course.courseName}</h3>
      
      <div className="chart-container">
        <canvas ref={canvasRef} width={150} height={150}></canvas>
        <div className="percentage-display">
          <div className="present-percentage">{course.attendancePercentage}%</div>
          <div className="absent-percentage">{100 - course.attendancePercentage}%</div>
        </div>
      </div>
      
      <div className="attendance-stats">
        <p>Total classes: {course.totalClasses}</p>
        <p className="attended">Attended: {course.attendedClasses}</p>
        <p className="absent">Absent: {course.absentClasses}</p>
      </div>
    </div>
  );
};

export default AttendanceCard;