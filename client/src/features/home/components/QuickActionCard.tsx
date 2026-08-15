import React from 'react'
import { Link } from 'react-router-dom'
import {
  Navigation,
  Luggage,
  Train,
  Utensils,
  ShieldAlert,
  Bot,
  Globe,
  Sparkles,
  MapPin,
} from 'lucide-react'

export default function QuickActionCard({ action }: { action: any }) {
  const getIcon = () => {
    switch (action.id) {
      case 'map':
      case 'nav':
        return <Navigation className="w-5 h-5 text-[#2F80FF]" />
      case 'baggage':
        return <Luggage className="w-5 h-5 text-cyan-400" />
      case 'transit':
      case 'metro':
        return <Train className="w-5 h-5 text-emerald-400" />
      case 'food':
      case 'dining':
        return <Utensils className="w-5 h-5 text-amber-400" />
      case 'emergency':
        return <ShieldAlert className="w-5 h-5 text-red-400" />
      case 'chat':
      case 'ai':
        return <Sparkles className="w-5 h-5 text-[#14C8FF]" />
      default:
        return <MapPin className="w-5 h-5 text-[#14C8FF]" />
    }
  }

  return (
    <Link
      to={action.to}
      className="p-4 rounded-2xl bg-[#162742] hover:bg-[#1f3454] border border-white/10 hover:border-cyan-400/40 flex flex-col items-center justify-center text-center shadow-lg transition-all duration-200 group"
    >
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
        {getIcon()}
      </div>
      <div className="text-xs font-bold text-[#F8FAFC] truncate w-full">{action.title}</div>
      {action.badge && (
        <div className="mt-1 text-[9px] font-extrabold text-white bg-[#EF4444] px-1.5 py-0.2 rounded-full">
          {action.badge}
        </div>
      )}
    </Link>
  )
}
