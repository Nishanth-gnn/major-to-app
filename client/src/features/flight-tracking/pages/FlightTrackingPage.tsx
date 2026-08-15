import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ExternalLink,
  MapPin,
  Plane,
  ShieldCheck,
  Clock,
  CloudSun,
  User,
  Ticket,
  Armchair,
  CheckCircle2,
  Calendar,
  Compass,
} from 'lucide-react'
import FlightCountdown from '../components/FlightCountdown'

interface BoardingData {
  passenger_name?: string
  ticket_id?: string
  flight_id?: string
  from?: string
  to?: string
  terminal?: string
  seat?: string
  gate?: string
  date?: string
}

type FlightStatusType = 'boarding_soon' | 'delayed' | 'on_time' | 'gate_changed'

const STATUS_CONFIG: Record<
  FlightStatusType,
  { label: string; badgeBg: string; textColor: string; borderColor: string }
> = {
  boarding_soon: {
    label: 'Boarding Soon',
    badgeBg: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
  },
  on_time: {
    label: 'On Time',
    badgeBg: 'bg-blue-500/20',
    textColor: 'text-[#14C8FF]',
    borderColor: 'border-blue-400/30',
  },
  delayed: {
    label: 'Delayed',
    badgeBg: 'bg-amber-500/20',
    textColor: 'text-amber-300',
    borderColor: 'border-amber-500/30',
  },
  gate_changed: {
    label: 'Gate Changed',
    badgeBg: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
  },
}

export default function FlightTrackingPage() {
  const navigate = useNavigate()
  const [boardingData, setBoardingData] = useState<BoardingData | null>(null)
  const [currentStatus, setCurrentStatus] = useState<FlightStatusType>('boarding_soon')

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('boardingData')
      if (raw) {
        setBoardingData(JSON.parse(raw))
      }
    } catch (e) {
      console.error('Failed to parse boarding data:', e)
    }
  }, [])

  const gateNumber = boardingData?.gate || 'Gate 14B'
  const flightNumber = boardingData?.flight_id || 'AI-102'
  const statusInfo = STATUS_CONFIG[currentStatus]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#14C8FF]">
              Passenger Flight Hub
            </span>
            <h1 className="text-2xl font-black text-[#F8FAFC] flex items-center gap-2">
              <Plane className="w-6 h-6 text-[#2F80FF]" />
              <span>Flight {flightNumber} Tracking</span>
            </h1>
          </div>
        </div>

        <span
          className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${statusInfo.badgeBg} ${statusInfo.textColor} ${statusInfo.borderColor} flex items-center gap-1.5`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          {statusInfo.label}
        </span>
      </div>

      {/* SECTION 1: Circular Boarding Countdown & Progress */}
      <FlightCountdown />

      {/* SECTION 2: Comprehensive Airline Boarding Pass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Flight Spec Card */}
        <div className="md:col-span-2 p-6 rounded-[24px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">Airline & Aircraft</div>
              <div className="text-lg font-extrabold text-[#F8FAFC]">Air India • Boeing 787-9 Dreamliner</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase text-[#94A3B8] tracking-wider">Boarding Group</div>
              <div className="text-lg font-black text-[#14C8FF]">Group B (Zone 2)</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-2xl bg-[#162742] border border-white/5">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Departure Terminal</div>
              <div className="text-base font-extrabold text-[#F8FAFC] mt-0.5">{boardingData?.terminal || 'Terminal 2'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#162742] border border-white/5">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Assigned Gate</div>
              <div className="text-base font-extrabold text-[#14C8FF] mt-0.5">{gateNumber}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#162742] border border-white/5">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Seat Assignment</div>
              <div className="text-base font-extrabold text-[#F8FAFC] mt-0.5">{boardingData?.seat || '12A (Window)'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#162742] border border-white/5">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Flight Date</div>
              <div className="text-base font-extrabold text-[#F8FAFC] mt-0.5">{boardingData?.date || 'Today'}</div>
            </div>
          </div>

          {/* Connection & Weather Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#162742]/60 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <CloudSun className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-[#94A3B8]">Destination Weather</div>
                <div className="text-xs font-bold text-[#F8FAFC]">New Delhi (DEL): 31°C Clear Sky</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#162742]/60 border border-white/5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-[#2F80FF] flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-[#94A3B8]">Connection Info</div>
                <div className="text-xs font-bold text-[#F8FAFC]">Direct Flight • Baggage Through-Checked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Flight Radar Trigger */}
        <div className="p-6 rounded-[24px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#14C8FF] uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#2F80FF]" />
              <span>Live Satellite Flight Radar</span>
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">Track 3D Radar Trajectory</h3>
            <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">
              View real-time altitude, airspeed, aircraft position, and live flight path on global ADS-B radar.
            </p>
          </div>

          <a
            href="https://www.flightradar24.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#2F80FF] to-[#14C8FF] hover:from-[#1E6DFF] hover:to-cyan-400 text-white font-extrabold text-sm shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Plane className="w-4 h-4" />
            <span>Open Live Flight Location</span>
            <ExternalLink className="w-4 h-4 opacity-80" />
          </a>
        </div>
      </div>
    </div>
  )
}
