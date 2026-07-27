import React, { useEffect, useState } from 'react'

type Props = {
  targetIso: string
}

function formatRemaining(ms: number){
  if(ms <= 0) return '00:00:00'
  const s = Math.floor(ms/1000)
  const hh = String(Math.floor(s/3600)).padStart(2,'0')
  const mm = String(Math.floor((s%3600)/60)).padStart(2,'0')
  const ss = String(s%60).padStart(2,'0')
  return `${hh}:${mm}:${ss}`
}

export default function TransitCountdown({ targetIso }: Props){
  const [now, setNow] = useState(()=>Date.now())
  useEffect(()=>{
    const id = setInterval(()=>setNow(Date.now()), 1000)
    return ()=>clearInterval(id)
  },[])

  const remaining = new Date(targetIso).getTime() - now

  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Transit countdown</p>
      <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">{formatRemaining(remaining)}</div>
      <div className="mt-1 text-sm text-slate-500">Time left before your planned airport arrival.</div>
    </div>
  )
}
