import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Siren, MapPin, Loader, ShieldCheck } from 'lucide-react';
import Header from '../../home/components/Header';
import BottomNavigation from '../../home/components/BottomNavigation';
import EmergencyNotice from '../components/EmergencyNotice';
import EmergencyReasonSelect from '../components/EmergencyReasonSelect';

// sessionStorage key — automatically cleared when the browser/tab is closed
const ALERT_SENT_KEY = 'emergencyAlertSent';

type Status = 'idle' | 'locating' | 'sending' | 'error';

/**
 * EmergencyContactPage
 *
 * Once an alert is successfully sent, the page replaces its entire content
 * with a "Police Officer has been notified" waiting screen.
 * This state survives page navigation but is reset when the browser is closed
 * (sessionStorage is used — not localStorage).
 */
export default function EmergencyContactPage() {
  const navigate = useNavigate();

  // Check sessionStorage on first render — if already sent, go straight to waiting screen
  const [alertSent, setAlertSent] = useState<boolean>(
    () => sessionStorage.getItem(ALERT_SENT_KEY) === 'true'
  );

  const [reason, setReason]     = useState('');
  const [status, setStatus]     = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Read passenger data from sessionStorage (set after QR scan)
  const getBoardingData = () => {
    try {
      const raw = sessionStorage.getItem('boardingData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // ── Main handler ──────────────────────────────────────────────
  const handleEmergencyAlert = async () => {
    if (!reason) return;

    setStatus('locating');
    setErrorMsg('');

    // Step 1: Get current location (high accuracy)
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(resolve, (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error('Location permission denied. Please allow location access and try again.'));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error('Location information is unavailable. Please try again.'));
            break;
          case err.TIMEOUT:
            reject(new Error('Location request timed out. Please try again.'));
            break;
          default:
            reject(new Error('Unable to retrieve your location.'));
        }
      }, { timeout: 15000, enableHighAccuracy: true });
    }).catch((err: Error) => {
      setStatus('error');
      setErrorMsg(err.message);
      return null;
    });

    if (!position) return;

    const { latitude, longitude, accuracy } = position.coords;
    const boarding = getBoardingData();

    // Step 2: Send to backend
    setStatus('sending');

    try {
      const payload = {
        passengerName:   boarding?.passenger_name ?? 'Unknown Passenger',
        ticketId:        boarding?.ticket_id       ?? 'N/A',
        emergencyReason: reason,
        latitude,
        longitude,
        accuracy,          // metres — from browser Geolocation API (enableHighAccuracy: true)
        timestamp:         new Date().toISOString(),
      };

      const response = await fetch('/api/emergency-alert', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      // Safely parse JSON — proxy errors may return empty/non-JSON bodies
      let data: any = {};
      try {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        if (!response.ok) {
          throw new Error('Unable to reach the server. Please ensure the backend is running and try again.');
        }
      }

      if (!response.ok) {
        throw new Error(data.error || 'Server error. Please try again.');
      }

      // ── Success: lock the page into "notified" state ──────────
      // Store in sessionStorage so it persists across navigation
      // but resets automatically when the browser/tab is closed.
      sessionStorage.setItem(ALERT_SENT_KEY, 'true');
      setAlertSent(true);

    } catch (err: any) {
      setStatus('error');
      setErrorMsg(
        err.message === 'Failed to fetch'
          ? 'Unable to reach the server. Please check your connection and try again.'
          : err.message || 'An unexpected error occurred.'
      );
    }
  };

  // ── Derived state ─────────────────────────────────────────────
  const isLoading = status === 'locating' || status === 'sending';
  const canSend   = !!reason && !isLoading;

  const buttonLabel =
    status === 'locating' ? 'Getting Location…' :
    status === 'sending'  ? 'Sending Alert…'    :
    'Emergency Alert';

  // ════════════════════════════════════════════════════════════════
  // WAITING SCREEN — shown after a successful alert
  // Only dismissed when the browser / tab is closed (sessionStorage)
  // ════════════════════════════════════════════════════════════════
  if (alertSent) {
    return (
      <div className="min-h-screen bg-[#eef2f6] dark:bg-slate-900 font-sans transition-colors flex flex-col">
        <div className="max-w-3xl mx-auto w-full p-4 flex-1 flex flex-col">
          <Header minimal />

          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              className="w-full max-w-sm flex flex-col items-center text-center gap-6"
            >
              {/* Pulsing shield icon */}
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
                <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40">
                  <ShieldCheck size={52} className="text-white" strokeWidth={1.8} />
                </div>
              </div>

              {/* Primary message */}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                  Police Officer has been<br />notified!
                </h2>
                <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
                  Please wait.
                </p>
              </div>

              {/* Info card */}
              <div className="w-full bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-md border border-slate-100 dark:border-slate-700 flex flex-col gap-3 text-left">
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  Your emergency alert has been sent.
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <span className="text-emerald-500 shrink-0">✓</span>
                  Your location has been shared with responders.
                </p>
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                  <span className="text-amber-500 shrink-0">⚠</span>
                  Remain at your current location until assistance arrives.
                </p>
              </div>

              {/* Animated status bar */}
              <div className="w-full bg-white dark:bg-slate-800 rounded-xl px-4 py-3 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center gap-3">
                <span className="flex h-3 w-3 shrink-0 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                  Responders are on their way…
                </span>
              </div>

              <p className="text-xs text-slate-400 dark:text-slate-500">
                This screen will reset only when you close or restart the app.
              </p>
            </motion.div>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════
  // NORMAL FORM — shown before alert is sent
  // ════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-[#eef2f6] dark:bg-slate-900 pb-28 font-sans transition-colors">
      <div className="max-w-3xl mx-auto p-4">
        <Header minimal />

        {/* ── Page header ── */}
        <div className="flex items-center gap-3 mt-4 mb-6">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Siren size={20} className="text-red-500" />
              Emergency Contact
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Immediate assistance request
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5 max-w-xl mx-auto">

          {/* A. Emergency Notice */}
          <EmergencyNotice />

          {/* B. Reason dropdown */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700">
            <EmergencyReasonSelect value={reason} onChange={setReason} />
          </div>

          {/* Location note */}
          <div className="flex items-center gap-2 px-1">
            <MapPin size={14} className="text-blue-500 shrink-0" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your current GPS location will be automatically included in the alert.
            </p>
          </div>

          {/* C. Emergency Alert button */}
          <button
            id="emergency-alert-btn"
            onClick={handleEmergencyAlert}
            disabled={!canSend}
            className={`w-full py-5 flex items-center justify-center gap-3 font-extrabold text-base rounded-2xl shadow-xl transition-all duration-200 transform active:scale-[0.98] ${
              canSend
                ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-500/30 hover:shadow-red-500/50'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
            }`}
          >
            {isLoading ? (
              <Loader size={22} className="animate-spin" />
            ) : (
              <Siren size={22} />
            )}
            <span>{buttonLabel}</span>
          </button>

          {/* Error message */}
          {status === 'error' && errorMsg && (
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 rounded-xl px-4 py-3 flex items-start gap-2">
              <span className="text-red-500 shrink-0 mt-0.5">⚠️</span>
              <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMsg}</p>
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
