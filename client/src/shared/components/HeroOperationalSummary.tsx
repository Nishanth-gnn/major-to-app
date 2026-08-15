import React from 'react'
import { motion } from 'framer-motion'
import {
  Train,
  Bus,
  Car,
  CheckCircle2,
  Bell,
  Wifi,
  Radio,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react'

interface HeroOperationalSummaryProps {
  airportName?: string
  location?: string
  lastUpdatedSeconds?: number
}

export default function HeroOperationalSummary({
  airportName = 'Hyderabad, India',
  location = 'Real-time multimodal transportation control center',
  lastUpdatedSeconds = 12,
}: HeroOperationalSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-[28px] bg-[#0E1B2D] border border-white/10 p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-6"
    >
      {/* Soft Ambient Radial Backdrop */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Meta Bar with LIVE Badge & Timestamp */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE OPERATIONAL CONTROL</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
            <Radio className="w-3.5 h-3.5 text-[#14C8FF] animate-pulse" />
            <span>Telemetry Feed Active</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#14C8FF]" />
          <span>Last updated {lastUpdatedSeconds} sec ago</span>
        </div>
      </div>

      {/* Main Content Layout: Left Title/Location + Right Compact Widget Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
        
        {/* Left Section (5 cols): Airport Dispatch Title & Context */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#14C8FF] uppercase">
            <MapPin className="w-4 h-4 text-[#2F80FF]" />
            <span>{airportName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#F8FAFC] tracking-tight leading-snug">
            Airport Express, Metro & Pushpak Bus Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-medium leading-relaxed">
            {location}
          </p>
        </div>

        {/* Right Section (7 cols): Enterprise Operational Metrics Widgets Grid */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          {/* Next Metro */}
          <div className="p-3.5 rounded-2xl bg-[#13243B] border border-white/10 hover:border-blue-400/40 transition-all hover-lift space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Next Metro</span>
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-[#14C8FF] flex items-center justify-center">
                <Train className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-[#F8FAFC]">3 min</div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Platform 2 • On Time
            </div>
          </div>

          {/* Pushpak ETA */}
          <div className="p-3.5 rounded-2xl bg-[#13243B] border border-white/10 hover:border-emerald-400/40 transition-all hover-lift space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Pushpak ETA</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Bus className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-[#F8FAFC]">7 min</div>
            <div className="text-[10px] text-emerald-400 font-semibold">12 Shuttles Active</div>
          </div>

          {/* Taxi Pickup Queue */}
          <div className="p-3.5 rounded-2xl bg-[#13243B] border border-white/10 hover:border-amber-400/40 transition-all hover-lift space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Taxi Queue</span>
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Car className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-300">Low</div>
            <div className="text-[10px] text-[#94A3B8]">45 Cabs at Level P3</div>
          </div>

          {/* Transit Network Status */}
          <div className="p-3.5 rounded-2xl bg-[#13243B] border border-white/10 hover:border-emerald-400/40 transition-all hover-lift space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Transit Network</span>
              <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-sm font-black text-emerald-400 leading-tight pt-1">Operational</div>
            <div className="text-[10px] text-[#94A3B8]">99.8% Reliability</div>
          </div>

          {/* Active Alerts */}
          <div className="p-3.5 rounded-2xl bg-[#13243B] border border-white/10 hover:border-cyan-400/40 transition-all hover-lift space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Active Alerts</span>
              <div className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-cyan-300">2</div>
            <div className="text-[10px] text-cyan-200/80">Minor Gate Advisory</div>
          </div>

          {/* Connectivity */}
          <div className="p-3.5 rounded-2xl bg-[#13243B] border border-white/10 hover:border-blue-400/40 transition-all hover-lift space-y-1.5">
            <div className="flex items-center justify-between text-[#94A3B8]">
              <span className="text-[10px] font-extrabold uppercase tracking-wider">Connectivity</span>
              <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-[#14C8FF] flex items-center justify-center">
                <Wifi className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-black text-[#14C8FF]">Online</div>
            <div className="text-[10px] text-[#94A3B8]">5G Low Latency</div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}
