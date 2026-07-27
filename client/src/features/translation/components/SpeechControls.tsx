import React from 'react';
import { Volume2 } from 'lucide-react';

interface Props {
  onListen: () => void;
  disabled?: boolean;
}

export const SpeechControls: React.FC<Props> = ({ onListen, disabled }) => {
  return (
    <button 
      type="button" 
      onClick={onListen} 
      className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" 
      aria-label="Listen to translation" 
      disabled={disabled}
      title="Listen is a UI placeholder"
    >
      <Volume2 className="h-4 w-4" />
      <span>Listen</span>
    </button>
  );
};

export default SpeechControls;
