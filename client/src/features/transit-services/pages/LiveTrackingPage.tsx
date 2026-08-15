import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Play, Square, Navigation, Activity, ShieldCheck, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

import LiveTrackingMap from '../components/LiveTrackingMap'
import TelemetryPanel from '../components/TelemetryPanel'
import CountdownCard from '../components/CountdownCard'
import RouteTimeline from '../components/RouteTimeline'

import { TelemetryData } from '../types'
import { getBusLocation } from '../services/telegramService'

export default function LiveTrackingPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'bus'

  const [isTrackingActive, setIsTrackingActive] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toLocaleTimeString())

  const [trackingSession, setTrackingSession] = useState<any>(() => {
    const key = mode === 'metro' ? 'currentMetroTracking' : 'currentBusTracking'
    const stored = sessionStorage.getItem(key)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        return null
      }
    }
    return null
  })

  const [telemetry, setTelemetry] = useState<TelemetryData>(() => {
    const key = mode === 'metro' ? 'currentMetroTracking' : 'currentBusTracking'
    const stored = sessionStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (mode === 'metro' && parsed.metro) {
          const m = parsed.metro
          const coords = m.coordinates && m.coordinates.length > 0
            ? m.coordinates
            : [[17.2403, 78.4294], [17.4401, 78.3489]]
          const midCoord = coords[1] || coords[0]
          return {
            speed: m.speedKmh || 95,
            heading: 'Express Line (Track Direct)',
            currentStation: m.route && m.route.length > 0 ? m.route[0] : (m.fromStation || 'Airport Terminal Station'),
            nextStation: m.route && m.route.length > 1 ? m.route[1] : (m.toStation || 'City Centre Station'),
            destinationStation: m.toStation || parsed.destination || 'City Centre',
            distanceRemainingKm: 14.8,
            progressPercent: 30,
            latitude: midCoord[0],
            longitude: midCoord[1],
            lastUpdated: new Date().toLocaleTimeString(),
            fare: m.fare || '₹60',
            status: m.status || 'On Time',
          }
        } else if (mode === 'bus' && parsed.location) {
          return {
            speed: 45,
            heading: 'Bus Route Transit',
            currentStation: `Driver ${parsed.bus?.name || 'Pushpak Coach'}`,
            nextStation: parsed.destination || 'City Terminal',
            destinationStation: parsed.destination || 'City Terminal',
            distanceRemainingKm: 18.2,
            progressPercent: 28,
            latitude: parsed.location.latitude,
            longitude: parsed.location.longitude,
            lastUpdated: new Date().toLocaleTimeString(),
            fare: '₹250',
            status: 'On Time',
          }
        }
      } catch (e) {
        console.warn('Failed to parse initial tracking session for telemetry', e)
      }
    }

    return {
      speed: mode === 'metro' ? 98 : 45,
      heading: 'North-East',
      currentStation: 'Airport Station',
      nextStation: 'Transit Junction',
      destinationStation: 'City Centre Station',
      distanceRemainingKm: mode === 'metro' ? 14.8 : 18.2,
      progressPercent: 28,
      latitude: 17.2403,
      longitude: 78.4294,
      lastUpdated: new Date().toLocaleTimeString(),
      fare: mode === 'metro' ? '₹60' : '₹250',
      status: 'On Time',
    }
  })

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (mode === 'bus') {
      const storedBus = sessionStorage.getItem('currentBusTracking')
      if (storedBus) {
        try {
          const parsed = JSON.parse(storedBus)
          setTrackingSession(parsed)
          if (parsed.location?.latitude && parsed.location?.longitude) {
            setTelemetry((prev) => ({
              ...prev,
              latitude: parsed.location.latitude,
              longitude: parsed.location.longitude,
              currentStation: `Driver ${parsed.bus?.name || 'Coach Shuttle'}`,
            }))
          }
        } catch (e) {
          console.warn('Failed to parse bus tracking session', e)
        }
      }
    } else {
      const storedMetro = sessionStorage.getItem('currentMetroTracking')
      if (storedMetro) {
        try {
          const parsed = JSON.parse(storedMetro)
          setTrackingSession(parsed)
          const m = parsed.metro
          if (m) {
            const coords = m.coordinates && m.coordinates.length > 0
              ? m.coordinates
              : [[17.2403, 78.4294], [17.4401, 78.3489]]
            const midCoord = coords[1] || coords[0]

            setTelemetry((prev) => ({
              ...prev,
              latitude: midCoord[0],
              longitude: midCoord[1],
              currentStation: m.route && m.route.length > 0 ? m.route[0] : (m.fromStation || 'Airport Station'),
              nextStation: m.route && m.route.length > 1 ? m.route[1] : (m.toStation || 'City Station'),
              destinationStation: m.toStation || parsed.destination || 'City Centre Station',
              fare: m.fare || prev.fare,
              status: m.status || 'On Time',
              speed: m.speedKmh || 95,
              progressPercent: 35,
              distanceRemainingKm: 12.4,
            }))
          }
        } catch (e) {
          console.warn('Failed to parse metro tracking session', e)
        }
      }
    }
  }, [mode])

  useEffect(() => {
    if (!isTrackingActive) return

    if (mode === 'bus' && trackingSession?.driverId) {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const res = await getBusLocation(trackingSession.driverId)
          if (res.latitude && res.longitude) {
            setTelemetry((prev) => ({
              ...prev,
              latitude: res.latitude!,
              longitude: res.longitude!,
              lastUpdated: new Date().toLocaleTimeString(),
            }))
            setLastUpdated(new Date().toLocaleTimeString())
          }
        } catch (e) {
          console.error('[LiveTrackingPage] Polling location error:', e)
        }
      }, 4000)
    } else if (mode === 'metro' && trackingSession?.metro?.coordinates) {
      const coords = trackingSession.metro.coordinates as [number, number][]
      let stepIndex = 0

      pollIntervalRef.current = setInterval(() => {
        stepIndex = (stepIndex + 1) % coords.length
        const currentPt = coords[stepIndex]
        const route = trackingSession.metro.route || []

        setTelemetry((prev) => ({
          ...prev,
          latitude: currentPt[0],
          longitude: currentPt[1],
          currentStation: route[stepIndex] || prev.currentStation,
          nextStation: route[(stepIndex + 1) % route.length] || prev.nextStation,
          progressPercent: Math.round(((stepIndex + 1) / coords.length) * 100),
          lastUpdated: new Date().toLocaleTimeString(),
        }))
        setLastUpdated(new Date().toLocaleTimeString())
      }, 3500)
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [mode, trackingSession, isTrackingActive])

  const toggleTracking = () => {
    setIsTrackingActive(!isTrackingActive)
  }

  const title = mode === 'metro'
    ? trackingSession?.metro?.lineName || 'Airport Express Metro'
    : trackingSession?.bus?.name || 'Pushpak Coach'

  const stations = mode === 'metro'
    ? trackingSession?.metro?.route || [
        trackingSession?.metro?.fromStation || 'Airport Station',
        'Airport Express Transit Hub',
        'City Interchange',
        trackingSession?.destination || trackingSession?.metro?.toStation || 'City Centre'
      ]
    : [
        'Airport Terminal Shuttle Bay',
        'Express Corridor Hub',
        'City Center Junction',
        trackingSession?.destination || 'City Destination'
      ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/transit-services')}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#14C8FF]">
              Live GPS Telemetry Tracking
            </span>
            <h1 className="text-xl font-black text-[#F8FAFC]">{title}</h1>
          </div>
        </div>

        <button
          onClick={toggleTracking}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            isTrackingActive
              ? 'bg-red-500/20 text-red-300 border-red-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
          }`}
        >
          {isTrackingActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isTrackingActive ? 'Stop Tracking' : 'Start Tracking'}</span>
        </button>
      </div>

      {/* Countdown Card */}
      <CountdownCard initialMinutes={4} lineName={title} />

      {/* Live Map Box */}
      <div className="h-[400px] rounded-[28px] overflow-hidden border border-white/10 shadow-2xl relative">
        <LiveTrackingMap
          lat={telemetry.latitude}
          lng={telemetry.longitude}
          vehicleName={title}
          vehicleType={mode === 'metro' ? 'metro' : 'bus'}
          routePoints={mode === 'metro' ? trackingSession?.metro?.coordinates : undefined}
        />
      </div>

      {/* Telemetry Panel */}
      <TelemetryPanel
        telemetry={telemetry}
        onRefresh={() => setLastUpdated(new Date().toLocaleTimeString())}
      />

      {/* Route Timeline */}
      <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl">
        <RouteTimeline stations={stations} currentStationIndex={1} />
      </div>
    </div>
  )
}
