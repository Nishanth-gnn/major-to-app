import React from 'react';
import { Sparkles, Clock, ArrowRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { AITransitRecommendation } from '../types';

interface RecommendationCardProps {
  recommendation: AITransitRecommendation;
}

export default function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-900/60 via-indigo-900/50 to-purple-900/40 border border-blue-500/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden"
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30 shrink-0">
            <Sparkles size={22} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-500/30 text-blue-200 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border border-blue-400/30 uppercase tracking-wider">
                AI Transit Recommendation
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-1">
              Recommended: {recommendation.recommendedMode}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
        </div>

        <div className="bg-white/10 border border-white/15 rounded-xl p-3 text-right shrink-0 w-full sm:w-auto">
          <div className="text-xs text-slate-300 font-medium flex items-center justify-end gap-1">
            <Clock size={13} className="text-blue-300" /> Expected Arrival: <span className="font-bold text-white">{recommendation.expectedArrival}</span>
          </div>
          <div className="text-xs font-extrabold text-emerald-400 mt-1 flex items-center justify-end gap-1">
            <Zap size={13} className="fill-emerald-400" /> Leaves in {recommendation.nextDepartureInMins} mins
          </div>
          <p className="text-[10px] text-slate-400 mt-1 font-medium italic">
            {recommendation.alternativeText}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
