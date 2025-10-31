import React from 'react';

interface FunFactPopupProps {
  fact: string;
  isVisible: boolean;
}

const FunFactPopup: React.FC<FunFactPopupProps> = ({ fact, isVisible }) => {
  return (
    <div
      className={`absolute bottom-24 left-1/2 -translate-x-1/2 w-11/12 max-w-md p-4 bg-teal-500 text-white rounded-xl shadow-2xl transition-all duration-500 ease-in-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8 pointer-events-none'
      }`}
    >
      <p className="font-bold text-lg mb-1">Fun Fact!</p>
      <p>{fact}</p>
    </div>
  );
};

export default FunFactPopup;
