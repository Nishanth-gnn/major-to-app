import React from 'react'

export default function FlightCard({ flight }: { flight?: any }) {
  if (!flight) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-lg">
        <div className="text-sm text-slate-400">No active flight</div>
        <div className="text-xl font-semibold mt-2">Track your flight in Flight Tracking</div>
      </div>
    )
  }

  const dep = flight.flightNumber || '—'
  const gate = flight.gate || 'TBD'
  const status = flight.status || 'ON TIME'
  const departure = flight.departureTime ? new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'

  return (
    <div className="bg-gradient-to-r from-white via-slate-50 to-white rounded-2xl p-4 shadow-xl border border-slate-100">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">AIRLINE</div>
          <div className="text-2xl font-extrabold tracking-tight">{dep}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Gate</div>
          <div className="text-lg font-semibold">{gate}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <div className="text-sm text-slate-500">Route</div>
          <div className="font-medium">{flight.from || 'HYD'} → {flight.to || 'DEL'}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">Boarding</div>
          <div className="font-medium">{departure}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className={`px-2 py-1 rounded ${status === 'ON TIME' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>Status: {status}</div>
        <div className="text-sm text-slate-400">Estimated walk 8m • Queue 12m</div>
      </div>
    </div>
  )
}
