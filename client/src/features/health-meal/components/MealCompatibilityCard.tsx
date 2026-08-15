import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Utensils, AlertTriangle, CheckCircle2, ArrowRight, ShieldAlert } from 'lucide-react';
import { FlightMealInfo, HealthProfile } from '../types';

interface MealCompatibilityCardProps {
  flightMeal: FlightMealInfo;
  healthProfile: HealthProfile;
}

export default function MealCompatibilityCard({ flightMeal, healthProfile }: MealCompatibilityCardProps) {
  const isCaution = flightMeal.compatibilityStatus === 'CAUTION';
  const isAvoid = flightMeal.compatibilityStatus === 'AVOID';

  return (
    <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Plane size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Flight Meal Health Compatibility</span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Ticket Synced: {flightMeal.flightNumber}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Airline: {flightMeal.airline} • Departs: {flightMeal.departureTime} ({flightMeal.duration})
            </p>
          </div>
        </div>

        {/* Compatibility Badge */}
        <span
          className={`text-xs font-extrabold px-3 py-1 rounded-xl border flex items-center gap-1.5 ${
            isCaution
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : isAvoid
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
        >
          {isCaution ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
          <span>{flightMeal.compatibilityStatus}</span>
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selected Airline Meal Card */}
        <div className="bg-[#0d1628] p-4 rounded-xl border border-white/8 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold">Currently Selected Meal</span>
            <span className="text-amber-400 font-mono">AVML Code</span>
          </div>
          <p className="text-sm font-extrabold text-white flex items-center gap-2">
            <Utensils size={16} className="text-amber-400" />
            {flightMeal.selectedMeal}
          </p>

          <div className="pt-2 border-t border-white/5 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Passenger Active Profile</span>
            <div className="flex flex-wrap gap-1.5">
              {healthProfile.medicalConditions.map((cond) => (
                <span key={cond} className="text-[10px] bg-rose-500/15 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                  {cond}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Recommended Meal & Suggested Action */}
        <div className="bg-gradient-to-br from-emerald-950/40 to-teal-950/20 p-4 rounded-xl border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-400 font-bold">
            <span>Recommended Meal Replacement</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded border border-emerald-500/40">DBML</span>
          </div>
          <p className="text-sm font-extrabold text-white flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-400" />
            {flightMeal.recommendedMeal}
          </p>

          <div className="pt-2 border-t border-emerald-500/20">
            <p className="text-xs text-emerald-200/90 font-medium">
              Suggested Action: {flightMeal.suggestedAction}
            </p>
          </div>
        </div>
      </div>

      {/* Warnings List */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-1">
        {flightMeal.warnings.map((warn, i) => (
          <p key={i} className="text-xs text-amber-200 font-semibold flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-amber-400 shrink-0" />
            {warn}
          </p>
        ))}
      </div>
    </div>
  );
}
