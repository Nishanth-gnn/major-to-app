import React from 'react';
import { Compass, ZoomIn, ZoomOut, LocateFixed } from 'lucide-react';
import { useControls } from 'react-zoom-pan-pinch';

export default function MapControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute right-4 bottom-8 lg:bottom-10 flex flex-col gap-4 z-40">
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 dark:border-slate-700/50 overflow-hidden flex flex-col p-1">
        <button 
          onClick={() => resetTransform()}
          className="p-3 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl flex items-center justify-center mb-1"
          title="Reset View"
        >
          <Compass size={22} />
        </button>
        <div className="h-[1px] bg-slate-200/50 dark:bg-slate-600/50 mx-2" />
        <button 
          onClick={() => resetTransform()} // Simulate current location
          className="p-3 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl flex items-center justify-center mt-1"
          title="My Location"
        >
          <LocateFixed size={22} />
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 dark:border-slate-700/50 overflow-hidden flex flex-col p-1">
        <button 
          onClick={() => zoomIn(0.5)}
          className="p-3 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl flex items-center justify-center mb-1"
        >
          <ZoomIn size={22} />
        </button>
        <div className="h-[1px] bg-slate-200/50 dark:bg-slate-600/50 mx-2" />
        <button 
          onClick={() => zoomOut(0.5)}
          className="p-3 text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl flex items-center justify-center mt-1"
        >
          <ZoomOut size={22} />
        </button>
      </div>
    </div>
  );
}
