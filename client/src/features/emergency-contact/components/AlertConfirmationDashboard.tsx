import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Navigation,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';
import LiveTrackingMap from '../../transit-services/components/LiveTrackingMap';
import { AGENCIES, getNearestFacility, EmergencyReasonItem } from '../data/emergencyCategories';

interface AlertConfirmationDashboardProps {
  reason: EmergencyReasonItem;
  latitude: number;
  longitude: number;
  passengerName: string;
  ticketId: string;
  terminal?: string;
  onReset?: () => void;
}

export default function AlertConfirmationDashboard({
  reason,
  latitude,
  longitude,
  passengerName,
  ticketId,
  terminal = 'Terminal 3',
  onReset,
}: AlertConfirmationDashboardProps) {
  const [currentStep, setCurrentStep] = useState(2); // Starts at "Response Team Assigned"
  const nearestFacility = getNearestFacility(reason.category);

  // Simulate timeline progression
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(3), 6000);  // En route
    const timer2 = setTimeout(() => setCurrentStep(4), 16000); // Arrived
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const timelineSteps = [
    { label: 'Alert Sent', desc: 'Dispatched via Emergency Network' },
    { label: 'Dispatcher Confirmed', desc: 'Command Center Acknowledged' },
    { label: 'Response Team Assigned', desc: 'Agencies Notified via Telegram' },
    { label: 'Team En Route', desc: 'Units Dispatched to Terminal Location' },
    { label: 'Responder Arrived', desc: 'On-site First Aid & Security' },
    { label: 'Incident Resolved', desc: 'Complete Assistance Rendered' },
  ];

  const primaryAgency = AGENCIES[reason.primaryAgency];

  return (
    <div className="space-y-6 pb-12">
      {/* ── Top Header Banner ── */}
      <div className="bg-[#0b1324]/90 border border-emerald-500/40 rounded-2xl p-5 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-xl shadow-emerald-500/30">
              <ShieldCheck size={32} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <span>Emergency Dispatch Confirmed</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                ● LIVE RESPONSE
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Target Reason: <span className="font-bold text-white">{reason.label}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase text-slate-400 font-bold">Estimated Arrival</div>
            <div className="text-base font-extrabold text-emerald-400 flex items-center justify-end gap-1">
              <Clock size={14} /> 2 – 4 mins
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Emergency Metrics Cards (Step 3) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0d1628] border border-white/10 p-3.5 rounded-xl shadow-lg">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Primary Responder</div>
          <div className="text-xs font-extrabold text-white flex items-center gap-1.5 mt-1">
            <span>{primaryAgency.icon}</span>
            <span className="truncate">{primaryAgency.shortName}</span>
          </div>
        </div>

        <div className="bg-[#0d1628] border border-white/10 p-3.5 rounded-xl shadow-lg">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Status</div>
          <div className="text-xs font-extrabold text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Dispatch Active</span>
          </div>
        </div>

        <div className="bg-[#0d1628] border border-white/10 p-3.5 rounded-xl shadow-lg">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Live GPS Shared</div>
          <div className="text-xs font-extrabold text-blue-400 flex items-center gap-1 mt-1">
            <MapPin size={12} />
            <span>Yes (±8m precision)</span>
          </div>
        </div>

        <div className="bg-[#0d1628] border border-white/10 p-3.5 rounded-xl shadow-lg">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Airport Concourse</div>
          <div className="text-xs font-extrabold text-purple-300 flex items-center gap-1 mt-1">
            <Navigation size={12} />
            <span>{terminal}</span>
          </div>
        </div>
      </div>

      {/* ── Responding Agencies Badges (Step 2 & 3) ── */}
      <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-4 space-y-3 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Dispatched Responding Agencies
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Agency */}
          <div className={`px-3 py-2 rounded-xl border text-xs font-extrabold flex items-center gap-2 ${primaryAgency.badgeBg} ${primaryAgency.badgeBorder} ${primaryAgency.badgeText}`}>
            <span className="text-base">{primaryAgency.icon}</span>
            <div>
              <div>{primaryAgency.name}</div>
              <div className="text-[9px] opacity-80 uppercase font-mono">Lead Authority</div>
            </div>
          </div>

          {/* Additional Responders */}
          {reason.additionalAgencies.map((agencyKey) => {
            const ag = AGENCIES[agencyKey];
            return (
              <div key={agencyKey} className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 ${ag.badgeBg} ${ag.badgeBorder} ${ag.badgeText}`}>
                <span className="text-base">{ag.icon}</span>
                <div>
                  <div>{ag.shortName}</div>
                  <div className="text-[9px] opacity-80 uppercase font-mono">Joint Response</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step 7: Nearest Airport Facility ── */}
      <div className="bg-[#0d1628] border border-blue-500/30 rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>{nearestFacility.icon}</span>
            Nearest Facility: {nearestFacility.name}
          </span>
          <span className="text-xs font-extrabold text-emerald-400">
            {nearestFacility.distance} ({nearestFacility.etaMinutes})
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Location: <span className="text-white font-semibold">{nearestFacility.locationDetails}</span>
        </p>
      </div>

      {/* ── Step 8: Interactive Map Integration ── */}
      <div className="h-[280px]">
        <LiveTrackingMap
          lat={latitude}
          lng={longitude}
          vehicleName="Passenger Emergency GPS Pin"
          vehicleType="metro"
        />
      </div>

      {/* ── Step 6: Live Status Updates & Progression Timeline ── */}
      <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 space-y-4 shadow-xl">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span>Live Response Progress Timeline</span>
          <span className="text-[10px] text-emerald-400 font-mono">Real-time status updates</span>
        </h3>

        <div className="space-y-3">
          {timelineSteps.map((step, idx) => {
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-start gap-3 relative">
                {idx < timelineSteps.length - 1 && (
                  <div
                    className={`absolute left-3.5 top-6 w-0.5 h-6 ${
                      idx < currentStep ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  />
                )}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isDone
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isDone ? '✓' : idx + 1}
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isCurrent ? 'text-emerald-400 animate-pulse' : isDone ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </h4>
                  <p className="text-[11px] text-slate-400">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Resolve & Exit Emergency Tracking Action Banner ── */}
      {onReset && (
        <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div>
            <h4 className="text-xs font-extrabold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Assistance Complete or Issue Resolved?</span>
            </h4>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Click below to close live tracking mode and return to the main emergency screen.
            </p>
          </div>
          <button
            onClick={onReset}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-extrabold shadow-lg shadow-red-500/25 transition-all shrink-0 active:scale-95"
          >
            Resolve Emergency & Exit Tracking
          </button>
        </div>
      )}
    </div>
  );
}
