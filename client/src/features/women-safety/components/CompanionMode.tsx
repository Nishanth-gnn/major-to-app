import React, { useState, useEffect, useRef } from 'react'

interface CompanionModeProps {
  onTriggerSOS: () => void
}

export default function CompanionMode({ onTriggerSOS }: CompanionModeProps) {
  const [isActive, setIsActive] = useState(false)
  const [durationMinutes, setDurationMinutes] = useState(5)
  const [timeLeft, setTimeLeft] = useState(0) // in seconds
  const [contacts, setContacts] = useState<{ name: string; phone: string }[]>(() => {
    const saved = localStorage.getItem('safety_contacts')
    return saved ? JSON.parse(saved) : [
      { name: 'Family Emergency Desk', phone: '+91 99999 88888' },
      { name: 'Airport Police Liaison', phone: '112' }
    ]
  })
  
  // Custom contact input
  const [newContactName, setNewContactName] = useState('')
  const [newContactPhone, setNewContactPhone] = useState('')

  // Safety check-in overlay state
  const [showCheckInModal, setShowCheckInModal] = useState(false)
  const [checkInCountdown, setCheckInCountdown] = useState(15) // 15 seconds to confirm okay

  const timerRef = useRef<number | null>(null)
  const checkInTimerRef = useRef<number | null>(null)
  const nextCheckInIntervalRef = useRef<number | null>(null)

  // Start Companion Walk
  const startCompanionMode = () => {
    setIsActive(true)
    setTimeLeft(durationMinutes * 60)
    
    // Save contacts to localStorage
    localStorage.setItem('safety_contacts', JSON.stringify(contacts))

    // Set first safety check-in countdown
    scheduleNextCheckIn()
  }

  // Stop / Complete Companion Walk
  const stopCompanionMode = (success = true) => {
    setIsActive(false)
    setShowCheckInModal(false)
    clearAllTimers()
    if (success) {
      alert('Walk ended successfully. Glad you arrived safe!')
    }
  }

  const clearAllTimers = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (checkInTimerRef.current) clearInterval(checkInTimerRef.current)
    if (nextCheckInIntervalRef.current) clearInterval(nextCheckInIntervalRef.current)
  }

  // Periodic safety trigger scheduler (every 30 seconds of active walk)
  const scheduleNextCheckIn = () => {
    if (nextCheckInIntervalRef.current) clearInterval(nextCheckInIntervalRef.current)
    
    nextCheckInIntervalRef.current = window.setInterval(() => {
      // Trigger check-in popup
      setShowCheckInModal(true)
      setCheckInCountdown(15)
      
      // Start countdown to auto-alarm
      startCheckInCountdownTimer()
    }, 30000) // check in every 30s for demo purposes
  }

  // Countdown timer when check-in popup is visible
  const startCheckInCountdownTimer = () => {
    if (checkInTimerRef.current) clearInterval(checkInTimerRef.current)
    
    checkInTimerRef.current = window.setInterval(() => {
      setCheckInCountdown((prev) => {
        if (prev <= 1) {
          // Time expired! User failed to verify safety. Trigger emergency!
          triggerAutoEmergency()
          return 0;
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleConfirmSafety = () => {
    setShowCheckInModal(false)
    if (checkInTimerRef.current) {
      clearInterval(checkInTimerRef.current)
    }
    // Reschedule next check in
    scheduleNextCheckIn()
  }

  const triggerAutoEmergency = () => {
    clearAllTimers()
    setIsActive(false)
    setShowCheckInModal(false)
    onTriggerSOS()
  }

  // Manage overall remaining walk time countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopCompanionMode(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft])

  // Cleanup on unmount
  useEffect(() => {
    return () => clearAllTimers()
  }, [])

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60)
    const rs = secs % 60
    return `${mins}:${rs < 10 ? '0' : ''}${rs}`
  }

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContactName.trim() || !newContactPhone.trim()) return
    const updated = [...contacts, { name: newContactName.trim(), phone: newContactPhone.trim() }]
    setContacts(updated)
    localStorage.setItem('safety_contacts', JSON.stringify(updated))
    setNewContactName('')
    setNewContactPhone('')
  }

  const handleDeleteContact = (idx: number) => {
    const updated = contacts.filter((_, i) => i !== idx)
    setContacts(updated)
    localStorage.setItem('safety_contacts', JSON.stringify(updated))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Walk With Me (Companion Mode)</h3>
          <p className="text-xs text-slate-400">Reassurance monitoring. Failing to check-in triggers the SOS siren.</p>
        </div>
      </div>

      {!isActive ? (
        <div className="space-y-6">
          
          {/* Settings form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Companion Setup</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] text-slate-400 font-semibold mb-1">Set Walk Duration (min)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                
                <button
                  onClick={startCompanionMode}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition"
                >
                  🟢 Start Companion Walk
                </button>
              </div>
            </div>

            {/* Contacts registry */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between items-center">
                  <span>Emergency Alert Contacts</span>
                  <span className="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded-full">{contacts.length} added</span>
                </h4>

                <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1 mb-3">
                  {contacts.map((c, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 text-[11px]">
                      <div>
                        <div className="font-bold text-slate-800">{c.name}</div>
                        <div className="text-slate-400 font-mono">{c.phone}</div>
                      </div>
                      <button
                        onClick={() => handleDeleteContact(i)}
                        className="text-red-400 hover:text-red-600 font-semibold text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {contacts.length === 0 && (
                    <div className="text-[10px] italic text-slate-400 text-center py-4">No custom contacts registered.</div>
                  )}
                </div>
              </div>

              {/* Add contact mini-form */}
              <form onSubmit={handleAddContact} className="flex gap-1.5 pt-2 border-t border-slate-200/50">
                <input
                  type="text"
                  placeholder="Name"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-1/2 bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] text-slate-700"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-1/2 bg-white border border-slate-200 rounded px-1.5 py-1 text-[10px] text-slate-700"
                />
                <button
                  type="submit"
                  className="bg-emerald-600 text-white rounded px-2.5 py-1 text-[10px] font-bold"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
          
        </div>
      ) : (
        /* Companion Walk Active Simulation Screen */
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-600/5 skew-x-12 transform origin-top-right"></div>
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active Companion Walk</span>
            </div>
            <div className="text-right text-xs font-mono font-bold text-slate-300">
              Time Left: <span className="text-lg font-black text-emerald-400">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Graphic walking track */}
          <div className="relative h-20 bg-slate-800 rounded-xl mb-4 border border-slate-700 flex items-center justify-center p-4">
            <div className="absolute left-6 right-6 h-1 bg-slate-700 rounded flex items-center">
              <div
                className="bg-emerald-500 h-full rounded transition-all duration-1000"
                style={{ width: `${100 - (timeLeft / (durationMinutes * 60)) * 100}%` }}
              ></div>
            </div>

            <div className="w-full flex justify-between z-10 text-[9px] font-semibold text-slate-400">
              <div className="text-left bg-slate-900/60 p-1.5 rounded border border-slate-700/50">
                🛫 Start Terminal
              </div>
              <div className="text-center bg-slate-900/60 p-1.5 rounded border border-slate-700/50">
                Checking in every 30s
              </div>
              <div className="text-right bg-slate-900/60 p-1.5 rounded border border-slate-700/50">
                🎯 Gate Lounge
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 text-xs bg-slate-800 border border-slate-700/60 p-3.5 rounded-xl text-slate-300">
            <div>
              <div className="font-semibold text-white">Next Safety Check-in</div>
              <p className="text-[10px] text-slate-400">A popup will appear shortly asking you to confirm your safety.</p>
            </div>
            <button
              onClick={() => {
                setShowCheckInModal(true)
                setCheckInCountdown(15)
                startCheckInCountdownTimer()
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-1.5 px-3 rounded text-[10px]"
            >
              Trigger Check now
            </button>
          </div>

          <button
            onClick={() => stopCompanionMode(false)}
            className="w-full mt-4 py-2.5 bg-red-950/60 border border-red-500/20 hover:bg-red-900 text-red-400 font-bold rounded-xl text-xs transition"
          >
            🛑 Stop Monitoring (Arrived Safe)
          </button>
        </div>
      )}

      {/* Safety Check-in overlay Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-6 text-slate-800">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-slate-100 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 border border-amber-200 rounded-full flex items-center justify-center text-3xl mx-auto animate-pulse">
              🛡️
            </div>
            
            <div>
              <h3 className="text-lg font-black text-slate-800">Safety Verification</h3>
              <p className="text-xs text-slate-400 mt-1">Please confirm you are safe. Timer expires in:</p>
              <div className="text-4xl font-black text-red-500 font-mono mt-2 animate-bounce">{checkInCountdown}s</div>
            </div>

            <p className="text-[10px] text-slate-400">
              If you don't respond, the emergency siren will sound and security staff will track your terminal location.
            </p>

            <div className="flex gap-2">
              <button
                onClick={triggerAutoEmergency}
                className="flex-1 bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 font-bold rounded-xl py-2.5 text-xs"
              >
                ⚠️ I need Help
              </button>
              <button
                onClick={handleConfirmSafety}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-2.5 text-xs shadow-md shadow-emerald-100"
              >
                ✓ Yes, I am Safe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
