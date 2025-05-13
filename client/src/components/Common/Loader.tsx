import React from 'react';

const Loader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3'
  };

  return (
    <div className="flex justify-center items-center p-4 h-full">
      <div 
        className={`${sizeClasses[size]} rounded-full border-t-primary border-r-primary border-b-transparent border-l-transparent animate-spin`}
      ></div>
    </div>
  );
};

export default Loader;