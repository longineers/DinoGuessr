import React from 'react';
import { useAudio } from '../App';

const SpeakerIcon: React.FC<{ volume: number }> = ({ volume }) => {
  if (volume === 0) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-400">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 12a3.75 3.75 0 01-3.75 3.75v-7.5a3.75 3.75 0 013.75 3.75zM21.975 12c0 4.083-2.822 7.528-6.685 8.487V3.513C19.153 4.472 21.975 7.917 21.975 12z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-400">
      <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM17.5 12a2.5 2.5 0 01-2.5 2.5v-5a2.5 2.5 0 012.5 2.5z" />
      {volume > 0.5 && <path d="M20.5 12a5.5 5.5 0 01-5.5 5.5v-11a5.5 5.5 0 015.5 5.5z" />}
    </svg>
  );
};

const VolumeControl: React.FC = () => {
  const { volume, setVolume } = useAudio();

  return (
    <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-800/50 p-2 rounded-full backdrop-blur-sm">
      <SpeakerIcon volume={volume} />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-24 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
        aria-label="Volume control"
      />
    </div>
  );
};

export default VolumeControl;
