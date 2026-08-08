import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Navigation, Loader2, ArrowLeft, Bus, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BusCard from '../components/BusCard';
import { BusInfo } from '../types';
import { requestBusTracking, getBusLocation } from '../services/telegramService';

const AIRPORT = 'Rajiv Gandhi International Airport';
const DESTINATIONS = [
  'Miyapur',
  'Ameerpet',
  'Secunderabad',
  'JBS',
  'Koti',
  'LB Nagar',
  'Uppal',
  'Gachibowli',
  'Hitech City',
  'Kondapur'
];

const SAMPLE_BUSES: BusInfo[] = [
  { id: '1', name: 'Pushpak AJ', departure: '10:30 AM', eta: '35 mins', seats: 'Available' },
  { id: '2', name: 'Pushpak AC', departure: '11:15 AM', eta: '45 mins', seats: 'Filling Fast' },
  { id: '3', name: 'Pushpak AM', departure: '12:00 PM', eta: '30 mins', seats: 'Available' },
  { id: '4', name: 'Pushpak AS', departure: '12:45 PM', eta: '50 mins', seats: 'Housefull' },
  { id: '5', name: 'Pushpak AB', departure: '01:30 PM', eta: '40 mins', seats: 'Available' }
];

// ── Tracking states ────────────────────────────────────────────────────────────
type TrackingState = 'idle' | 'waiting' | 'active' | 'expired' | 'error';

