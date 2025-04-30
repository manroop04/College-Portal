import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '../components/ui/table';
import Sidebar from '../components/ui/Sidebar';
import profileImg from '../assets/profile.png';
import logo from '../assets/logo.png';
import '../styles/ViewAttendance.css';

interface AttendanceRecord {
  [key: string]: string | number;
}

interface Student {
  id: string;
  name: string;
  profileImage: string;
}

const ViewAttendance: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    id: '1',
    name: 'John Smith',
    profileImage: profileImg,
  });

  const [attendanceData, setAttendanceData] = useState<{
    columns: string[];
    data: AttendanceRecord[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/attendance/view');
        if (!response.ok) throw new Error('Failed to fetch attendance');
        const data = await response.json();
        setAttendanceData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  // const handleDownloadPDF = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/attendance/pdf');
  //     if (!response.ok) throw new Error('Failed to generate PDF');
      
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'attendance_report.pdf';
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //   } catch (err) {
  //     alert(err instanceof Error ? err.message : 'Failed to download PDF');
  //   }
  // };

  // const handleDownloadCSV = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/attendance/csv');
  //     if (!response.ok) throw new Error('Failed to generate CSV');
  
  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'attendance_report.csv';
  //     document.body.appendChild(a);
  //     a.click();
  //     a.remove();
  //   } catch (err) {
  //     alert(err instanceof Error ? err.message : 'Failed to download CSV');
  //   }
  // };

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/attendance/excel');
      if (!response.ok) throw new Error('Failed to generate Excel');
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const formattedDate = new Date().toISOString().split('T')[0];
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${formattedDate}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to download Excel file');
    }
  };

  if (loading) return (
    <div className="main-content">
      <Sidebar student={student} activePage="attendance" />
      <div className="content">
        <header className="page-header">
          <h1>Attendance Records</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="loading-message">Loading attendance data...</div>
      </div>
    </div>
  );

  if (error) return (
    <div className="main-content">
      <Sidebar student={student} activePage="attendance" />
      <div className="content">
        <header className="page-header">
          <h1>Admin</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="error-message">Error: {error}</div>
      </div>
    </div>
  );

  if (!attendanceData) return (
    <div className="main-content">
      <Sidebar student={student} activePage="attendance" />
      <div className="content">
        <header className="page-header">
          <h1>Attendance Records</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>
        <div className="no-data-message">No attendance data found</div>
      </div>
    </div>
  );

  return (
    <div className="main-content">
      <Sidebar student={student} activePage="attendance" />
      
      <div className="content">
        <header className="page-header">
          <h1>Attendance Records</h1>
          <img src={logo} alt="Logo" className="header-logo" />
        </header>

        <div className="attendance-container">
          <div className="export-buttons">
            {/* <Button 
              className="export-button pdf"
              onClick={handleDownloadPDF}
            >
              Export as PDF
            </Button>
            <Button 
              className="export-button csv"
              onClick={handleDownloadCSV}
            >
              Export as CSV
            </Button> */}
            <Button 
              className="export-button excel"
              onClick={handleDownloadExcel}
            >
              Export as Excel
            </Button>
          </div>

          <div className="attendance-table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  {attendanceData.columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceData.data.map((record, index) => (
                  <TableRow key={index}>
                    {attendanceData.columns.map((column) => (
                      <TableCell key={`${index}-${column}`}>
                        {record[column]?.toString() || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;