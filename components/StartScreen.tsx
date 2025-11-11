import React, { useState, useEffect } from 'react';
import { Difficulty } from '../types';
import VolumeControl from './VolumeControl';

const DinoHeadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M14.284 3.018a.75.75 0 0 0-1.233-.823l-3.324 4.985a.75.75 0 0 0 .617.823h2.39a.75.75 0 0 1 .737.62l.334 1.335a.75.75 0 0 0 .737.62h2.266a.75.75 0 0 0 .68-.423l1.24-2.48a.75.75 0 0 0-.679-1.077h-2.39a.75.75 0 0 1-.737-.62l-.442-1.767ZM5.188 11.25a.75.75 0 0 1 .53 1.28l-1.28 1.28a.75.75 0 0 1-1.06 0l-.64-.64a.75.75 0 0 1 0-1.06l1.28-1.28a.75.75 0 0 1 .53-.28ZM10 12a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1 .75-.75h.008ZM12.5 12a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008a.75.75 0 0 1 .75-.75h.008Z" />
    <path fillRule="evenodd" d="M3 13.5a.75.75 0 0 1 .75.75v3.19l.3-.3a.75.75 0 0 1 1.06 0l1.47 1.47a.75.75 0 0 1 0 1.06l-.3.3H18.75a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75V14.25A.75.75 0 0 1 3 13.5Zm12.92 5.03a.75.75 0 0 1 1.06 0l.3.3v-3.19a.75.75 0 0 1 .75-.75.75.75 0 0 1 .75.75v5.25a.75.75 0 0 1-.75.75h-5.25a.75.75 0 0 1-.75-.75.75.75 0 0 1 .75-.75h3.19l-.3-.3a.75.75 0 0 1 0-1.06l1.47-1.47Z" clipRule="evenodd" />
  </svg>
);

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');

  useEffect(() => {
    const storedDifficulty = localStorage.getItem('dinoGuessrDifficulty') as Difficulty;
    if (storedDifficulty && ['easy', 'medium', 'hard'].includes(storedDifficulty)) {
      setSelectedDifficulty(storedDifficulty);
    }
  }, []);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    localStorage.setItem('dinoGuessrDifficulty', difficulty);
  };

  const difficultyOptions: { id: Difficulty; label: string }[] = [
    { id: 'easy', label: 'Easy' },
    { id: 'medium', label: 'Medium' },
    { id: 'hard', label: 'Hard' },
  ];

  const getDifficultyButtonClass = (difficulty: Difficulty) => {
    const base = "px-6 py-2 rounded-lg font-bold transition-all duration-200";
    if (difficulty === selectedDifficulty) {
      return `${base} bg-teal-500 text-white shadow-md`;
    }
    return `${base} bg-slate-700 text-slate-300 hover:bg-slate-600`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white">
      <DinoHeadIcon className="w-24 h-24 text-teal-400 mb-4" />
      <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-4">
        Dino Guessr
      </h1>
      <p className="text-slate-300 max-w-md mb-8 text-lg">
        A picture of a dinosaur will be revealed. Guess its name as fast as you can!
      </p>
      
      <div className="mb-8">
        <div className="flex justify-center items-center mb-3">
          <VolumeControl />
        </div>
        <p className="text-slate-300 mb-3 font-bold text-lg">Select Difficulty:</p>
        <div className="flex justify-center items-center gap-3 bg-slate-800 p-2 rounded-xl">
          {difficultyOptions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleDifficultyChange(id)}
              className={getDifficultyButtonClass(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart(selectedDifficulty)}
        className="w-full max-w-xs px-8 py-4 bg-emerald-500 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-emerald-600 active:bg-emerald-700 transform hover:scale-105 transition-all duration-300"
      >
        Start Game
      </button>

      <footer className="absolute bottom-4 text-slate-400 text-sm">
        Made by <a href="https://github.com/longineers" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-400">longineers</a>. 
        View the <a href="https://github.com/longineers/DinoGuessr" target="_blank" rel="noopener noreferrer" className="underline hover:text-teal-400">source code</a>.
      </footer>
    </div>
  );
};

export default StartScreen;
