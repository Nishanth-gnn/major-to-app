import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function HeroAction({ title, subtitle, eta }: { title: string; subtitle?: string; eta?: string }){
  const nav = useNavigate()
  return (
    <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 flex flex-col">
      <div className="text-xs text-slate-400">WHAT SHOULD I DO NEXT?</div>
      <div className="mt-2 flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">{title}</div>
          <div className="text-sm text-slate-500 mt-1">{subtitle}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-400">ETA</div>
          <div className="text-lg font-semibold">{eta || '--:--'}</div>
        </div>
      </div>
      <div className="mt-4">
        <button onClick={()=>nav('/navigate')} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow">Start Navigation</button>
      </div>
    </div>
  )
}
