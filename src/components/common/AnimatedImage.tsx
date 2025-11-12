import React from 'react';

interface AnimatedImageProps {
  src: string;
  alt: string;
  onLoad: () => void;
  onError: () => void;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt, onLoad, onError }) => {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default AnimatedImage;