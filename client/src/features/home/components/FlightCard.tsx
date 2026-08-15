import React from 'react'
import { Plane, Clock, MapPin, User, Ticket } from 'lucide-react'

export default function FlightCard({ flight }: { flight?: any }) {
  const f = flight || {}
  const airline = f?.airline || (f?.flight_id?.startsWith('AI') ? 'Air India' : f?.flight_id?.startsWith('6E') ? 'IndiGo' : 'Smart Air')
  const flightNumber = f?.flight_id || f?.flightNumber || 'AI-102'
  const from = f?.from || 'HYD'
  const to = f?.to || 'DEL'
  const fromCity = from === 'HYD' ? 'Hyderabad (RGIA)' : from === 'LHR' ? 'London Heathrow' : from
  const toCity = to === 'DEL' ? 'Delhi (IGIA)' : to === 'JFK' ? 'New York (JFK)' : to
  const gate = f?.gate || 'Gate 14B'
  const seat = f?.seat || '18A'
  const passengerName = f?.passenger_name || 'Passenger'
  const status = f?.status || 'ON TIME'

  return (
    <div className="relative overflow-hidden rounded-[24px] p-6 bg-gradient-to-r from-[#0F1E35] via-[#162742] to-[#142B4D] border border-white/10 shadow-xl space-y-4">
      {/* Background graphic */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-4 translate-y-4">
        <Plane className="w-48 h-48 text-[#14C8FF]" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]">{airline}</span>
          <div className="text-3xl font-black text-[#F8FAFC] tracking-tight mt-0.5">{flightNumber}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {status}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-b border-white/10 py-4 relative z-10">
        <div>
          <div className="text-2xl font-extrabold text-[#F8FAFC]">{from}</div>
          <div className="text-xs text-[#94A3B8]">{fromCity}</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-bold text-[#14C8FF] uppercase tracking-wider">Active Flight</span>
          <div className="flex items-center gap-2 text-[#2F80FF]">
            <div className="w-2 h-2 rounded-full bg-[#2F80FF]" />
            <div className="w-16 sm:w-24 h-0.5 bg-gradient-to-r from-[#2F80FF] to-[#14C8FF]" />
            <Plane className="w-4 h-4 text-[#14C8FF]" />
          </div>
          <span className="text-[10px] text-[#94A3B8]">Passenger: {passengerName}</span>
        </div>

        <div className="text-right">
          <div className="text-2xl font-extrabold text-[#F8FAFC]">{to}</div>
          <div className="text-xs text-[#94A3B8]">{toCity}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1 relative z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#14C8FF]" />
          <div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Departure Gate</div>
            <div className="text-sm font-extrabold text-[#F8FAFC]">{gate}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 justify-end text-right">
          <Ticket className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-[#94A3B8] uppercase font-bold">Assigned Seat</div>
            <div className="text-sm font-extrabold text-emerald-400">{seat}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
