import React from 'react'

type Props = {
  from?: string
  to?: string
  etaMinutes?: number
}

export default function RouteGuidance({ from, to, etaMinutes = 8 }: Props){
  const steps = [
    `Exit ${from ?? 'check-in'}`,
    'Follow signs to security',
    `Proceed to ${to ?? 'gate'}`,
    'Boarding area'
  ]

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Route guidance</p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">Walk to gate</h3>
        </div>
        <div className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">ETA ~ {etaMinutes} min</div>
      </div>

      <ol className="mt-4 space-y-3 text-sm">
        {steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
    </div>
  )
}
