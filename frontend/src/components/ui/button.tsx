import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'secondary' | 'destructive';
  children: React.ReactNode;
  asChild?: boolean;
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'default', 
  children, 
  className = '', 
  asChild = false,
  ...props 
}) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors';
  
  // Define all variants here (make sure all possible variants are included)
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-red-500 text-white hover:bg-red-600',
  };

  const buttonClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: buttonClassName,
      ...props
    });
  }

  return (
    <button className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default Button;