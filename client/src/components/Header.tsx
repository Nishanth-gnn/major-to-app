import React from 'react'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export default function Header({ name, airport = 'Hyderabad Airport', terminal = 'T1' }: { name?: string; airport?: string; terminal?: string }) {
  const displayName = name || localStorage.getItem('name') || 'Traveler'
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-slate-500">{greeting()}, {displayName}</div>
        <div className="font-semibold">{airport} | Terminal {terminal}</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-full bg-white shadow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="#1E3A8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
        <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
          <img src={localStorage.getItem('avatar') || '/avatar-placeholder.png'} alt="avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  )
}
