import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plane,
  Calendar,
  Hash,
  MapPin,
  PlaneTakeoff,
  PlaneLanding,
  User,
  ArrowLeft,
  Ticket,
  Armchair,
} from 'lucide-react';
import { BoardingPassData } from '../utils/qrDecoder';
import Header from '../../home/components/Header';
import BottomNavigation from '../../home/components/BottomNavigation';
import FloatingAssistant from '../../../components/FloatingAssistant';

// ── Animated field card ───────────────────────────────────────
function DataField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col gap-1 hover:bg-white/90 dark:hover:bg-slate-800/90 transition-all">
      <div className="flex items-center gap-2">
        <div className="text-sky-500 dark:text-sky-400">
          <Icon size={15} />
        </div>
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
          {label}
        </span>
      </div>
      <div className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
        {value || '—'}
      </div>
    </div>
  );
}

// ── Animation variants ────────────────────────────────────────
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 26 } },
};

export default function BoardingPassPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState<BoardingPassData | null>(null);

  useEffect(() => {
    if (location.state?.boardingData) {
      setData(location.state.boardingData);
    } else {
      // Try sessionStorage fallback
      const stored = sessionStorage.getItem('boardingData');
      if (stored) {
        try { setData(JSON.parse(stored)); } catch { navigate('/'); }
      } else {
        navigate('/');
      }
    }
  }, [location, navigate]);

  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#eef2f6] dark:bg-slate-900 pb-28 font-sans transition-colors">
      <div className="max-w-3xl mx-auto p-4">
        <Header />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-6 flex flex-col gap-5"
        >
          {/* ── Page title + badge ── */}
          <motion.div variants={item} className="flex items-center justify-between">
            <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Ticket size={22} className="text-sky-500" />
              Boarding Pass
            </h1>
            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              ✓ Verified
            </span>
          </motion.div>

          {/* ── Passenger hero card ── */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-3xl p-6 shadow-xl"
            style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)' }}
          >
            {/* Decorative blobs */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                <User size={32} className="text-white" />
              </div>
              <div>
                <div className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                  Passenger
                </div>
                <div className="text-white text-2xl font-extrabold leading-tight">
                  {data.passenger_name}
                </div>
                <div className="text-white/70 text-sm mt-1">
                  Ticket ID: <span className="text-white font-semibold">{data.ticket_id}</span>
                </div>
              </div>
            </div>

            {/* Route strip */}
            <div className="relative mt-5 flex items-center justify-between bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3">
              <div className="text-center">
                <div className="text-white/70 text-[10px] uppercase tracking-widest">From</div>
                <div className="text-white text-xl font-extrabold">{data.from}</div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="h-px flex-1 bg-white/30" />
                <Plane className="mx-2 text-white" size={18} />
                <div className="h-px flex-1 bg-white/30" />
              </div>
              <div className="text-center">
                <div className="text-white/70 text-[10px] uppercase tracking-widest">To</div>
                <div className="text-white text-xl font-extrabold">{data.to}</div>
              </div>
            </div>
          </motion.div>

          {/* ── Detail grid ── */}
          <motion.div variants={item} className="grid grid-cols-2 gap-3">
            <DataField icon={Plane}        label="Flight ID"  value={data.flight_id} />
            <DataField icon={Calendar}     label="Date"       value={data.date} />
            <DataField icon={Armchair}     label="Seat"       value={data.seat} />
            <DataField icon={MapPin}       label="Terminal"   value={data.terminal} />
            <DataField icon={PlaneTakeoff} label="From"       value={data.from} />
            <DataField icon={PlaneLanding} label="To"         value={data.to} />
          </motion.div>

          {/* ── Go Back button ── */}
          <motion.div variants={item}>
            <button
              onClick={() => navigate('/')}
              className="w-full py-4 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-2xl shadow-md transition-all transform active:scale-[0.98] text-base"
            >
              <ArrowLeft size={20} />
              Go Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>

      <FloatingAssistant />
      <BottomNavigation />
    </div>
  );
}
