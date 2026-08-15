import React from 'react'
import { motion } from 'framer-motion'
import {
  Plane,
  Clock,
  MapPin,
  CloudSun,
  ChevronRight,
  CheckCircle2,
  Navigation,
  Luggage,
  Utensils,
  Train,
  ShieldAlert,
  Sparkles,
  Footprints,
  Armchair,
  Layers,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface BoardingData {
  passenger_name: string
  flight_id: string
  ticket_id: string
  date: string
  from: string
  to: string
  terminal: string
  seat: string
  gate?: string
  zone?: string
}

interface JourneyHeroCardProps {
  boardingData: BoardingData
}

const JOURNEY_STEPS = [
  { id: 'entered', label: 'Entered Airport', completed: true },
  { id: 'security', label: 'Security Cleared', completed: true },
  { id: 'gate_walk', label: 'Walking to Gate', active: true },
  { id: 'boarding', label: 'Boarding' },
  { id: 'takeoff', label: 'Takeoff' },
  { id: 'arrival', label: 'Arrival' },
  { id: 'baggage', label: 'Baggage Collection' },
  { id: 'exit', label: 'Exit Airport' },
]

export default function JourneyHeroCard({ boardingData }: JourneyHeroCardProps) {
  const navigate = useNavigate()

  const openAura = () => {
    window.dispatchEvent(new Event('aura-open-event'))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-[28px] overflow-hidden bg-radial-card border border-white/10 shadow-2xl relative p-6 sm:p-8 space-y-6"
    >
      {/* Background glow overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-blue-500/20 text-[#14C8FF] border border-blue-400/20">
              Live Operational Journey
            </span>
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] mt-1 tracking-tight">Your Journey Today</h1>
        </div>

        {/* Destination Weather & Zone Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#13243B] border border-white/10 text-xs">
            <CloudSun className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-white font-bold text-xs">28°C Clear Sky</div>
              <div className="text-[10px] text-[#94A3B8]">Destination: Delhi (DEL)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Flight Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left 7 Cols: Route & Key Attributes */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#94A3B8] font-extrabold tracking-widest uppercase">
              <Plane className="w-4 h-4 text-[#2F80FF]" />
              <span>{boardingData.flight_id || 'AI-102'} • Air India</span>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              ON TIME
            </span>
          </div>

          {/* Prominent Large Route Typography */}
          <div className="flex items-center gap-4 py-1">
            <span className="text-4xl sm:text-5xl font-black text-[#F8FAFC] tracking-tight">{boardingData.from || 'HYD'}</span>
            <div className="flex-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2F80FF]" />
              <div className="h-0.5 flex-1 bg-gradient-to-r from-[#2F80FF] via-[#14C8FF] to-[#22C55E]" />
              <Plane className="w-5 h-5 text-[#14C8FF] shrink-0" />
            </div>
            <span className="text-4xl sm:text-5xl font-black text-[#F8FAFC] tracking-tight">{boardingData.to || 'DEL'}</span>
          </div>

          {/* Key Attributes Row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
            <div className="p-2.5 rounded-xl bg-[#13243B] border border-white/5">
              <div className="text-[9px] font-bold text-[#94A3B8] uppercase">Terminal</div>
              <div className="text-sm font-black text-[#F8FAFC] mt-0.5">{boardingData.terminal || 'Terminal 1'}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#13243B] border border-white/5">
              <div className="text-[9px] font-bold text-[#94A3B8] uppercase">Gate</div>
              <div className="text-sm font-black text-[#14C8FF] mt-0.5">{boardingData.gate || 'Gate 14B'}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#13243B] border border-white/5">
              <div className="text-[9px] font-bold text-[#94A3B8] uppercase">Seat</div>
              <div className="text-sm font-black text-[#F8FAFC] mt-0.5">{boardingData.seat || '18A'}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#13243B] border border-white/5">
              <div className="text-[9px] font-bold text-[#94A3B8] uppercase">Zone</div>
              <div className="text-sm font-black text-[#14C8FF] mt-0.5">{boardingData.zone || 'Zone A'}</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#13243B] border border-white/5 col-span-2 sm:col-span-1">
              <div className="text-[9px] font-bold text-[#94A3B8] uppercase">Gate Walk</div>
              <div className="text-sm font-black text-[#22C55E] mt-0.5">ETA 6 min</div>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: 24px Bold Bright Green Boarding Timer & SVG Ring */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-[#13243B] border border-white/10 shadow-xl flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Boarding Countdown</div>
            <div className="text-[24px] font-extrabold text-[#22C55E] leading-none tracking-tight font-mono">
              42 mins remaining
            </div>
            <p className="text-xs text-[#94A3B8] pt-1">Boarding starts at 15:45 (Gate 14B)</p>
          </div>

          {/* SVG Countdown Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" className="text-[#0E1B2D]" strokeWidth="10" stroke="currentColor" fill="transparent" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-[#22C55E]"
                strokeWidth="10"
                strokeDasharray={264}
                strokeDashoffset={66}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <Clock className="w-5 h-5 text-[#22C55E] absolute" />
          </div>
        </div>
      </div>

      {/* Premium Journey Timeline */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold">
          <span className="text-[11px] uppercase font-extrabold text-[#94A3B8]">STAGE 3 OF 8 • 42% JOURNEY COMPLETE</span>
          <span className="text-[#14C8FF] font-bold flex items-center gap-1">
            <Footprints className="w-3.5 h-3.5" /> Next Milestone: Gate 14B (Est. 6 mins)
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {JOURNEY_STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center text-center">
              <div
                className={`w-full h-2.5 rounded-full mb-2 transition-all flex items-center justify-center ${
                  step.completed
                    ? 'bg-[#22C55E]'
                    : step.active
                    ? 'bg-[#2F80FF] animate-pulse shadow-lg shadow-blue-500/50 ring-2 ring-blue-400/40'
                    : 'bg-white/10'
                }`}
              >
                {step.completed && <CheckCircle2 className="w-3 h-3 text-black font-extrabold" />}
              </div>
              <span
                className={`text-[10px] font-semibold leading-tight ${
                  step.active
                    ? 'text-[#14C8FF] font-black'
                    : step.completed
                    ? 'text-[#F8FAFC]'
                    : 'text-[#94A3B8]/50'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Journey Launchpad */}
      <div className="pt-3 border-t border-white/10">
        <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">
          Dynamic Journey Launchpad
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Track Bag */}
          <button
            onClick={() => navigate('/baggage-guidance')}
            className="p-3.5 rounded-2xl bg-[#13243B] hover:bg-[#1f3454] border border-white/10 hover:border-cyan-400/40 text-left transition-all flex flex-col justify-between space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Luggage className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F8FAFC]">Track Bag</div>
              <div className="text-[10px] text-[#22C55E] font-semibold">Loaded on Aircraft • ETA 8 min</div>
            </div>
          </button>

          {/* Gate Route */}
          <button
            onClick={() => navigate('/navigation')}
            className="p-3.5 rounded-2xl bg-[#13243B] hover:bg-[#1f3454] border border-white/10 hover:border-blue-400/40 text-left transition-all flex flex-col justify-between space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-[#2F80FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Navigation className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F8FAFC]">Gate Route</div>
              <div className="text-[10px] text-[#14C8FF] font-semibold">To Gate 14B • 6 min walk</div>
            </div>
          </button>

          {/* Metro Hub */}
          <button
            onClick={() => navigate('/transit-services')}
            className="p-3.5 rounded-2xl bg-[#13243B] hover:bg-[#1f3454] border border-white/10 hover:border-emerald-400/40 text-left transition-all flex flex-col justify-between space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Train className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F8FAFC]">Metro Hub</div>
              <div className="text-[10px] text-[#22C55E] font-semibold">Airport Express • Next in 3 min</div>
            </div>
          </button>

          {/* Order Food */}
          <button
            onClick={() => navigate('/meal-delivery')}
            className="p-3.5 rounded-2xl bg-[#13243B] hover:bg-[#1f3454] border border-white/10 hover:border-amber-400/40 text-left transition-all flex flex-col justify-between space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Utensils className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#94A3B8] group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#F8FAFC]">Order Food</div>
              <div className="text-[10px] text-amber-300 font-semibold">Seat Delivery • Before takeoff</div>
            </div>
          </button>

          {/* Emergency */}
          <button
            onClick={() => navigate('/emergency-contact')}
            className="p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-left transition-all flex flex-col justify-between space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-xs font-bold text-red-300">Emergency</div>
              <div className="text-[10px] text-red-400/90 font-semibold">24/7 Medical / Police / Staff</div>
            </div>
          </button>

          {/* AI Concierge */}
          <button
            onClick={openAura}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-600/20 to-cyan-500/20 hover:from-blue-600/40 hover:to-cyan-500/40 border border-cyan-400/30 text-left transition-all flex flex-col justify-between space-y-2 group shadow-md"
          >
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 rounded-xl bg-cyan-400/20 text-[#14C8FF] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-cyan-300 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div>
              <div className="text-xs font-bold text-cyan-300">AI Concierge</div>
              <div className="text-[10px] text-[#14C8FF] font-semibold">Ask anything • Flight & Baggage</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}
