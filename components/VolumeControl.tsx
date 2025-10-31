import React, { useRef, useEffect } from 'react';
import { useAudio } from '../App';

const SpeakerIcon: React.FC<{ volume: number }> = ({ volume }) => {
  if (volume === 0) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-slate-400">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06Z" />
        <path d="M16.72 9.72a.75.75 0 0 1 1.06 0L19.5 11.44l1.72-1.72a.75.75 0 1 1 1.06 1.06L20.56 12.5l1.72 1.72a.75.75 0 1 1-1.06 1.06L19.5 13.56l-1.72 1.72a.75.75 0 1 1-1.06-1.06L18.44 12.5l-1.72-1.72a.75.75 0 0 1 0-1.06Z" />
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
  const lastVolumeRef = useRef(volume);

  // Keep track of the last non-zero volume
  useEffect(() => {
    if (volume > 0) {
      lastVolumeRef.current = volume;
    }
  }, [volume]);

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      // If the last known volume was also 0 (e.g., on initial load and muted), 
      // default to a reasonable level like 1.0
      setVolume(lastVolumeRef.current > 0 ? lastVolumeRef.current : 1.0);
    }
  };

  return (
    <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
      <button onClick={toggleMute} aria-label={volume > 0 ? "Mute sound" : "Unmute sound"} className="focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-full">
        <SpeakerIcon volume={volume} />
      </button>
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