export default function BusServicePage() {
  const navigate = useNavigate();

  // Selection states
  const [isReversed, setIsReversed] = useState(false);
  const [selectedCity, setSelectedCity] = useState(DESTINATIONS[0]);
  const [showBuses, setShowBuses] = useState(false);

  // Tracking states
  const [trackingBus, setTrackingBus] = useState<BusInfo | null>(null);
  const [trackingState, setTrackingState] = useState<TrackingState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs for polling intervals and timeout
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSwap = () => {
    setIsReversed(prev => !prev);
    setShowBuses(false);
  };

  const handleProceed = () => {
    setShowBuses(true);
  };

  const cleanupTracking = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setTrackingBus(null);
    setTrackingState('idle');
  };

  /**
   * Starts polling GET /api/bus-service/location/:driverId every 3 seconds.
   * Navigates to the tracking page as soon as the driver shares live location.
   * Stops after 2 minutes with an error if the driver does not respond.
   */
  const startPolling = (bus: BusInfo) => {
    pollingIntervalRef.current = setInterval(async () => {
      try {
        const locationData = await getBusLocation(bus.id);
        if (locationData?.trackingActive && locationData.latitude && locationData.longitude) {
          cleanupTracking();
          sessionStorage.setItem('currentBusTracking', JSON.stringify({
            bus,
            location: {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              timestamp: locationData.lastUpdated
                ? new Date(locationData.lastUpdated).getTime()
                : Date.now(),
            },
            destination: selectedCity,
            isReversed,
            driverId: bus.id,
          }));
          navigate('/bus-service/track');
        }
      } catch (pollErr) {
        console.error('[BusServicePage] Polling error:', pollErr);
      }
    }, 3000);

    // Timeout after 2 minutes
    timeoutRef.current = setTimeout(() => {
      cleanupTracking();
      setTrackingState('error');
      setErrorMessage('Driver did not respond within 2 minutes. Please try again later.');
    }, 120000);
  };

  const handleTrackBus = async (bus: BusInfo) => {
    if (bus.seats === 'Housefull') {
      alert('This bus is housefull. Please choose another bus.');
      return;
    }

    setTrackingBus(bus);
    setTrackingState('waiting');
    setErrorMessage(null);

    try {
      // Ask the backend to decide whether to ping the driver via Telegram.
      // The backend is the sole authority on this decision.
      const response = await requestBusTracking(bus.id, bus.name);

      if (response.status === 'active' && response.latitude && response.longitude) {
        // Session already active — navigate immediately, no Telegram message was sent
        setTrackingBus(null);
        setTrackingState('idle');
        sessionStorage.setItem('currentBusTracking', JSON.stringify({
          bus,
          location: {
            latitude: response.latitude,
            longitude: response.longitude,
            timestamp: response.lastUpdated
              ? new Date(response.lastUpdated).getTime()
              : Date.now(),
          },
          destination: selectedCity,
          isReversed,
          driverId: bus.id,
        }));
        navigate('/bus-service/track');
        return;
      }

      if (response.status === 'waiting') {
        // Telegram request was sent — start polling for location updates
        setTrackingState('waiting');
        startPolling(bus);
        return;
      }

      if (response.status === 'expired') {
        setTrackingState('expired');
        return;
      }

    } catch (err: any) {
      console.error('[BusServicePage] Track request failed:', err);
      cleanupTracking();
      setTrackingState('error');
      setErrorMessage('Unable to contact the tracking server. Please try again.');
    }
  };

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ── Status panel content ─────────────────────────────────────────────────────
  const statusPanel = (() => {
    if (trackingState === 'waiting') {
      return {
        icon: <Loader2 className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-spin shrink-0" />,
        title: 'Contacting Bus Driver',
        body: "Waiting for driver's live location… Checking every 3 seconds.",
        colorClass: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30',
        titleColor: 'text-amber-800 dark:text-amber-400',
        action: (
          <button
            onClick={cleanupTracking}
            className="text-xs font-bold text-amber-800 dark:text-amber-450 hover:underline px-3 py-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/20"
          >
            Cancel
          </button>
        ),
      };
    }
    if (trackingState === 'expired') {
      return {
        icon: <Clock className="w-6 h-6 text-slate-500 shrink-0" />,
        title: 'Tracking Expired',
        body: 'The previous tracking session has expired. A new request has been sent to the driver.',
        colorClass: 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700',
        titleColor: 'text-slate-700 dark:text-slate-300',
        action: (
          <button
            onClick={() => setTrackingState('idle')}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            Dismiss
          </button>
        ),
      };
    }
    if (trackingState === 'error') {
      return {
        icon: <span className="text-2xl">⚠️</span>,
        title: 'Tracking Request Failed',
        body: errorMessage || 'An unexpected error occurred.',
        colorClass: 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30',
        titleColor: 'text-rose-800 dark:text-rose-400',
        action: (
          <button
            onClick={() => { setTrackingState('idle'); setErrorMessage(null); }}
            className="text-xs font-bold text-rose-800 dark:text-rose-450 hover:underline px-3 py-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/20"
          >
            Dismiss
          </button>
        ),
      };
    }
    return null;
  })();

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-5 sm:px-6 lg:px-8 lg:py-8 transition-colors duration-300">
      {/* Decorative gradient top shadow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(37,99,235,0.08),_transparent_60%)]" />

      <div className="relative mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-white/90 dark:bg-slate-800/90 p-5 border border-slate-150/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur sm:p-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                Transit services
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                🚌 Airport Bus Service
              </h2>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 max-w-xl">
            Select your route, view scheduling intervals, and track live airport coaches using our driver tracking system.
          </p>
        </header>

        {/* Route Selection Form */}
        <section className="rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-150/60 dark:border-slate-700/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-5">
            Route Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* From */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                From
              </label>
              {isReversed ? (
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setShowBuses(false);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {DESTINATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 rounded-2xl border border-slate-250 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                  <Navigation size={14} className="text-blue-500 shrink-0" />
                  <span className="truncate">{AIRPORT}</span>
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center pt-5">
              <button
                onClick={handleSwap}
                className="p-3 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 hover:scale-105 active:scale-95 transition-all shadow-sm"
                title="Swap routes"
              >
                <ArrowLeftRight size={18} className="transform rotate-90 md:rotate-0" />
              </button>
            </div>

            {/* To */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                To
              </label>
              {!isReversed ? (
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setShowBuses(false);
                  }}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {DESTINATIONS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              ) : (
                <div className="w-full px-4 py-3 rounded-2xl border border-slate-250 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
                  <Navigation size={14} className="text-blue-500 shrink-0" />
                  <span className="truncate">{AIRPORT}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleProceed}
              className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-600 font-bold rounded-2xl text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:translate-y-[-1px] active:translate-y-0 active:scale-98"
            >
              Proceed
            </button>
          </div>
        </section>

        {/* Tracking Status Panel */}
        <AnimatePresence>
          {statusPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className={`p-5 rounded-3xl border flex items-center gap-4 ${statusPanel.colorClass}`}>
                {statusPanel.icon}
                <div className="flex-1">
                  <h4 className={`text-sm font-bold ${statusPanel.titleColor}`}>
                    {statusPanel.title}
                  </h4>
                  <p className="text-xs mt-1 text-slate-600 dark:text-slate-350">
                    {statusPanel.body}
                  </p>
                </div>
                {statusPanel.action}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bus List */}
        <AnimatePresence>
          {showBuses && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Bus size={16} />
                  Available Coaches ({SAMPLE_BUSES.length})
                </h3>
                <span className="text-xs font-semibold text-slate-450">
                  {isReversed ? `${selectedCity} ➔ Airport` : `Airport ➔ ${selectedCity}`}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SAMPLE_BUSES.map(bus => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    onTrack={handleTrackBus}
                    isTrackingThisBus={trackingBus?.id === bus.id}
                    anyBusTracking={!!trackingBus}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
