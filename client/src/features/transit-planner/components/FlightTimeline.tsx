import React from 'react'

type Item = { time: string, label: string }

type Props = {
  items?: Item[]
}

export default function FlightTimeline({ items = [] }: Props){
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Flight timeline</p>
      <ul className="mt-4 space-y-3 text-sm">
        {items.map((it,idx)=> (
          <li key={idx} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <span className="font-medium text-slate-800">{it.label}</span>
            <span className="text-slate-500">{it.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
