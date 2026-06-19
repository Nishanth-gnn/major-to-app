import React from 'react'

export default function Alerts({ alerts }: { alerts?: any[] }){
  const items = alerts && alerts.length ? alerts : [{ type: 'Gate Change', message: 'Gate changed to B12', time: '2m ago' }]
  return (
    <div className="space-y-2">
      {items.map((a,i)=> (
        <div key={i} className="bg-white p-3 rounded shadow">
          <div className="font-semibold">{a.type}</div>
          <div className="text-sm text-slate-500">{a.message}</div>
        </div>
      ))}
    </div>
  )
}
