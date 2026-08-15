import React from 'react';
import { motion } from 'framer-motion';
import { Siren, ShieldAlert, HeartPulse, Pill, AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HealthProfile, MedicationItem } from '../types';

interface EmergencyHealthSummaryProps {
  profile: HealthProfile;
  medications: MedicationItem[];
}

export default function EmergencyHealthSummary({ profile, medications }: EmergencyHealthSummaryProps) {
  const navigate = useNavigate();

  const handleTriggerEmergency = () => {
    sessionStorage.setItem(
      'emergencyHealthPayload',
      JSON.stringify({
        medicalConditions: profile.medicalConditions,
        allergies: profile.allergies,
        medications: medications.map((m) => `${m.name} (${m.dosage})`),
        notes: profile.notes,
      })
    );
    navigate('/emergency-contact');
  };

  return (
    <div className="bg-gradient-to-br from-red-950/30 via-[#0c1322] to-[#0d1628] border border-red-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-500/20 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-white shadow-lg shadow-red-600/30">
            <Siren size={22} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Emergency Services Medical Summary</span>
              <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-500/40">
                Auto-Attached to SOS
              </span>
            </h2>
            <p className="text-xs text-slate-300">
              Health & medication records attached automatically during airport medical alerts
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="bg-[#0d1628] p-3.5 rounded-xl border border-white/8 space-y-1">
          <span className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1">
            <HeartPulse size={12} /> Medical Conditions
          </span>
          <div className="flex flex-wrap gap-1 pt-1">
            {profile.medicalConditions.map((cond) => (
              <span key={cond} className="bg-rose-500/20 text-rose-200 text-[10px] px-2 py-0.5 rounded border border-rose-500/30">
                {cond}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0d1628] p-3.5 rounded-xl border border-white/8 space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase flex items-center gap-1">
            <AlertTriangle size={12} /> Allergies
          </span>
          <div className="flex flex-wrap gap-1 pt-1">
            {profile.allergies.map((alg) => (
              <span key={alg} className="bg-amber-500/20 text-amber-200 text-[10px] px-2 py-0.5 rounded border border-amber-500/30">
                {alg}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[#0d1628] p-3.5 rounded-xl border border-white/8 space-y-1">
          <span className="text-[10px] font-bold text-blue-400 uppercase flex items-center gap-1">
            <Pill size={12} /> Active Medications
          </span>
          <div className="flex flex-wrap gap-1 pt-1">
            {medications.map((m) => (
              <span key={m.id} className="bg-blue-500/20 text-blue-200 text-[10px] px-2 py-0.5 rounded border border-blue-500/30">
                {m.name} ({m.dosage})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex items-center justify-between pt-2">
        <p className="text-[11px] text-slate-400">
          In case of emergency, airport responders receive this medical summary alongside your live GPS coordinates.
        </p>
        <button
          onClick={handleTriggerEmergency}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 shrink-0"
        >
          <span>Trigger Medical SOS</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
