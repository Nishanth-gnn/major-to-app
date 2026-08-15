import React from 'react';
import { motion } from 'framer-motion';
import { Pill, Clock, Utensils, MapPin, Bell, CheckCircle2 } from 'lucide-react';
import { MedicationItem } from '../types';

interface MedicationReminderCardProps {
  medications: MedicationItem[];
}

export default function MedicationReminderCard({ medications }: MedicationReminderCardProps) {
  const activeReminder = medications[0] || {
    name: 'Metformin',
    dosage: '500 mg',
    time: '06:30 PM',
    instruction: 'With Food',
  };

  return (
    <div className="bg-gradient-to-br from-[#0c1322] to-[#0e172a] border border-blue-500/30 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Pill size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Next Scheduled Medication Reminder</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <Bell size={10} className="animate-bounce" /> Active Alert
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Synchronized with Gate 18 Food Court schedule
            </p>
          </div>
        </div>
      </div>

      {/* Main Reminder Card */}
      <div className="bg-[#0d1628] border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-extrabold text-white text-sm">{activeReminder.name}</span>
            <span className="bg-blue-500/20 text-blue-300 text-[10px] font-mono px-2 py-0.5 rounded border border-blue-500/30">
              {activeReminder.dosage}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Clock size={13} /> Next Dose: {activeReminder.time}
            </span>
            <span className="text-amber-300 font-semibold flex items-center gap-1">
              <Utensils size={13} /> {activeReminder.instruction}
            </span>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Nearest Food Court</div>
          <div className="text-xs font-extrabold text-blue-400 flex items-center gap-1">
            <MapPin size={12} /> Gate 18 Concourse
          </div>
        </div>
      </div>
    </div>
  );
}
