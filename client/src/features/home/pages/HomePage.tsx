import React, { useState, useEffect } from 'react'
import { BoardingData } from '../../../shared/components/JourneyHeroCard'
import QuickActions from '../components/QuickActions'
import FlightCard from '../components/FlightCard'
import EmergencySection from '../components/EmergencySection'
import HeroAction from '../../../components/HeroAction'
import EmergencyDrawer from '../../emergency-contact/components/EmergencyDrawer'
import { QrCode } from 'lucide-react'

const DEFAULT_BOARDING_DATA: BoardingData = {
  passenger_name: 'Sai Venkat',
  flight_id: 'AI-102',
  ticket_id: 'TKT-892147',
  date: '2026-08-12',
  from: 'HYD',
  to: 'DEL',
  terminal: 'Terminal 1',
  seat: '18A',
  gate: 'Gate 14B',
  zone: 'Zone A',
}

export default function HomePage() {
  const [boardingData, setBoardingData] = useState<BoardingData>(DEFAULT_BOARDING_DATA)
  const [showEmergencyDrawer, setShowEmergencyDrawer] = useState(false)

  useEffect(() => {
    const dataStr = sessionStorage.getItem('boardingData')
    if (dataStr) {
      try {
        const parsed = JSON.parse(dataStr)
        setBoardingData({
          ...DEFAULT_BOARDING_DATA,
          ...parsed,
        })
      } catch (err) {
        console.error('Failed to parse boarding data from session:', err)
      }
    }
  }, [])

  const handleRescan = () => {
    window.dispatchEvent(new Event('ticket-rescan-event'))
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── 1. PASSENGER & ACTIVE FLIGHT DETAILS CARD (MOVED TO TOP) ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black text-[#14C8FF] uppercase tracking-wider">
            Active Passenger Boarding Pass
          </div>
          <button
            onClick={handleRescan}
            className="px-3.5 py-1.5 rounded-full bg-blue-500/20 text-[#14C8FF] border border-blue-400/30 text-xs font-bold hover:bg-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <QrCode size={14} />
            <span>Scan Different Ticket</span>
          </button>
        </div>
        <FlightCard flight={boardingData} />
      </section>

      {/* ── 2. LIVE TICKET & QR CODE SCANNER ACTION ── */}
      <section className="bg-radial-card p-6 rounded-[28px] border border-white/10 shadow-xl">
        <HeroAction />
      </section>

      {/* ── 3. PASSENGER SERVICES GRID ── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#F8FAFC]">Passenger Services Operating Grid</h2>
            <p className="text-xs text-[#94A3B8]">Enterprise airport services & live terminal guidance</p>
          </div>
          <button
            onClick={() => setShowEmergencyDrawer(true)}
            className="px-3.5 py-1.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold hover:bg-red-500/30 transition-all flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span>Emergency Dispatch</span>
          </button>
        </div>

        <QuickActions />
      </section>

      {/* ── 4. EMERGENCY DIRECTORY SECTION ── */}
      <section className="pt-4 border-t border-white/10">
        <EmergencySection />
      </section>

      {/* ── DEDICATED RIGHT-SIDE EMERGENCY DRAWER ── */}
      <EmergencyDrawer open={showEmergencyDrawer} onClose={() => setShowEmergencyDrawer(false)} />
    </div>
  )
}
