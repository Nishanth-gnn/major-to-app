import React from 'react';
import { motion } from 'framer-motion';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-3 mb-2">
        <svg className="h-5 w-5 animate-spin text-sky-600" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
          <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
        <span className="text-sm text-slate-600 font-medium">Translating with Gemini AI...</span>
      </div>
      <motion.div 
        className="h-4 bg-slate-200 rounded w-3/4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <motion.div 
        className="h-4 bg-slate-200 rounded w-full"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
      />
      <motion.div 
        className="h-4 bg-slate-200 rounded w-5/6"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
      />
    </div>
  );
};

export default LoadingSkeleton;
