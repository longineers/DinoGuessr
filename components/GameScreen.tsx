import React, { useState, useEffect, useRef } from 'react';
import { DinosaurQuestion, Difficulty } from '../types';
import ImageRevealer from './ImageRevealer';
import HintBox from './HintBox';
import { useAudio } from '../App';
import VolumeControl from './VolumeControl';

interface GameScreenProps {
  question: DinosaurQuestion;
  onAnswer: (isCorrect: boolean, time: number) => void;
  roundNumber: number;
  totalRounds: number;
  score: number;
}

const LightbulbIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
      <path d="M12 2.25a.75.75 0 0 1 .75.75v.518c.985.234 1.91.59 2.774 1.054.552.29.829.923.693 1.531l-.085.385c-.846 3.818-4.112 6.494-8.132 6.494s-7.286-2.676-8.132-6.494l-.085-.385c-.136-.608.141-1.241.693-1.531A12.012 12.012 0 0 1 11.25 3.518v-.518a.75.75 0 0 1 .75-.75ZM6.166 10.395c.524 2.36 2.93 4.105 5.834 4.105s5.31-1.745 5.834-4.105a28.89 28.89 0 0 0 0-1.79c-.524-2.36-2.93-4.105-5.834-4.105s-5.31 1.745-5.834 4.105a28.89 28.89 0 0 0 0 1.79Z" />
      <path d="M9 18.75a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Zm.75-2.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
    </svg>
  );

const GameScreen: React.FC<GameScreenProps> = ({ question, onAnswer, roundNumber, totalRounds, score }) => {
  console.log('question:', question);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const startTime = useRef<number>(Date.now());
  const { playSound } = useAudio();

  useEffect(() => {
    // Reset state for new round
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);
    startTime.current = Date.now();

    // Play sound for new round, but not the very first one
    if (roundNumber > 1) {
      playSound('transition');
    }
  }, [question, roundNumber, playSound]);

  const handleOptionClick = (option: string) => {
    if (isAnswered) return;

    const timeTaken = (Date.now() - startTime.current) / 1000;
    const isCorrect = option === question.correctAnswer;
    
    playSound(isCorrect ? 'correct' : 'incorrect');

    setIsAnswered(true);
    setSelectedAnswer(option);

    setTimeout(() => {
      onAnswer(isCorrect, timeTaken);
    }, 1500); // Wait 1.5s before moving to the next question
  };

  const handleHintClick = () => {
    setShowHint(true);
  };

  const getButtonClass = (option: string) => {
    const baseClass = 'w-full text-left p-4 rounded-xl text-lg font-bold transition-all duration-300 disabled:opacity-75';

    if (!isAnswered) {
      return `${baseClass} bg-slate-700 text-white hover:bg-teal-600`;
    }

    const isCorrect = option === question.correctAnswer;
    const isSelected = option === selectedAnswer;

    if (isCorrect) {
      return `${baseClass} bg-green-500 text-white scale-105`;
    }
    if (isSelected) {
      return `${baseClass} bg-red-500 text-white`;
    }
    return `${baseClass} bg-slate-800 text-slate-400`;
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col h-full">
      <header className="flex justify-between items-center mb-4 text-white">
        <div className="text-xl font-bold">
          Round <span className="text-teal-400">{roundNumber}</span> / {totalRounds}
        </div>
        <div className="text-xl font-bold">
          Score: <span className="text-teal-400">{score}</span>
        </div>
      </header>
      
      <div className="flex-grow flex flex-col justify-center">
        <ImageRevealer 
          imageUrl={question.imageUrl}
          dinosaurName={question.correctAnswer} 
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
            <VolumeControl />
            <button
              onClick={handleHintClick}
              disabled={showHint || isAnswered}
              className="px-4 py-2 bg-slate-700 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              <LightbulbIcon />
              Hint
            </button>
        </div>

        <HintBox hint={question.hint} isVisible={showHint} />

        <div className={`space-y-3 ${showHint ? 'mt-3' : ''}`}>
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              disabled={isAnswered}
              className={getButtonClass(option)}
              aria-label={`Select ${option} as the answer`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      

    </div>
  );
};

export default GameScreen;