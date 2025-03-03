import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 32, 
  message = "Loading...", 
  fullScreen = true,
  className = "",
  minHeight = ""
}) => {
  const containerClasses = fullScreen 
    ? "flex items-center justify-center h-screen w-full" 
    : "flex items-center justify-center p-4 w-full";

  const heightClass = minHeight ? `min-h-[${minHeight}]` : fullScreen ? "h-screen" : "h-16";

  return (
    <div className={`${containerClasses} ${minHeight ? "" : heightClass} ${className}`}>
      <div className="text-center">
        {message && <h2 className="text-xl font-bold mb-4">{message}</h2>}
        <Loader2 
          className="animate-spin mx-auto" 
          size={size} 
          strokeWidth={2}
        />
      </div>
    </div>
  );
};

export default LoadingSpinner;