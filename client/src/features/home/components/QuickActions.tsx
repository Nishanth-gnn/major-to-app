import React from 'react'
import QuickActionCard from './QuickActionCard'
import { quickActions } from '../../../data/homeMockData'

export default function QuickActions(){
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-500 font-semibold">QUICK ACTIONS</div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <button className="text-slate-400">Customize</button>
          <button className="p-1 rounded"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" stroke="#64748B" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {quickActions.map(a=> <QuickActionCard key={a.id} action={a} />)}
      </div>
    </div>
  )
}
