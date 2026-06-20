import React from 'react'

export default function EmergencyCard({ item }: { item: any }){
  const danger = item.variant === 'danger'
  return (
    <div className={`p-3 rounded-xl shadow-sm ${danger ? 'bg-red-50 text-red-700' : 'bg-white text-slate-900'}`}>
      <div className="font-medium">{item.title}</div>
    </div>
  )
}
