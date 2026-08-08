import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakGujarati } from '../utils/gujaratiAudio';

export default function GujaratiVoiceButton({ text, label = 'સાંભળો (Listen)', className = '', size = 'md' }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = (e) => {
    e.stopPropagation();
    if (!text) return;
    setIsPlaying(true);
    speakGujarati(text);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  const sizeClasses = size === 'lg'
    ? 'px-4 py-2.5 text-base gap-2 rounded-2xl'
    : (size === 'sm' ? 'px-2.5 py-1 text-xs gap-1 rounded-lg' : 'px-3 py-1.5 text-sm gap-1.5 rounded-xl');

  return (
    <button
      onClick={handleSpeak}
      type="button"
      className={`inline-flex items-center justify-center font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-95 transition-all ${sizeClasses} ${className} ${isPlaying ? 'ring-4 ring-amber-300 animate-pulse' : ''}`}
      title="અવાજ સાંભળો (Speak in Gujarati)"
    >
      {isPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
      {label && <span>{label}</span>}
    </button>
  );
}
