import React from 'react';
import { Bus, Clock, Calendar, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { BusInfo } from '../types';
import { motion } from 'framer-motion';

interface BusCardProps {
  bus: BusInfo;
  onTrack: (bus: BusInfo) => void;
  isTrackingThisBus: boolean;
  anyBusTracking: boolean;
}

export default function BusCard({ bus, onTrack, isTrackingThisBus, anyBusTracking }: BusCardProps) {
  const getSeatColor = (seats: BusInfo['seats']) => {
    switch (seats) {
      case 'Available':
        return 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30 border-emerald-200/50';
      case 'Filling Fast':
        return 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 border-amber-200/50';
      case 'Housefull':
        return 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30 border-rose-200/50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getSeatIcon = (seats: BusInfo['seats']) => {
    switch (seats) {
      case 'Available':
        return <CheckCircle size={14} />;
      case 'Filling Fast':
        return <AlertTriangle size={14} />;
      case 'Housefull':
        return <AlertOctagon size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Bus size={24} />
          </div>
          <div>
            <h4 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
              {bus.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
              <Calendar size={13} className="shrink-0" />
              <span>Pushpak Airport Coach</span>
            </div>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getSeatColor(bus.seats)}`}>
          {getSeatIcon(bus.seats)}
          {bus.seats}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-y border-slate-100 dark:border-slate-700/50">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
            Departure
          </span>
          <span className="text-base font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
            {bus.departure}
          </span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
            ETA
          </span>
          <span className="text-base font-bold text-sky-600 dark:text-sky-400 block mt-0.5 flex items-center gap-1">
            <Clock size={16} />
            {bus.eta}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <button
          onClick={() => onTrack(bus)}
          disabled={anyBusTracking}
          className={`w-full py-3.5 px-4 rounded-2xl text-sm font-bold transition-all duration-300 transform select-none ${
            isTrackingThisBus
              ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md active:scale-[0.98]'
              : anyBusTracking
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] dark:bg-blue-700 dark:hover:bg-blue-600'
          }`}
        >
          {isTrackingThisBus ? 'Requested Location...' : 'Track Bus'}
        </button>
      </div>
    </motion.div>
  );
}
