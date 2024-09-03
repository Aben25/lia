import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback }) => {
  return (
    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-600">
          {fallback || alt?.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export const AvatarImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" />
);

export const AvatarFallback: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-full h-full flex items-center justify-center text-gray-600">
    {children}
  </div>
);