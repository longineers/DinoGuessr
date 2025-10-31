import React from 'react';

interface HintBoxProps {
  hint: string;
  isVisible: boolean;
}

const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-3 flex-shrink-0 text-yellow-400">
      <path d="M12 2.25a.75.75 0 0 1 .75.75v.518c.985.234 1.91.59 2.774 1.054.552.29.829.923.693 1.531l-.085.385c-.846 3.818-4.112 6.494-8.132 6.494s-7.286-2.676-8.132-6.494l-.085-.385c-.136-.608.141-1.241.693-1.531A12.012 12.012 0 0 1 11.25 3.518v-.518a.75.75 0 0 1 .75-.75ZM6.166 10.395c.524 2.36 2.93 4.105 5.834 4.105s5.31-1.745 5.834-4.105a28.89 28.89 0 0 0 0-1.79c-.524-2.36-2.93-4.105-5.834-4.105s-5.31 1.745-5.834 4.105a28.89 28.89 0 0 0 0 1.79Z" />
      <path d="M9 18.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm.75-2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
    </svg>
  );

const HintBox: React.FC<HintBoxProps> = ({ hint, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`mt-3 p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-300 transition-all duration-300 ease-in-out transform flex items-center
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
    >
      <LightbulbIcon />
      <p className="flex-1">{hint}</p>
    </div>
  );
};

export default HintBox;
