import React, { useState } from 'react'
import { Bell, Plane, Luggage, Train, AlertTriangle, CheckCircle2, Info, X, ChevronRight } from 'lucide-react'

interface AlertItem {
  id: string
  type: 'Flight' | 'Baggage' | 'Transit' | 'Security' | 'System'
  priority: 'high' | 'medium' | 'low'
  title: string
  message: string
  time: string
  read?: boolean
  actionPath?: string
  actionLabel?: string
}

const LIVE_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    type: 'Flight',
    priority: 'high',
    title: 'Boarding Now • Gate 14B',
    message: 'AI-102 to Delhi is boarding. Proceed to Gate 14B immediately. Boarding closes in 18 mins.',
    time: '2 min ago',
    read: false,
    actionPath: '/flight-tracking',
    actionLabel: 'Flight Details',
  },
  {
    id: 'a2',
    type: 'Baggage',
    priority: 'medium',
    title: 'Bag Loaded on Aircraft',
    message: 'Tag #BAG-8821 verified and loaded in Hold 3. Tracking confirmed.',
    time: '14 min ago',
    read: false,
    actionPath: '/baggage-guidance',
    actionLabel: 'Track Bag',
  },
  {
    id: 'a3',
    type: 'Transit',
    priority: 'low',
    title: 'Metro Express • Next in 3 min',
    message: 'Airport Metro Platform 1 — Hyderabad Express arriving. 11 seats available.',
    time: '1 min ago',
    read: false,
    actionPath: '/transit-services',
    actionLabel: 'View Schedule',
  },
  {
    id: 'a4',
    type: 'Security',
    priority: 'medium',
    title: 'Enhanced Security at T1',
    message: 'Random secondary screening in effect at Terminal 1 Gate D. Allow 20 min extra.',
    time: '28 min ago',
    read: true,
  },
  {
    id: 'a5',
    type: 'System',
    priority: 'low',
    title: 'Wi-Fi: AirNet Connected',
    message: 'RGIA high-speed network active. Encrypted session maintained.',
    time: '45 min ago',
    read: true,
  },
]

const TYPE_CONFIG = {
  Flight:   { icon: Plane,         color: 'text-[#2F80FF]', bg: 'bg-blue-500/15',   border: 'border-blue-400/25' },
  Baggage:  { icon: Luggage,       color: 'text-teal-400',  bg: 'bg-teal-500/15',   border: 'border-teal-400/25' },
  Transit:  { icon: Train,         color: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-400/25' },
  Security: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/15',  border: 'border-amber-400/25' },
  System:   { icon: Info,          color: 'text-[#94A3B8]', bg: 'bg-white/5',       border: 'border-white/8' },
}

const PRIORITY_DOT = {
  high:   'bg-red-400 animate-pulse',
  medium: 'bg-amber-400',
  low:    'bg-[#94A3B8]',
}

export default function Alerts({ alerts }: { alerts?: AlertItem[] }) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const items = alerts?.length ? alerts : LIVE_ALERTS
  const visible = items.filter((a) => !dismissed.has(a.id))
  const unread = visible.filter((a) => !a.read).length

  return (
    <div className="rounded-[24px] overflow-hidden bg-[#071626] border border-white/10 shadow-xl flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 bg-[#09182A] border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Bell className="w-5 h-5 text-[#2F80FF]" />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                {unread}
              </span>
            )}
          </div>
          <div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#94A3B8]">Operations</div>
            <div className="text-sm font-black text-[#F8FAFC] leading-tight">Live Alerts</div>
          </div>
        </div>
        <span className="text-[10px] text-[#14C8FF] font-bold px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20">
          {unread} Unread
        </span>
      </div>

      {/* Alert List */}
      <div className="flex-1 divide-y divide-white/5 overflow-y-auto max-h-[420px]">
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-[#22C55E] opacity-60" />
            <span className="text-sm text-[#94A3B8]">All clear — no active alerts</span>
          </div>
        ) : (
          visible.map((alert) => {
            const cfg = TYPE_CONFIG[alert.type]
            const Icon = cfg.icon
            return (
              <div
                key={alert.id}
                className={`px-5 py-4 hover:bg-white/3 transition-colors group ${!alert.read ? 'bg-white/2' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`mt-0.5 w-9 h-9 rounded-xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${PRIORITY_DOT[alert.priority]}`} />
                      <span className="text-[13px] font-extrabold text-[#F8FAFC] truncate">{alert.title}</span>
                      {!alert.read && (
                        <span className="text-[9px] font-bold text-[#14C8FF] px-1.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/20 shrink-0">NEW</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#94A3B8] leading-relaxed">{alert.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-[#94A3B8]/60">{alert.time}</span>
                      {alert.actionLabel && (
                        <button className="flex items-center gap-1 text-[10px] font-bold text-[#2F80FF] hover:text-[#14C8FF] transition-colors">
                          {alert.actionLabel}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Dismiss */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setDismissed((prev) => new Set([...prev, alert.id]))
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center shrink-0 mt-0.5"
                  >
                    <X className="w-3 h-3 text-[#94A3B8]" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 bg-[#06121F]/80 border-t border-white/5 flex items-center justify-between">
        <span className="text-[10px] text-[#94A3B8]">{visible.length} alerts • Updated live</span>
        <button className="text-[10px] font-bold text-[#2F80FF] hover:text-[#14C8FF] transition-colors">
          View All Alerts →
        </button>
      </div>
    </div>
  )
}
