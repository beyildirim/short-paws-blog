import { Loader2, Cat } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 24,
    medium: 48,
    large: 64,
  };
  
  const iconSize = sizeClasses[size];
  
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <Loader2 
          size={iconSize} 
          className="text-purple-600 animate-spin" 
        />
        <Cat 
          size={iconSize / 2} 
          className="text-pink-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
        />
      </div>
      {message && (
        <p className="text-gray-700 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
  
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-purple-100 bg-opacity-90 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}
