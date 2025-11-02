import React, { useState, useEffect } from 'react';
import AnimatedImage from './AnimatedImage';
import LoadingSpinner from './LoadingSpinner';
import { Difficulty } from '../types';

interface ImageRevealerProps {
  imageUrl: string;
  dinosaurName: string;
  difficulty: Difficulty;
}

const ImageRevealer: React.FC<ImageRevealerProps> = ({ imageUrl, dinosaurName, difficulty }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  useEffect(() => {
    // Reset state when the image URL changes for a new round
    setIsImageLoaded(false);
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  const handleImageError = () => {
    // A clear "Image Not Found" SVG placeholder
    const placeholderUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Crect width='100%' height='100%' fill='%23334155'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='32' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E";
    if (currentImageUrl !== placeholderUrl) {
      setCurrentImageUrl(placeholderUrl);
    }
    setIsImageLoaded(true); // Ensure the spinner is hidden even on error
  };

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Show a spinner until the image is loaded and ready */}
      {!isImageLoaded && <LoadingSpinner />}
      
      <AnimatedImage 
        src={currentImageUrl}
        alt={`A dinosaur: ${dinosaurName}`}
        onLoad={() => setIsImageLoaded(true)}
        onError={handleImageError}
      />
    </div>
  );
};

export default ImageRevealer;