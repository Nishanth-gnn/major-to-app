import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, MapPin, Plane, ShieldCheck } from 'lucide-react';
import FlightCountdown from '../components/FlightCountdown';

interface BoardingData {
  passenger_name?: string;
  ticket_id?: string;
  flight_id?: string;
  from?: string;
  to?: string;
  terminal?: string;
  seat?: string;
  gate?: string;
}

type FlightStatusType = 'boarding_soon' | 'delayed' | 'on_time' | 'gate_changed';

const STATUS_CONFIG: Record<
  FlightStatusType,
  { label: string; badgeBg: string; textColor: string; borderColor: string; icon: string }
> = {
  boarding_soon: {
    label: '🟢 Boarding Soon',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800',
  },
  on_time: {
    label: '🔵 On Time',
    badgeBg: 'bg-blue-50 dark:bg-blue-950/40',
    textColor: 'text-blue-700 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  delayed: {
    label: '🟡 Delayed',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40',
    textColor: 'text-amber-700 dark:text-amber-400',
    borderColor: 'border-amber-200 dark:border-amber-800',
  },
  gate_changed: {
    label: '🔴 Gate Changed',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
    textColor: 'text-rose-700 dark:text-rose-400',
    borderColor: 'border-rose-200 dark:border-rose-800',
  },
};

export default function FlightTrackingPage() {
  const navigate = useNavigate();
  const [boardingData, setBoardingData] = useState<BoardingData | null>(null);
  const [currentStatus, setCurrentStatus] = useState<FlightStatusType>('boarding_soon');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('boardingData');
      if (raw) {
        setBoardingData(JSON.parse(raw));
      }
    } catch (e) {
      console.error('Failed to parse boarding data:', e);
    }
  }, []);

  const gateNumber = boardingData?.gate || 'Gate A12';
  const flightNumber = boardingData?.flight_id || 'AI217';
  const statusInfo = STATUS_CONFIG[currentStatus];

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-5 sm:px-6 lg:px-8 lg:py-8 transition-colors duration-300">
      {/* Top ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-white/90 dark:bg-slate-800/90 p-5 border border-slate-150/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur sm:p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
              aria-label="Back to home"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                Flight Services
              </p>
              <h2 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                ✈️ Flight Tracking
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Live departure countdown, gate assignment, flight status, and external radar tracking for flight{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">{flightNumber}</span>.
          </p>
        </header>

        {/* SECTION 1: Transit Countdown */}
        <section>
          <FlightCountdown />
        </section>

        {/* SECTION 2: Flight Information (Gate Number & Status) */}
        <section className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Flight Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Flight Gate Number */}
            <div className="rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-150/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <MapPin size={28} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Flight Gate Number
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white mt-0.5 font-mono">
                  {gateNumber}
                </div>
              </div>
            </div>

            {/* Card 2: Flight Status */}
            <div
              className={`rounded-3xl p-6 border shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center gap-4 ${statusInfo.badgeBg} ${statusInfo.borderColor}`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-700/50 flex items-center justify-center text-2xl shrink-0">
                <Plane size={26} className={statusInfo.textColor} />
              </div>
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Flight Status
                </span>
                <div className={`text-xl font-black mt-0.5 ${statusInfo.textColor}`}>
                  {statusInfo.label}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive status selector (Quick preview control) */}
          <div className="pt-1 px-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-400">Change Status Preview:</span>
            {(Object.keys(STATUS_CONFIG) as FlightStatusType[]).map((st) => (
              <button
                key={st}
                onClick={() => setCurrentStatus(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                  currentStatus === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {STATUS_CONFIG[st].label}
              </button>
            ))}
          </div>
        </section>

        {/* SECTION 3: Live Flight Location Button */}
        <section className="rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-150/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <ShieldCheck size={16} className="text-blue-500" />
              Live Flight Radar Tracking
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track the exact real-time 3D location, altitude, and trajectory of your aircraft on Flightradar24.
            </p>
          </div>

          <a
            href="https://www.flightradar24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-lg rounded-2xl shadow-lg shadow-blue-500/20 transition-all duration-300 flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span className="text-2xl group-hover:animate-bounce">✈️</span>
            <span>Live Location of Flight</span>
            <ExternalLink size={20} className="text-blue-200 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </section>
      </div>
    </div>
  );
}
