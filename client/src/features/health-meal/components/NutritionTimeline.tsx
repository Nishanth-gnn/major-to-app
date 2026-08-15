import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Plane, Droplet, Utensils, Pill } from 'lucide-react';
import { NutritionTimelineStep } from '../types';

interface NutritionTimelineProps {
  steps: NutritionTimelineStep[];
}

export default function NutritionTimeline({ steps }: NutritionTimelineProps) {
  return (
    <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Clock size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Travel Nutrition & Health Journey Timeline</span>
              <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-teal-500/30">
                Flight AI 542 Scheduled
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Synchronized pre-flight, in-flight, and arrival health steps
            </p>
          </div>
        </div>
      </div>

      {/* Vertical Steps */}
      <div className="space-y-4 pt-2 relative">
        {steps.map((step, idx) => {
          const isCompleted = step.status === 'COMPLETED';
          const isActive = step.status === 'ACTIVE';

          return (
            <div key={step.id} className="flex items-start gap-4 relative">
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-4 top-7 w-0.5 h-10 ${
                    isCompleted ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-lg ${
                  isCompleted
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : isActive
                    ? 'bg-blue-600 text-white shadow-blue-600/30 animate-pulse border-2 border-cyan-400'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                {step.icon}
              </div>

              <div className="flex-1 bg-[#0d1628] border border-white/8 p-3.5 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-white flex items-center gap-2">
                    <span>{step.title}</span>
                    <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-blue-300">
                      {step.time}
                    </span>
                  </span>

                  <span
                    className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : isActive
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
