import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, CheckCircle2, Clock, MapPin, User, FileText, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import LiveTrackingMap from '../../transit-services/components/LiveTrackingMap';
import { AGENCIES, AgencyType } from '../data/emergencyCategories';

interface ActiveStaffAlert {
  id: string;
  passengerName: string;
  ticketId: string;
  emergencyType: string;
  category: 'Police' | 'Medical' | 'Fire';
  primaryAgency: AgencyType;
  additionalAgencies: AgencyType[];
  terminal: string;
  latitude: number;
  longitude: number;
  time: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  status: 'PENDING' | 'ACCEPTED' | 'DISPATCHED' | 'ARRIVED' | 'RESOLVED';
}

const INITIAL_ALERTS: ActiveStaffAlert[] = [
  {
    id: 'ALT-9402',
    passengerName: 'Sai Venkat',
    ticketId: '3409967503',
    emergencyType: 'Chest Pain / Heart Attack',
    category: 'Medical',
    primaryAgency: 'medical',
    additionalAgencies: [],
    terminal: 'Terminal 3 (Gate A12)',
    latitude: 17.3934,
    longitude: 78.4706,
    time: 'Just now',
    priority: 'CRITICAL',
    status: 'ACCEPTED',
  },
  {
    id: 'ALT-9398',
    passengerName: 'Rahul Sharma',
    ticketId: '1098452391',
    emergencyType: 'Suspicious or unattended baggage',
    category: 'Police',
    primaryAgency: 'police',
    additionalAgencies: ['fire'],
    terminal: 'Terminal 3 Arrivals (Belt 4)',
    latitude: 17.2403,
    longitude: 78.4294,
    time: '4 mins ago',
    priority: 'CRITICAL',
    status: 'DISPATCHED',
  },
];

export default function StaffResponseDashboardPage() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<ActiveStaffAlert[]>(INITIAL_ALERTS);
  const [selectedAlertId, setSelectedAlertId] = useState<string>(INITIAL_ALERTS[0].id);

  // Fetch server alerts if available
  useEffect(() => {
    fetch('/api/emergency-alert/active')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAlerts(data);
          setSelectedAlertId(data[0].id);
        }
      })
      .catch(() => {});
  }, []);

  const updateAlertStatus = (id: string, newStatus: ActiveStaffAlert['status']) => {
    setAlerts((prev) =>
      prev.map((alt) => (alt.id === id ? { ...alt, status: newStatus } : alt))
    );

    // Sync with backend if available
    fetch(`/api/emergency-alert/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    }).catch(() => {});
  };

  const activeAlert = alerts.find((a) => a.id === selectedAlertId) || alerts[0];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-20 safe-bottom">
      {/* Header */}
      <div className="bg-[#0c1322]/90 border-b border-white/10 sticky top-0 z-30 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/emergency-contact')}
              className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                <span>Airport Staff Emergency Dispatch Dashboard</span>
                <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-red-500/30">
                  ● OPERATIONAL
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Multi-Agency Command & Control Room
              </p>
            </div>
          </div>

          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
            <Activity size={14} className="animate-pulse" />
            <span>Active Response Units: 14</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Active Alerts List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Incoming Passenger Alerts ({alerts.length})</span>
            <span className="text-[10px] text-blue-400">Auto-Refreshed</span>
          </h2>

          <div className="space-y-3">
            {alerts.map((alt) => {
              const isSelected = alt.id === selectedAlertId;
              const prioColor =
                alt.priority === 'CRITICAL'
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : alt.priority === 'HIGH'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/30';

              return (
                <motion.div
                  key={alt.id}
                  onClick={() => setSelectedAlertId(alt.id)}
                  whileHover={{ scale: 1.01 }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border-blue-500/60 shadow-xl'
                      : 'bg-[#0d1628]/80 hover:bg-[#131f38] border-white/8'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{alt.id}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${prioColor}`}>
                      {alt.priority}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{AGENCIES[alt.primaryAgency].icon}</span>
                    <span className="truncate">{alt.emergencyType}</span>
                  </h3>

                  <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                    <span>{alt.passengerName} • {alt.terminal}</span>
                    <span className="font-semibold text-emerald-400">{alt.status}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Alert Detail & Responder Actions */}
        <div className="lg:col-span-7 space-y-5">
          {activeAlert && (
            <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">Selected Alert #{activeAlert.id}</span>
                  <h2 className="text-lg font-extrabold text-white flex items-center gap-2 mt-0.5">
                    <span>{AGENCIES[activeAlert.primaryAgency].icon}</span>
                    <span>{activeAlert.emergencyType}</span>
                  </h2>
                </div>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-xl border border-emerald-500/30">
                  {activeAlert.status}
                </span>
              </div>

              {/* Passenger Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-[#0d1628] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <User size={12} /> Passenger
                  </div>
                  <div className="text-xs font-bold text-white mt-1">{activeAlert.passengerName}</div>
                </div>

                <div className="bg-[#0d1628] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <FileText size={12} /> Ticket ID
                  </div>
                  <div className="text-xs font-bold text-white mt-1">{activeAlert.ticketId}</div>
                </div>

                <div className="bg-[#0d1628] p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] text-slate-400 uppercase font-bold flex items-center gap-1">
                    <MapPin size={12} /> Location
                  </div>
                  <div className="text-xs font-bold text-white mt-1">{activeAlert.terminal}</div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="h-[220px]">
                <LiveTrackingMap
                  lat={activeAlert.latitude}
                  lng={activeAlert.longitude}
                  vehicleName={activeAlert.passengerName}
                  vehicleType="metro"
                />
              </div>

              {/* Interactive Responder Action Buttons (Step 5) */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="text-xs font-bold text-slate-300">Staff Response Controls:</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => updateAlertStatus(activeAlert.id, 'ACCEPTED')}
                    className="py-2.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/50 rounded-xl text-xs font-bold transition-all"
                  >
                    Accept Alert
                  </button>

                  <button
                    onClick={() => updateAlertStatus(activeAlert.id, 'DISPATCHED')}
                    className="py-2.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/50 rounded-xl text-xs font-bold transition-all"
                  >
                    Dispatch Team
                  </button>

                  <button
                    onClick={() => updateAlertStatus(activeAlert.id, 'ARRIVED')}
                    className="py-2.5 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/50 rounded-xl text-xs font-bold transition-all"
                  >
                    Mark Arrived
                  </button>

                  <button
                    onClick={() => updateAlertStatus(activeAlert.id, 'RESOLVED')}
                    className="py-2.5 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-200 border border-emerald-500/50 rounded-xl text-xs font-bold transition-all"
                  >
                    Mark Resolved
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
