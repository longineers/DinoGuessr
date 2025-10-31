import React, { useState, useEffect } from 'react';
import { Difficulty } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ImageRevealerProps {
  imageUrl: string;
  dinosaurName: string;
  difficulty: Difficulty;
}

const ImageRevealer: React.FC<ImageRevealerProps> = ({ imageUrl, dinosaurName, difficulty }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);

  const durationMap = {
    easy: 3000,
    medium: 5000,
    hard: 7000,
  };
  const revealDuration = durationMap[difficulty];

  useEffect(() => {
    // Reset state when the image URL changes for a new round
    setIsRevealed(false);
    setIsImageLoaded(false);
    setCurrentImageUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (isImageLoaded) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
      }, 100); // Small delay to allow the image to render before starting animation
      return () => clearTimeout(timer);
    }
  }, [isImageLoaded]);

  const handleImageError = () => {
    // A clear "Image Not Found" SVG placeholder
    const placeholderUrl = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='512' height='512' viewBox='0 0 512 512'%3E%3Crect width='100%' height='100%' fill='%23334155'/%3E%3Ctext x='50%' y='50%' font-family='sans-serif' font-size='32' fill='%2394a3b8' text-anchor='middle' dominant-baseline='middle'%3EImage Not Found%3C/text%3E%3C/svg%3E";
    if (currentImageUrl !== placeholderUrl) {
      setCurrentImageUrl(placeholderUrl);
    }
  };

  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-slate-800 flex items-center justify-center">
      {/* Show a spinner until the image is loaded and ready */}
      {!isImageLoaded && <LoadingSpinner />}
      
      <img
        src={currentImageUrl}
        alt={`A dinosaur: ${dinosaurName}`}
        referrerPolicy="no-referrer"
        className={`w-full h-full object-cover transition-all ease-out ${
          isImageLoaded ? 'opacity-100' : 'opacity-0'
        } ${
          isRevealed ? 'scale-100 translate-x-0' : 'scale-110 -translate-x-2' // Parallax: Pan and zoom effect
        }`}
        style={{ transitionDuration: `${revealDuration}ms` }}
        onLoad={() => setIsImageLoaded(true)}
        onError={handleImageError}
        key={imageUrl} // Use the original prop as key to ensure re-mount on new question
      />
      <div
        className={`absolute inset-0 bg-slate-900/30 backdrop-blur-2xl transition-all ease-linear ${
          isRevealed ? 'backdrop-blur-none opacity-0' : ''
        }`}
        style={{ transitionDuration: `${revealDuration}ms` }}
      />
    </div>
  );
};

export default ImageRevealer;