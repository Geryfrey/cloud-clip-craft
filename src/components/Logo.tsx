
import React from 'react';
import { Cloud, Play } from 'lucide-react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg', className?: string }> = ({ 
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center font-semibold ${sizeClasses[size]} ${className}`}>
      <div className="flex items-center mr-2 relative">
        <Cloud className="text-primary" />
        <Play className="text-white absolute left-1/2 top-1/2 transform -translate-x-1/4 -translate-y-1/2 scale-75" />
      </div>
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        CloudClipCraft
      </span>
    </div>
  );
};

export default Logo;
