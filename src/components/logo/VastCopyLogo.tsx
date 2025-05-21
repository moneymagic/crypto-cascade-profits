
import React from 'react';

interface VastCopyLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
  textColor?: string;
}

export const VastCopyLogo: React.FC<VastCopyLogoProps> = ({ 
  className = "", 
  showText = true, 
  size = 'medium',
  textColor = "text-white"
}) => {
  const sizeClasses = {
    small: 'h-6',
    medium: 'h-8',
    large: 'h-10'
  };

  return (
    <div className={`flex items-center ${className}`}>
      {/* Logo icon */}
      <div className={`${sizeClasses[size]}`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="h-full w-auto">
          <path 
            d="M50 20C34 20 25 35 25 50C25 65 34 80 50 80C66 80 75 65 75 50C75 35 66 20 50 20Z" 
            fill="#40C4BD" 
            fillOpacity="0.9"
          />
          <circle cx="33" cy="40" r="10" fill="#40C4BD" />
          <circle cx="50" cy="25" r="10" fill="#40C4BD" />
          <circle cx="67" cy="40" r="10" fill="#60C2FF" />
          <circle cx="50" cy="67" r="10" fill="#3A8DFF" />
        </svg>
      </div>

      {/* Logo text */}
      {showText && (
        <div className="flex flex-col ml-2">
          <h1 className={`font-bold ${textColor} ${size === 'small' ? 'text-lg' : size === 'medium' ? 'text-xl' : 'text-2xl'}`}>
            vastcopy
          </h1>
          <div className="h-1 w-full bg-vastcopy-gradient rounded-full"></div>
        </div>
      )}
    </div>
  );
};
