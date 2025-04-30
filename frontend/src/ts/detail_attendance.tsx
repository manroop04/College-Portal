import React from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
// import { card } from '../components/ui/card';

interface DetailAttendanceProps {}

const DetailAttendance: React.FC<DetailAttendanceProps> = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="p-4 max-w-4xl mx-auto">
     hello
    </div>
  );
};

export default DetailAttendance;
