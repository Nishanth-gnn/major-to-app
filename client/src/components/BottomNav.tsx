import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNav(){
  const loc = useLocation()
  const items = [
    { to: '/', label: 'Home' },
    { to: '/navigate', label: 'Navigate' },
    { to: '/chat', label: 'Assistant' },
    { to: '/flight-tracking', label: 'Flights' },
    { to: '/profile', label: 'Profile' }
  ]
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around">
      {items.map(i=> (
        <Link key={i.to} to={i.to} className={`text-sm ${loc.pathname===i.to? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>{i.label}</Link>
      ))}
    </div>
  )
}
