import React from 'react'
import { Link } from 'react-router-dom'

const actions = [
  { id: 'navigate', title: 'Navigation', to: '/navigation' },
  { id: 'staff', title: 'Customer Support', to: '/chat' },
  { id: 'translate', title: 'Translate', to: '/translate' },
  { id: 'checkin', title: 'Baggage Guidance', to: '/baggage-guidance' },
  { id: 'transit', title: 'Flight Tracking', to: '/flight-tracking' },
  { id: 'safety', title: 'Women Safety', to: '/safety' }
]

export default function QuickActions(){
  return (
    <div className="grid grid-cols-3 gap-3">
      {actions.map(a=> (
        <Link key={a.id} to={a.to} className="bg-white rounded-lg p-3 flex flex-col items-center justify-center shadow">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-2">{a.title.charAt(0)}</div>
          <div className="text-sm font-medium">{a.title}</div>
        </Link>
      ))}
    </div>
  )
}
