import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import FlightCard from '../components/FlightCard'
import HeroAction from '../../../components/HeroAction'
import QuickActions from '../components/QuickActions'
import Alerts from '../../../components/Alerts'
import EmergencySection from '../components/EmergencySection'
import FloatingAssistant from '../../../components/FloatingAssistant'
import BottomNavigation from '../components/BottomNavigation'
import { motion } from 'framer-motion'
import {
  User,
  Plane,
  Calendar,
  Armchair,
  MapPin,
  PlaneTakeoff,
  PlaneLanding,
  Hash,
  Ticket,
} from 'lucide-react'

// ── Blue summary info row ─────────────────────────────────────
function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-blue-400/20 last:border-0">
      <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0">
        <Icon size={14} className="text-white" />
      </div>
      <span className="text-blue-100 text-xs font-semibold uppercase tracking-wider w-24 shrink-0">
        {label}
      </span>
      <span className="text-white font-bold text-sm truncate">{value || '—'}</span>
    </div>
  )
}

export default function Dashboard() {
  const [boardingData, setBoardingData] = useState<any | null>(null)
  const [transit, setTransit] = useState<any | null>(null)
  const [alerts] = useState<any[]>([])

  useEffect(() => {
    // Only use sessionStorage — data is automatically forgotten when browser is closed
    const dataStr = sessionStorage.getItem('boardingData')
    if (dataStr) {
      try {
        const data = JSON.parse(dataStr)
        setBoardingData(data)
        setTransit({
          flightNumber: data.flight_id,
          gate: 'TBD',
          from: data.from,
          to: data.to,
          status: 'ON TIME',
          remainingMinutes: 120,
          stressLevel: 'green',
          recommendation: 'Relax — you have time',
          message: 'Relax — you have time. Boarding in 120 minutes.',
        })
      } catch {
        sessionStorage.removeItem('boardingData')
      }
    }
  }, [])

  // ── NOT initialised: show only the upload button ─────────────
  if (!boardingData) {
    return (
      <div className="min-h-screen bg-[#eef2f6] dark:bg-slate-900 transition-colors">
        <div className="max-w-3xl mx-auto p-4">
          <Header minimal />

          {/* Centred upload CTA */}
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
            <HeroAction />
          </div>
        </div>
      </div>
    )
  }

  // ── Initialised: full dashboard ───────────────────────────────
  return (
    <div className="min-h-screen bg-[#eef2f6] dark:bg-slate-900 pb-28 font-sans transition-colors">
      <div className="max-w-3xl mx-auto p-4">
        <Header name={boardingData.passenger_name} />

        {/* ── Blue passenger summary box ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className="mt-5 rounded-3xl overflow-hidden shadow-xl"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #3b82f6 100%)' }}
        >
          {/* Card header */}
          <div className="px-5 pt-5 pb-3 flex items-center gap-3 border-b border-blue-400/30">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <User size={24} className="text-white" />
            </div>
            <div>
              <div className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Passenger</div>
              <div className="text-white text-xl font-extrabold leading-tight">{boardingData.passenger_name}</div>
            </div>
            <div className="ml-auto">
              <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
                Verified
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="px-5 py-3">
            <InfoRow icon={Ticket}       label="Ticket ID"  value={boardingData.ticket_id} />
            <InfoRow icon={Plane}        label="Flight"     value={boardingData.flight_id} />
            <InfoRow icon={Calendar}     label="Date"       value={boardingData.date} />
            <InfoRow icon={PlaneTakeoff} label="From"       value={boardingData.from} />
            <InfoRow icon={PlaneLanding} label="To"         value={boardingData.to} />
            <InfoRow icon={MapPin}       label="Terminal"   value={boardingData.terminal} />
            <InfoRow icon={Armchair}     label="Seat"       value={boardingData.seat} />
          </div>
        </motion.div>

        {/* ── Rest of the dashboard ── */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <FlightCard flight={transit} />
            <div className="mt-4">
              <HeroAction />
            </div>
          </div>
          <div>
            <QuickActions />
            <div className="mt-6">
              <div className="text-sm text-slate-500 mb-2 font-semibold">Smart Alerts</div>
              <Alerts alerts={alerts} />
              <div className="mt-4">
                <EmergencySection />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FloatingAssistant />
      <BottomNavigation />
    </div>
  )
}
