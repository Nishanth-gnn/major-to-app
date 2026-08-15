import React, { useEffect, useRef, useState } from 'react'
import { Wifi, AlertTriangle, CheckCircle2, Clock, Plane } from 'lucide-react'

const TICKER_ITEMS = [
  { type: 'on_time', text: 'AI-102 HYD→DEL — On Time • Boarding Gate 14B at 15:45' },
  { type: 'alert',   text: 'Gate Change: 6E-421 BOM→BLR — Now departing from Gate 22A' },
  { type: 'on_time', text: 'IndiGo 6E-214 DEL→HYD — Arrived on time • Belt 4' },
  { type: 'on_time', text: 'Air India AI-830 HYD→SIN — Boarding in 28 mins • Gate 7' },
  { type: 'alert',   text: 'Delay: SG-487 HYD→BOM — 35 min delay due to ATC hold' },
  { type: 'info',    text: 'Terminal 1 Immigration Lane 4 — Now operational' },
  { type: 'on_time', text: 'Vistara UK-838 HYD→DEL — Check-in closes in 45 mins' },
  { type: 'info',    text: 'RGIA Wi-Fi — High-speed AirNet available on all terminals' },
]

const typeConfig = {
  on_time: { color: 'text-[#22C55E]', icon: CheckCircle2 },
  alert:   { color: 'text-amber-400',  icon: AlertTriangle },
  info:    { color: 'text-[#14C8FF]',  icon: Wifi },
}

export default function LiveStatusTicker() {
  const [time, setTime] = useState(() => {
    const now = new Date()
    return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  })

  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Duplicate items so seamless loop works
  const allItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      className="w-full bg-[#040F1C] border-b border-white/5 overflow-hidden"
      style={{ height: '32px' }}
      aria-label="Live airport status ticker"
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center gap-4">
        {/* Left Badge */}
        <div className="flex items-center gap-1.5 shrink-0 pr-3 border-r border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <Plane className="w-3 h-3 text-[#2F80FF]" />
          <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#14C8FF]">LIVE OPS</span>
        </div>

        {/* Scrolling Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={trackRef}
            className="flex items-center gap-0 whitespace-nowrap"
            style={{
              animation: 'ticker-scroll 60s linear infinite',
            }}
          >
            {allItems.map((item, idx) => {
              const cfg = typeConfig[item.type as keyof typeof typeConfig]
              const Icon = cfg.icon
              return (
                <span key={idx} className="inline-flex items-center gap-1.5 mr-10">
                  <Icon className={`w-2.5 h-2.5 shrink-0 ${cfg.color}`} />
                  <span className={`text-[11px] font-medium ${cfg.color}`}>{item.text}</span>
                  <span className="mx-4 text-white/10">|</span>
                </span>
              )
            })}
          </div>
        </div>

        {/* Right: Live clock */}
        <div className="shrink-0 pl-3 border-l border-white/10 flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#94A3B8]" />
          <span className="text-[10px] font-mono font-bold text-[#94A3B8]">{time}</span>
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
