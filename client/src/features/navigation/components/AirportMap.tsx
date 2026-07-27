import React from 'react'

type Props = {
  onSelectGate?: (gateId: string) => void
}

export default function AirportMap({ onSelectGate }: Props){
  const gates = ['A1','A2','B1','B2','C1']
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Airport map</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Choose a gate</h3>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">Mobile ready</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {gates.map(g => (
          <button
            key={g}
            onClick={()=>onSelectGate?.(g)}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-800 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
          >
            <span className="block text-xs uppercase tracking-[0.2em] text-slate-500">Gate</span>
            <span className="mt-1 block text-base font-semibold text-slate-900">{g}</span>
          </button>
        ))}
      </div>
      <div className="mt-4 text-xs leading-5 text-slate-500">Tap a gate to preview route guidance and best walking path.</div>
    </div>
  )
}
