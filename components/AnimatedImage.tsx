import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';

interface AnimatedImageProps {
  src: string;
  alt: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: isLoaded ? 1 : 0 },
    config: { duration: 10000 },
  });

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    <animated.img
      src={src}
      alt={alt}
      className="w-full h-full object-contain"
      style={animation}
    />
  );
};

export default AnimatedImage;
