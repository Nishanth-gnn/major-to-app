import React from 'react';
import { motion } from 'framer-motion';
import { Utensils, MapPin, Clock, CheckCircle2, AlertTriangle, XCircle, ChevronRight } from 'lucide-react';
import { RestaurantOption } from '../types';

interface RestaurantRecommendationCardProps {
  restaurants: RestaurantOption[];
}

export default function RestaurantRecommendationCard({ restaurants }: RestaurantRecommendationCardProps) {
  return (
    <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Utensils size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Nearby Healthy Food Options</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                Gate Proximity Filtered
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Personalized food & restaurant choices tailored to your health profile
            </p>
          </div>
        </div>
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {restaurants.map((rest) => {
          const isRec = rest.suitability === 'RECOMMENDED';
          const isAvoid = rest.suitability === 'AVOID';

          const borderStyle = isRec
            ? 'border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-[#0d1628]'
            : isAvoid
            ? 'border-red-500/40 bg-gradient-to-br from-red-950/30 to-[#0d1628]'
            : 'border-blue-500/40 bg-[#0d1628]';

          return (
            <motion.div
              key={rest.id}
              whileHover={{ y: -3 }}
              className={`p-4 rounded-xl border ${borderStyle} shadow-xl space-y-3 relative overflow-hidden`}
            >
              {/* Top Row: Name & Suitability Badge */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white">{rest.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-blue-400 font-bold flex items-center gap-1">
                      <MapPin size={12} /> {rest.gateNumber}
                    </span>
                    <span>• {rest.distance} ({rest.walkingTimeMins} mins walk)</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border flex items-center gap-1 uppercase tracking-wider ${
                    isRec
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : isAvoid
                      ? 'bg-red-500/20 text-red-300 border-red-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                  }`}
                >
                  {isRec ? <CheckCircle2 size={12} /> : isAvoid ? <XCircle size={12} /> : <AlertTriangle size={12} />}
                  <span>{rest.suitability}</span>
                </span>
              </div>

              {/* Recommended Items */}
              {rest.recommendedItems.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">Recommended Choice:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rest.recommendedItems.map((item, idx) => (
                      <span key={idx} className="text-[11px] bg-emerald-500/15 text-emerald-200 px-2 py-0.5 rounded border border-emerald-500/30">
                        ✓ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Avoid Items */}
              {rest.avoidItems.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-400 uppercase">Avoid For Your Profile:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rest.avoidItems.map((item, idx) => (
                      <span key={idx} className="text-[11px] bg-red-500/15 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                        ✗ {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
