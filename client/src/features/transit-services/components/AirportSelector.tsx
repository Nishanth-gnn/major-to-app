import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, MapPin, Check, Globe, ChevronDown, Sparkles, Plane, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Airport, AirportRegion } from '../types';
import { AIRPORTS } from '../data/transitData';

interface AirportSelectorProps {
  selectedAirport: Airport;
  onSelectAirport: (airport: Airport) => void;
}

const REGIONS: AirportRegion[] = ['India', 'Middle East', 'Europe', 'Asia', 'North America', 'Australia'];

export default function AirportSelector({ selectedAirport, onSelectAirport }: AirportSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const boarding = (() => {
    try {
      const raw = sessionStorage.getItem('boardingData');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const ticketAirports = AIRPORTS.filter(a => {
    if (!boarding) return false;
    return a.code === boarding.from || a.code === boarding.to;
  });

  const isUnavailable = !boarding || ticketAirports.length === 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative z-40">
      {/* ── Selector Trigger Button & Airport Identity Panel ────────────────── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#0E1B2D] hover:bg-[#13243B] border border-white/10 hover:border-blue-400/40 rounded-[24px] p-5 transition-all shadow-xl backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left group hover-lift"
        aria-label="Select Airport Operating Hub"
      >
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600/30 via-cyan-500/20 to-blue-500/10 border border-blue-400/30 flex items-center justify-center text-3xl shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-200">
            {selectedAirport.flag}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-black uppercase tracking-widest text-[#14C8FF]">
                {selectedAirport.city}, {selectedAirport.country}
              </span>
              <span className="bg-[#2F80FF]/20 text-[#14C8FF] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-400/30">
                {selectedAirport.code}
              </span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>
            <h2 className="text-lg font-black text-[#F8FAFC] truncate">
              {selectedAirport.name}
            </h2>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8] flex-wrap pt-0.5">
              <span>Metro: <strong className="text-[#F8FAFC]">{selectedAirport.defaultMetroStation}</strong></span>
              <span>•</span>
              <span>Terminals: <strong className="text-[#14C8FF]">2 Active</strong></span>
              <span>•</span>
              <span>Pushpak Fleet: <strong className="text-emerald-400">12 Units</strong></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <span className="text-xs text-[#14C8FF] font-bold group-hover:underline flex items-center gap-1.5"><Plane className="w-3.5 h-3.5" /> Select Airport</span>
          <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
            <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* ── Modal Overlay (Portaled to body) ────────────────────────────────── */}
      {createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
              />

              {/* Modal Dialog */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative w-full max-w-2xl bg-[#0a1020] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl max-h-[85vh] flex flex-col z-10"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                      <Plane className="text-blue-400" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">Select Airport</h3>
                      <p className="text-xs text-slate-400">Airports from your current ticket</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-400 hover:text-white w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {/* Airports List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {isUnavailable ? (
                    <div className="text-center py-10 flex flex-col items-center justify-center gap-3 bg-white/5 rounded-2xl border border-white/10 p-6">
                      <AlertCircle className="w-8 h-8 text-amber-500/80" />
                      <div className="text-slate-300 font-bold text-base">Airport selection unavailable</div>
                      <div className="text-slate-500 text-sm">Ticket information not found.</div>
                    </div>
                  ) : (
                    ticketAirports.map((ap) => {
                      const isSelected = ap.id === selectedAirport.id;
                      return (
                        <button
                          key={ap.id}
                          onClick={() => {
                            onSelectAirport(ap);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-600/15 border-blue-500/40 shadow-lg shadow-blue-500/10'
                              : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/15'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-2xl shrink-0">{ap.flag}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-white truncate">{ap.city} ({ap.code})</span>
                                <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                                  {ap.region}
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 truncate">{ap.name}</div>
                              <div className="text-[11px] text-blue-400/80 flex items-center gap-1 mt-0.5">
                                <MapPin size={11} /> {ap.defaultMetroStation}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 ml-2">
                              <Check size={14} />
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}

