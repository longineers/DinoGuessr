import React from 'react';
import AnimatedImage from './AnimatedImage';

interface ImageRevealerProps {
  imageUrl: string;
  dinosaurName: string;
}

const ImageRevealer: React.FC<ImageRevealerProps> = ({ imageUrl, dinosaurName }) => {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl bg-slate-800 flex items-center justify-center">
      <AnimatedImage src={imageUrl} alt={`A dinosaur: ${dinosaurName}`} />
    </div>
  );
};

export default ImageRevealer;