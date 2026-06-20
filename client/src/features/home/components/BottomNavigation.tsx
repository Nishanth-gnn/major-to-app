import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNavigation(){
  const loc = useLocation()
  const items = [
    { to: '/', label: 'Home' },
    { to: '/navigate', label: 'Navigate' },
    { to: '/chat', label: 'AI Assistant' },
    { to: '/transit', label: 'Flights' },
    { to: '/profile', label: 'Profile' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 safe-bottom" style={{paddingBottom: 'env(safe-area-inset-bottom)'}}>
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        {items.map((i, idx)=> (
          <Link key={i.to} to={i.to} className={`flex-1 text-center ${loc.pathname===i.to ? 'text-blue-600 font-semibold' : 'text-slate-600'}`}>
            {idx===2 ? (
              <div className="relative -mt-6">
                <div className="mx-auto w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl">Aura</div>
                <div className="text-xs mt-1">{i.label}</div>
              </div>
            ) : (
              <div>
                <div className="text-sm">{i.label}</div>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
