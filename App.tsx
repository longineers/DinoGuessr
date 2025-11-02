import React, { useState, useEffect, useCallback, createContext, useContext, useRef } from 'react';
import { fetchDinosaurQuiz } from './services/dataService';
import { QuizData, Difficulty } from './types';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import LoadingSpinner from './components/LoadingSpinner';
import VolumeControl from './components/VolumeControl';

// --- Audio Context and Provider ---
type SoundType = 'start' | 'transition' | 'correct' | 'incorrect';

interface AudioContextType {
  playSound: (type: SoundType) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
};

const AudioProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [volume, setVolumeState] = useState(1.0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const activeSourcesRef = useRef<Set<AudioScheduledSourceNode>>(new Set());

  // Initialize audio context on first user interaction
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      const newAudioCtx = new Ctx();
      const newGainNode = newAudioCtx.createGain();
      newGainNode.connect(newAudioCtx.destination);
      newGainNode.gain.setValueAtTime(volume, newAudioCtx.currentTime);
      audioCtxRef.current = newAudioCtx;
      gainNodeRef.current = newGainNode;
    } catch (e) {
      console.error("Web Audio API is not supported in this browser", e);
    }
  }, [volume]);
  
  useEffect(() => {
    const storedVolume = localStorage.getItem('dinoGuessrVolume');
    if (storedVolume !== null) {
      const parsedVolume = parseFloat(storedVolume);
      if (!isNaN(parsedVolume)) {
        setVolumeState(parsedVolume);
      }
    }
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    localStorage.setItem('dinoGuessrVolume', String(newVolume));
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(newVolume, audioCtxRef.current.currentTime);
    }
  }, []);
  
  const stopAllSounds = useCallback(() => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    for (const source of activeSourcesRef.current) {
      // stop() will trigger the 'onended' event for each source,
      // which handles disconnection and cleanup.
      try {
        source.stop(now);
      } catch (e) {
        // Ignore errors if the source was already stopped or is in an invalid state.
      }
    }
    activeSourcesRef.current.clear();
  }, []);

  const playSound = useCallback((type: SoundType) => {
    initAudio();
    if (!audioCtxRef.current || !gainNodeRef.current) return;

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    
    // Stop any previously playing sounds to prevent overlap.
    stopAllSounds();

    const now = audioCtxRef.current.currentTime;
    
    switch (type) {
      case 'start': {
        const oscillator = audioCtxRef.current.createOscillator();
        activeSourcesRef.current.add(oscillator);
        oscillator.onended = () => {
          activeSourcesRef.current.delete(oscillator);
          oscillator.disconnect();
        };

        oscillator.connect(gainNodeRef.current);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(261.63, now); // C4
        oscillator.frequency.linearRampToValueAtTime(523.25, now + 0.2); // C5
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;
      }
      case 'transition': {
        const osc = audioCtxRef.current.createOscillator();
        const transitionGain = audioCtxRef.current.createGain();
        activeSourcesRef.current.add(osc);
        osc.onended = () => {
          activeSourcesRef.current.delete(osc);
          osc.disconnect();
          transitionGain.disconnect();
        };
        
        osc.connect(transitionGain);
        transitionGain.connect(gainNodeRef.current);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.4);
        transitionGain.gain.setValueAtTime(0.3, now);
        transitionGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      }
      case 'correct': {
        const osc = audioCtxRef.current.createOscillator();
        const noteGain = audioCtxRef.current.createGain();
        activeSourcesRef.current.add(osc);
        osc.onended = () => {
          activeSourcesRef.current.delete(osc);
          osc.disconnect();
          noteGain.disconnect();
        };

        osc.connect(noteGain);
        noteGain.connect(gainNodeRef.current);
        osc.type = 'triangle';
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        noteGain.gain.setValueAtTime(0.3, now);
        frequencies.forEach((freq, i) => {
            osc.frequency.setValueAtTime(freq, now + i * 0.08);
        });
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
      }
      case 'incorrect': {
        const osc = audioCtxRef.current.createOscillator();
        activeSourcesRef.current.add(osc);
        osc.onended = () => {
          activeSourcesRef.current.delete(osc);
          osc.disconnect();
        };
        
        osc.connect(gainNodeRef.current);
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(164.81, now); // E3
        osc.frequency.linearRampToValueAtTime(123.47, now + 0.3); // B2
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      }
    }
  }, [initAudio, stopAllSounds]);
  
  const value = { playSound, volume, setVolume };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};


// --- App Component Logic ---
type GameState = 'START' | 'LOADING' | 'PLAYING' | 'FINISHED';

const AppContent: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('START');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRecords, setTimeRecords] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { playSound } = useAudio();

  useEffect(() => {
    const storedDifficulty = localStorage.getItem('dinoGuessrDifficulty') as Difficulty;
    if (storedDifficulty && ['easy', 'medium', 'hard'].includes(storedDifficulty)) {
      setDifficulty(storedDifficulty);
    }
  }, []);

  const loadQuiz = async (selectedDifficulty: Difficulty) => {
    setGameState('LOADING');
    const data = await fetchDinosaurQuiz(selectedDifficulty);
    setQuizData(data);
    setCurrentRound(0);
    setScore(0);
    setTimeRecords([]);
    setGameState('PLAYING');
  };

  const handleStart = (selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    playSound('start');
    loadQuiz(selectedDifficulty);
  };

  const handlePlayAgain = () => {
    playSound('start');
    loadQuiz(difficulty);
  };

  const handleAnswer = (isCorrect: boolean, time: number) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      setTimeRecords((prevTimes) => [...prevTimes, time]);
    }

    if (quizData && currentRound < quizData.questions.length - 1) {
      setCurrentRound((prevRound) => prevRound + 1);
    } else {
      setGameState('FINISHED');
    }
  };

  const handleBackToHome = () => {
    playSound('start');
    setGameState('START');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'START':
        return <StartScreen onStart={handleStart} />;
      case 'LOADING':
        return (
          <div className="flex flex-col items-center justify-center h-full text-white">
            <LoadingSpinner />
            <p className="mt-4 text-lg">Summoning Dinosaurs...</p>
          </div>
        );
      case 'PLAYING':
        if (!quizData) return null;
        return (
          <GameScreen
            question={quizData.questions[currentRound]}
            onAnswer={handleAnswer}
            roundNumber={currentRound + 1}
            totalRounds={quizData.questions.length}
            score={score}
            difficulty={difficulty}
          />
        );
      case 'FINISHED':
        return (
          <EndScreen
            score={score}
            totalQuestions={quizData?.questions.length || 0}
            timeRecords={timeRecords}
            onPlayAgain={handlePlayAgain}
            onBackToHome={handleBackToHome}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 overflow-hidden">
      <div className="relative h-full w-full max-w-lg mx-auto">
        {renderContent()}
      </div>
    </main>
  );
};

const App: React.FC = () => (
  <AudioProvider>
    <AppContent />
  </AudioProvider>
);

export default App;