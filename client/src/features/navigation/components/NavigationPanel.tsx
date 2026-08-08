import React from 'react';
import { NavigationStep } from '../utils/route_to_steps';
import { 
  ArrowUp, ArrowRight, ArrowLeft, ArrowUpRight, ArrowUpLeft, 
  CornerUpRight, CornerUpLeft, Undo2, MapPin, CheckCircle2,
  ListStart, Maximize2
} from 'lucide-react';

interface NavigationPanelProps {
  steps: NavigationStep[];
  activeStepIndex: number;
  totalDistance: number;
  etaSeconds: number;
  onClose: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

const getActionIcon = (action: string, size = 20) => {
  switch (action) {
    case 'straight': return <ArrowUp size={size} />;
    case 'slight right': return <ArrowUpRight size={size} />;
    case 'right': return <CornerUpRight size={size} />;
    case 'sharp right': return <ArrowRight size={size} />;
    case 'slight left': return <ArrowUpLeft size={size} />;
    case 'left': return <CornerUpLeft size={size} />;
    case 'sharp left': return <ArrowLeft size={size} />;
    case 'u-turn': return <Undo2 size={size} />;
    case 'elevator': return <Maximize2 size={size} />; 
    case 'escalator': return <ListStart size={size} />; 
    case 'stairs': return <ListStart size={size} />; 
    case 'arrive': return <MapPin size={size} color="#00e676" />;
    default: return <ArrowUp size={size} />;
  }
};

export default function NavigationPanel({ 
  steps, 
  activeStepIndex, 
  totalDistance, 
  etaSeconds,
  onClose,
  onNextStep,
  onPrevStep,
  isSimulating,
  onToggleSimulation
}: NavigationPanelProps) {
  const mins = Math.ceil(etaSeconds / 60);

  return (
    <div 
      className="absolute top-0 left-0 bottom-0 w-80 z-50 flex flex-col shadow-2xl transition-transform"
      style={{
        background: 'rgba(10,16,32,0.95)',
        backdropFilter: 'blur(24px)',
        borderRight: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* Header */}
      <div className="p-4 border-b shrink-0" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-600">
              <CheckCircle2 size={18} color="#fff" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Live Navigation</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="flex gap-4 mt-4 text-sm font-semibold">
          <div className="text-green-400">{mins} min</div>
          <div className="text-gray-300">({Math.round(totalDistance)} m)</div>
        </div>
      </div>

      {/* Steps List */}
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        {steps.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPast = idx < activeStepIndex;
          
          return (
            <div 
              key={idx} 
              className={`flex items-start gap-4 p-3 rounded-xl transition-all ${
                isActive ? 'bg-blue-600/20 border border-blue-500/30' : 
                isPast ? 'opacity-40' : 'hover:bg-white/5'
              }`}
            >
              <div 
                className={`mt-1 flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                  isActive ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {getActionIcon(step.action)}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${isActive ? 'text-white' : 'text-gray-300'}`}>
                  {step.instruction}
                </div>
                {step.distanceMeters > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {step.distanceMeters} m
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls Footer */}
      <div className="p-4 border-t shrink-0 flex flex-col gap-2 bg-[#0e1426]/50" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex gap-2">
          <button 
            onClick={onPrevStep} 
            disabled={activeStepIndex === 0}
            className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:hover:bg-white/10 text-white rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            ← Prev
          </button>
          <button 
            onClick={onNextStep} 
            disabled={activeStepIndex === steps.length - 1}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded-lg py-2 text-xs font-semibold transition-colors"
          >
            Next →
          </button>
        </div>
        <button 
          onClick={onToggleSimulation}
          className={`w-full py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            isSimulating 
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30' 
              : 'bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30'
          }`}
        >
          {isSimulating ? '⏸ Pause Auto-Walk' : '▶ Play Auto-Walk'}
        </button>
      </div>
    </div>
  );
}
