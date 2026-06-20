import React from 'react'
import { user } from '../../../data/homeMockData'

export default function Header({ name = user.name, airport = user.airport, terminal = user.terminal }: { name?: string; airport?: string; terminal?: string }){
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-start gap-3">
        <button className="p-2 bg-white rounded-lg shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18M3 6h18M3 18h18" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div>
          <div className="text-sm text-slate-500">Good Morning, 👋</div>
          <div className="font-semibold text-lg text-slate-900">{name}</div>
          <div className="text-sm text-slate-500">{airport} | Terminal {terminal}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full bg-white shadow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">3</span>
        </button>
        <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
          <img src={localStorage.getItem('avatar') || user.avatar} alt="avatar" className="w-full h-full object-cover" />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white" />
        </div>
      </div>
    </div>
  )
}
