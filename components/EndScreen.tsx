
import React from 'react';

interface EndScreenProps {
  score: number;
  totalQuestions: number;
  timeRecords: number[];
  onPlayAgain: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, totalQuestions, timeRecords, onPlayAgain }) => {
  const totalTime = timeRecords.reduce((acc, time) => acc + time, 0);
  const averageTime = timeRecords.length > 0 ? (totalTime / timeRecords.length).toFixed(2) : '0.00';

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 text-white">
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-500 mb-4">
        Game Over!
      </h1>
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-sm mb-8">
        <p className="text-2xl text-slate-300 mb-2">Your Final Score:</p>
        <p className="text-7xl font-bold text-teal-400 mb-6">
          {score} <span className="text-4xl text-slate-400">/ {totalQuestions}</span>
        </p>
        
        {timeRecords.length > 0 && (
          <>
            <p className="text-lg text-slate-300 mb-1">Average Answer Time:</p>
            <p className="text-3xl font-bold text-white">{averageTime}s</p>
          </>
        )}
      </div>

      <button
        onClick={onPlayAgain}
        className="w-full max-w-xs px-8 py-4 bg-emerald-500 text-white font-bold text-xl rounded-xl shadow-lg hover:bg-emerald-600 active:bg-emerald-700 transform hover:scale-105 transition-all duration-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default EndScreen;
