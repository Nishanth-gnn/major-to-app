import React from 'react'
import { flight as mock } from '../../../data/homeMockData'

export default function FlightCard({ flight = mock }: { flight?: any }){
  const f = flight ?? mock
  const airline = f?.airline || 'Unknown Airline'
  const flightNumber = f?.flightNumber || '---'
  const from = f?.from || '---'
  const to = f?.to || '---'
  const fromCity = f?.fromCity || ''
  const toCity = f?.toCity || ''
  const gate = f?.gate || 'TBD'
  const boardingIn = f?.boardingIn ?? f?.remainingMinutes ? `${f.remainingMinutes}m` : '--'
  const status = f?.status || 'N/A'

  return (
    <div className="relative overflow-hidden rounded-[20px] p-4 shadow-lg" style={{ background: 'linear-gradient(90deg,#0B5ED7 0%,#003C9E 100%)' }}>
      <div className="flex items-start justify-between text-white">
        <div>
          <div className="text-xs opacity-80">{airline}</div>
          <div className="text-3xl font-extrabold tracking-tight mt-1">{flightNumber}</div>
          <div className="mt-3 text-sm opacity-90">{from} → {to}</div>
          <div className="mt-2 text-sm opacity-90">{fromCity}{fromCity && toCity ? ' • ' : ''}{toCity}</div>
        </div>
        <div className="text-right">
          <div className="text-sm opacity-90">Gate</div>
          <div className="text-2xl font-semibold">{gate}</div>
          <div className="mt-3 text-sm opacity-90">Boarding in</div>
          <div className="text-xl font-semibold">{boardingIn}</div>
          <div className="mt-3 inline-block px-3 py-1 rounded-full bg-white/20 text-white text-sm font-medium">{status}</div>
        </div>
      </div>

      <div className="absolute right-4 bottom-0 opacity-30 pointer-events-none" style={{ transform: 'translateY(18px)' }}>
        <svg width="160" height="80" viewBox="0 0 160 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 40h120l20 10v-20L120 40H0z" fill="#fff" />
        </svg>
      </div>
    </div>
  )
}
