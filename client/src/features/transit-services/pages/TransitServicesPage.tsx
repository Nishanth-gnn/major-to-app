import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Loader2,
  ArrowLeft,
  Bus,
  Train,
  Sparkles,
  ChevronDown,
  ArrowRight,
  Car,
  Footprints,
  Compass,
  Zap,
  Star,
  Activity,
  ShieldCheck,
  Users,
  CloudSun,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import AirportSelector from '../components/AirportSelector'
import MetroTrackingPanel from '../components/MetroTrackingPanel'
import AirportBusPanel from '../components/AirportBusPanel'
import BusCard from '../components/BusCard'
import NotificationBanner from '../components/NotificationBanner'

import { Airport, BusInfo } from '../types'
import { AIRPORTS, PUSHPAK_BUSES, NOTIFICATION_PRESETS } from '../data/transitData'
import { requestBusTracking, getBusLocation } from '../services/telegramService'

type TrackingState = 'idle' | 'waiting' | 'active' | 'expired' | 'error'
type ActiveMode = 'metro' | 'bus' | 'cab' | 'walk' | null

export default function TransitServicesPage() {
  const navigate = useNavigate()

  const [selectedAirport, setSelectedAirport] = useState<Airport>(() => {
    const savedId = sessionStorage.getItem('selectedAirportId')
    if (savedId) {
      const found = AIRPORTS.find((a) => a.id === savedId || a.code === savedId)
      if (found) return found
    }
    return AIRPORTS[0]
  })

  const [dropdownMode, setDropdownMode] = useState<'metro' | 'bus'>('metro')
  const [activeMode, setActiveMode] = useState<ActiveMode>(null)
  const [trackingBus, setTrackingBus] = useState<BusInfo | null>(null)
  const [trackingState, setTrackingState] = useState<TrackingState>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    sessionStorage.setItem('selectedAirportId', selectedAirport.id)
  }, [selectedAirport])

  const handleCheckConnectivity = () => {
    setActiveMode(dropdownMode)
  }

  const cleanupTracking = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setTrackingBus(null)
    setTrackingState('idle')
  }

  const startPolling = (bus: BusInfo) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const locationData = await getBusLocation(bus.id)
        if (locationData?.trackingActive && locationData.latitude && locationData.longitude) {
          cleanupTracking()
          sessionStorage.setItem(
            'currentBusTracking',
            JSON.stringify({
              bus,
              location: {
                latitude: locationData.latitude,
                longitude: locationData.longitude,
                timestamp: locationData.lastUpdated
                  ? new Date(locationData.lastUpdated).getTime()
                  : Date.now(),
              },
              destination: 'Airport / City',
              isReversed: false,
              driverId: bus.id,
            })
          )
          navigate('/transit-services/track')
        }
      } catch (pollErr) {
        console.error('[TransitServicesPage] Polling error:', pollErr)
      }
    }, 3000)

    timeoutRef.current = setTimeout(() => {
      cleanupTracking()
      setTrackingState('expired')
      setErrorMessage('Driver location timeout. The driver did not respond in time.')
    }, 120000)
  }

  const handleTrackBus = async (bus: BusInfo) => {
    cleanupTracking()
    setTrackingBus(bus)
    setTrackingState('waiting')
    setErrorMessage(null)

    try {
      const res = await requestBusTracking(bus.id, bus.name)
      if (res.status === 'active' && res.latitude && res.longitude) {
        cleanupTracking()
        sessionStorage.setItem(
          'currentBusTracking',
          JSON.stringify({
            bus,
            location: {
              latitude: res.latitude,
              longitude: res.longitude,
              timestamp: Date.now(),
            },
            destination: 'Airport / City',
            isReversed: false,
            driverId: bus.id,
          })
        )
        navigate('/transit-services/track')
      } else {
        startPolling(bus)
      }
    } catch (err: any) {
      console.error('[TransitServicesPage] Track request failed:', err)
      cleanupTracking()
      setTrackingState('error')
      setErrorMessage(err.message || 'Failed to initiate tracking request.')
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* ── 2. ENHANCED AIRPORT HUB SELECTOR ── */}
      <AirportSelector
        selectedAirport={selectedAirport}
        onSelectAirport={(ap) => setSelectedAirport(ap)}
      />

      {/* ── 3. MODE OF TRANSPORT SELECTOR ── */}
      <div className="p-6 rounded-[28px] bg-[#0E1B2D] border border-white/10 shadow-2xl space-y-4">
        <label className="text-sm font-bold text-[#94A3B8] uppercase tracking-wider">Select mode of transport</label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-1/2">
            <select
              className="w-full appearance-none bg-[#13243B] border border-white/10 rounded-2xl py-4 pl-4 pr-10 text-[#F8FAFC] font-bold focus:outline-none focus:border-[#14C8FF] transition-colors"
              value={dropdownMode}
              onChange={(e) => setDropdownMode(e.target.value as 'metro' | 'bus')}
            >
              <option value="metro">🚆 Metro</option>
              <option value="bus">🚌 Bus</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
          </div>
          <button
            onClick={handleCheckConnectivity}
            className="w-full sm:w-1/2 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-black hover:scale-[1.02] transition-transform shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            Check Connectivity
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── 4. EXPANDABLE MODE DETAIL PANELS ── */}
      <AnimatePresence mode="wait">
        {activeMode === 'metro' && (
          <motion.div
            key="metro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-[28px] bg-[#0E1B2D] border border-white/10 shadow-2xl space-y-6"
          >
            <MetroTrackingPanel selectedAirport={selectedAirport} />
          </motion.div>
        )}

        {activeMode === 'bus' && (
          <motion.div
            key="bus"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-[28px] bg-[#0E1B2D] border border-white/10 shadow-2xl space-y-6"
          >
            <AirportBusPanel selectedAirport={selectedAirport} />
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  )
}
