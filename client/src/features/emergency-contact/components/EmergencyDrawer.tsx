import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ShieldAlert,
  Stethoscope,
  Shield,
  Flame,
  HelpCircle,
  Search,
  UserX,
  CheckCircle2,
  Clock,
  PhoneCall,
  Navigation,
} from 'lucide-react'

interface EmergencyDrawerProps {
  open: boolean
  onClose: () => void
}

const EMERGENCY_CATEGORIES = [
  { id: 'sos', label: 'General SOS', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/20' },
  { id: 'medical', label: 'Medical Assistance', icon: Stethoscope, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  { id: 'security', label: 'Airport Security (CISF)', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'fire', label: 'Fire & Rescue', icon: Flame, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  { id: 'support', label: 'Customer Support', icon: HelpCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  { id: 'lost', label: 'Lost & Found', icon: Search, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  { id: 'missing', label: 'Missing Person', icon: UserX, color: 'text-purple-400', bg: 'bg-purple-500/20' },
]

export default function EmergencyDrawer({ open, onClose }: EmergencyDrawerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelectedCategory(id)
    setDispatchStatus('sent')
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Dedicated Right-Side Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#0E1B2D] border-l border-white/10 shadow-2xl z-50 flex flex-col justify-between overflow-y-auto p-6"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
                    <ShieldAlert className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-[#F8FAFC]">Airport Emergency Dispatch</h2>
                    <p className="text-xs text-[#94A3B8]">Government & Multi-Agency Emergency Platform</p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Emergency Category Selection Grid */}
              {!dispatchStatus && (
                <div className="space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                    Select Emergency Category
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {EMERGENCY_CATEGORIES.map((cat) => {
                      const Icon = cat.icon
                      return (
                        <button
                          key={cat.id}
                          onClick={() => handleSelect(cat.id)}
                          className="p-4 rounded-2xl bg-[#13243B] hover:bg-[#1f3454] border border-white/10 hover:border-red-500/40 text-left transition-all flex items-center justify-between group shadow-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${cat.bg} ${cat.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-bold text-[#F8FAFC]">{cat.label}</span>
                          </div>
                          <span className="text-xs font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Dispatch →
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Multi-Agency Dispatch Timeline Status */}
              {dispatchStatus && (
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Dispatch Request Active
                      </span>
                      <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                        REF #EMG-8921
                      </span>
                    </div>
                    <p className="text-xs text-emerald-200/80">
                      Airport Command Control Center has logged your request. Medical & CISF Quick Response Team assigned.
                    </p>
                  </div>

                  {/* Dispatch Timeline Stepper */}
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8]">
                      Real-Time Response Timeline
                    </div>

                    <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-white/10">
                      {[
                        { label: 'Alert Sent', time: '14:55:02', done: true },
                        { label: 'Dispatcher Confirmed', time: '14:55:10', done: true },
                        { label: 'Team Assigned (QRT-4)', time: '14:55:25', done: true },
                        { label: 'En Route to Terminal 1 (Gate 14B)', time: 'ETA 2 min', active: true },
                        { label: 'Arrived at Location', time: 'Pending' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 relative z-10">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                              step.done
                                ? 'bg-emerald-500 text-black'
                                : step.active
                                ? 'bg-[#2F80FF] text-white animate-pulse ring-4 ring-blue-500/30'
                                : 'bg-[#13243B] text-[#94A3B8]'
                            }`}
                          >
                            {step.done ? '✓' : i + 1}
                          </div>
                          <div className="flex-1 flex items-center justify-between text-xs">
                            <span className={`font-semibold ${step.active ? 'text-[#14C8FF] font-bold' : 'text-[#F8FAFC]'}`}>
                              {step.label}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-mono">{step.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDispatchStatus(null)
                      setSelectedCategory(null)
                    }}
                    className="w-full py-3 rounded-2xl bg-[#13243B] hover:bg-[#1f3454] border border-white/10 text-xs font-bold text-[#F8FAFC]"
                  >
                    ← Select Different Category
                  </button>
                </div>
              )}
            </div>

            {/* Direct Helpline Buttons Footer */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="text-[10px] text-[#94A3B8] uppercase font-bold text-center">Direct Emergency Lines</div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:112"
                  className="py-2.5 px-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call 112
                </a>
                <a
                  href="tel:108"
                  className="py-2.5 px-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Medical 108
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
