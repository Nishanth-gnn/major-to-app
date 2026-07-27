import React from 'react'

type Props = {
  layoverMinutes: number
}

export default function LayoverRecommendations({ layoverMinutes }: Props){
  const recommendations = layoverMinutes < 60
    ? ['Proceed directly to gate', 'Ask for priority assistance if needed']
    : ['Visit lounge or restaurants', 'Short walk to observation deck', 'Nearby transit options']

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Layover recommendations</p>
      <div className="mt-2 text-sm font-medium text-slate-900">Layover: {layoverMinutes} minutes</div>
      <ul className="mt-4 space-y-3 text-sm text-slate-700">
        {recommendations.map((r,i)=> <li key={i}>{r}</li>)}
      </ul>
    </div>
  )
}
