import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Difficulty } from '../../types';

interface ImageRevealerProps {
  imageUrl: string;
  dinosaurName: string;
}

const ImageRevealer: React.FC<ImageRevealerProps> = ({ imageUrl, dinosaurName }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(imageUrl);

  useEffect(() => {
    setImageSrc(imageUrl);
    setIsImageLoaded(false);
  }, [imageUrl]);

  const handleImageError = () => {
    const placeholderUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Crect width='100%' height='100%' fill='%23334155'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='32' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E";
    setImageSrc(placeholderUrl);
    setIsImageLoaded(true);
  };

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
      {!isImageLoaded && <LoadingSpinner />}
      
      <img 
        src={imageSrc}
        alt={`A dinosaur: ${dinosaurName}`}
        className="w-full h-full object-contain"
        style={{ display: isImageLoaded ? 'block' : 'none' }}
        onLoad={() => setIsImageLoaded(true)}
        onError={handleImageError}
      />
    </div>
  );
};

export default ImageRevealer;