import React from 'react'
import EmergencyCard from './EmergencyCard'
import { emergencyActions } from '../../../data/homeMockData'

export default function EmergencySection(){
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-slate-500 font-semibold">EMERGENCY & HELP</div>
        <div className="text-sm text-slate-500">&nbsp;</div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {emergencyActions.map(e=> <EmergencyCard key={e.id} item={e} />)}
      </div>
    </div>
  )
}
