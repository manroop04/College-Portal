import React from 'react';

interface ProgressProps {
  value: number; // Value between 0 and 100
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className = '', 
  color = 'primary' 
}) => {
  // Ensure value stays between 0 and 100
  const progressValue = Math.min(100, Math.max(0, value));
  
  // Color variants
  const colorVariants = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  return (
    <div className={`w-full h-2 bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <div 
        className={`h-full rounded-full ${colorVariants[color]}`}
        style={{ width: `${progressValue}%`, transition: 'width 0.3s ease' }}
      />
    </div>
  );
};

export default Progress;