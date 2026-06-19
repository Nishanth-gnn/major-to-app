import React from 'react'

function Stress({ level }: { level: string }){
  const map:any = { green: ['Relaxed','bg-green-50','text-green-700'], yellow: ['Moderate','bg-yellow-50','text-yellow-700'], red: ['High Risk','bg-red-50','text-red-700'] }
  const v = map[level] || map.red
  return (
    <div className="bg-white p-3 rounded-lg shadow">
      <div className="text-sm text-slate-500">Stress Meter</div>
      <div className={`mt-2 px-2 py-1 rounded ${v[1]} ${v[2]}`}>{v[0]}</div>
    </div>
  )
}

export default function StatusWidgets({ stress='green', queue='12m', crowd='Low' }: { stress?: string; queue?: string; crowd?: string }){
  return (
    <div className="grid grid-cols-3 gap-3">
      <Stress level={stress} />
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="text-sm text-slate-500">Security Queue</div>
        <div className="mt-2 font-semibold">{queue}</div>
      </div>
      <div className="bg-white p-3 rounded-lg shadow">
        <div className="text-sm text-slate-500">Terminal Crowd</div>
        <div className="mt-2 font-semibold">{crowd}</div>
      </div>
    </div>
  )
}
