import React, { useState } from 'react'
import { Plane, ArrowUpRight, ArrowDownLeft, ChevronRight } from 'lucide-react'

type FlightStatus = 'ON TIME' | 'BOARDING' | 'DELAYED' | 'DEPARTED' | 'ARRIVED' | 'CANCELLED'

interface FIDSFlight {
  code: string
  airline: string
  from?: string
  to?: string
  time: string
  gate: string
  terminal: string
  status: FlightStatus
}

const STATUS_STYLE: Record<FlightStatus, { bg: string; text: string; border: string }> = {
  'ON TIME':   { bg: 'bg-blue-500/15',   text: 'text-[#14C8FF]',  border: 'border-blue-400/25' },
  'BOARDING':  { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-400/25' },
  'DELAYED':   { bg: 'bg-amber-500/15',   text: 'text-amber-300',  border: 'border-amber-400/25' },
  'DEPARTED':  { bg: 'bg-white/5',        text: 'text-[#94A3B8]',  border: 'border-white/10' },
  'ARRIVED':   { bg: 'bg-white/5',        text: 'text-[#94A3B8]',  border: 'border-white/10' },
  'CANCELLED': { bg: 'bg-red-500/15',     text: 'text-red-400',    border: 'border-red-400/25' },
}

const DEPARTURES: FIDSFlight[] = [
  { code: 'AI-102',  airline: 'Air India',   to: 'Delhi (DEL)',           time: '15:55', gate: '14B', terminal: 'T1', status: 'BOARDING' },
  { code: '6E-421',  airline: 'IndiGo',      to: 'Mumbai (BOM)',          time: '16:10', gate: '22A', terminal: 'T1', status: 'ON TIME' },
  { code: 'UK-838',  airline: 'Vistara',     to: 'Bengaluru (BLR)',       time: '16:45', gate: '9C',  terminal: 'T1', status: 'ON TIME' },
  { code: 'SG-487',  airline: 'SpiceJet',    to: 'Kolkata (CCU)',         time: '17:20', gate: '5A',  terminal: 'T1', status: 'DELAYED' },
  { code: 'AI-830',  airline: 'Air India',   to: 'Singapore (SIN)',       time: '18:00', gate: '7',   terminal: 'T2', status: 'ON TIME' },
  { code: 'EK-524',  airline: 'Emirates',    to: 'Dubai (DXB)',           time: '23:30', gate: '12',  terminal: 'T2', status: 'ON TIME' },
]

const ARRIVALS: FIDSFlight[] = [
  { code: '6E-214',  airline: 'IndiGo',      from: 'Delhi (DEL)',         time: '14:40', gate: '—', terminal: 'T1', status: 'ARRIVED' },
  { code: 'AI-516',  airline: 'Air India',   from: 'Mumbai (BOM)',        time: '15:05', gate: '—', terminal: 'T1', status: 'ARRIVED' },
  { code: 'UK-811',  airline: 'Vistara',     from: 'Bengaluru (BLR)',     time: '15:30', gate: '—', terminal: 'T1', status: 'ON TIME' },
  { code: 'SG-200',  airline: 'SpiceJet',    from: 'Chennai (MAA)',       time: '15:55', gate: '—', terminal: 'T1', status: 'DELAYED' },
  { code: 'QR-526',  airline: 'Qatar Airways', from: 'Doha (DOH)',        time: '16:50', gate: '—', terminal: 'T2', status: 'ON TIME' },
]

export default function AirportFIDSBoard() {
  const [tab, setTab] = useState<'departures' | 'arrivals'>('departures')
  const flights = tab === 'departures' ? DEPARTURES : ARRIVALS

  return (
    <div className="rounded-[24px] overflow-hidden bg-[#071626] border border-white/10 shadow-2xl">
      {/* FIDS Header */}
      <div className="px-6 py-4 bg-[#09182A] border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#2F80FF]/20 flex items-center justify-center">
            <Plane className="w-4 h-4 text-[#2F80FF]" />
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]">RGIA • Hyderabad</div>
            <div className="text-sm font-black text-[#F8FAFC] leading-tight">Live Flight Information</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#0E1B2D] border border-white/8">
          <button
            onClick={() => setTab('departures')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'departures'
                ? 'bg-[#2F80FF] text-white shadow-lg shadow-blue-500/25'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            Departures
          </button>
          <button
            onClick={() => setTab('arrivals')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'arrivals'
                ? 'bg-[#2F80FF] text-white shadow-lg shadow-blue-500/25'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ArrowDownLeft className="w-3 h-3" />
            Arrivals
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div className="px-6 py-2.5 grid grid-cols-12 gap-2 text-[9px] font-extrabold uppercase tracking-widest text-[#94A3B8] border-b border-white/5 bg-[#06121F]/60">
        <span className="col-span-2">Flight</span>
        <span className="col-span-3">Airline</span>
        <span className="col-span-3">{tab === 'departures' ? 'Destination' : 'Origin'}</span>
        <span className="col-span-1 text-center">Time</span>
        <span className="col-span-1 text-center">Gate</span>
        <span className="col-span-1 text-center">Term.</span>
        <span className="col-span-1 text-right">Status</span>
      </div>

      {/* Flight Rows */}
      <div className="divide-y divide-white/5">
        {flights.map((f, i) => {
          const style = STATUS_STYLE[f.status]
          const isBoarding = f.status === 'BOARDING'
          return (
            <div
              key={i}
              className={`px-6 py-3.5 grid grid-cols-12 gap-2 items-center hover:bg-white/3 transition-colors cursor-pointer ${
                isBoarding ? 'bg-emerald-500/5' : ''
              }`}
            >
              <span className={`col-span-2 text-sm font-black font-mono tracking-wide ${isBoarding ? 'text-emerald-400' : 'text-[#F8FAFC]'}`}>
                {f.code}
              </span>
              <span className="col-span-3 text-xs font-medium text-[#94A3B8] truncate">{f.airline}</span>
              <span className="col-span-3 text-xs font-semibold text-[#F8FAFC] truncate">
                {tab === 'departures' ? f.to : f.from}
              </span>
              <span className={`col-span-1 text-center text-xs font-extrabold font-mono ${isBoarding ? 'text-emerald-400' : 'text-[#F8FAFC]'}`}>
                {f.time}
              </span>
              <span className="col-span-1 text-center text-xs font-bold text-[#14C8FF]">{f.gate}</span>
              <span className="col-span-1 text-center text-xs text-[#94A3B8]">{f.terminal}</span>
              <div className="col-span-1 flex justify-end">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide border ${style.bg} ${style.text} ${style.border} ${
                    isBoarding ? 'animate-pulse' : ''
                  }`}
                >
                  {f.status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-[#06121F]/80 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-[#94A3B8] font-medium">
          Showing {flights.length} of {flights.length} flights • Updated live
        </span>
        <button className="flex items-center gap-1 text-[10px] text-[#2F80FF] font-bold hover:text-[#14C8FF] transition-colors">
          View Full Board <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
