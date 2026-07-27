import React, { useState, useEffect, useRef } from 'react'

interface SOSButtonProps {
  onTriggerSOS: (location?: string) => void
  onCancelSOS: () => void
  isSosTriggered: boolean
}

export default function SOSButton({ onTriggerSOS, onCancelSOS, isSosTriggered }: SOSButtonProps) {
  const [holdProgress, setHoldProgress] = useState(0)
  const [isHolding, setIsHolding] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)
  
  const timerRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const mainOscRef = useRef<OscillatorNode | null>(null)
  const lfoOscRef = useRef<OscillatorNode | null>(null)

  const holdDuration = 2000 // Hold down for 2 seconds to trigger

  // Handle holding triggers
  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (isSosTriggered) return
    setIsHolding(true)
    setHoldProgress(0)

    const startTime = Date.now()
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min(100, (elapsed / holdDuration) * 100)
      setHoldProgress(pct)

      if (pct >= 100) {
        triggerEmergency()
      }
    }, 50)
  }

  const endHold = () => {
    setIsHolding(false)
    setHoldProgress(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const triggerEmergency = () => {
    endHold()
    onTriggerSOS()
    startSirenSound()
  }

  // Web Audio API Siren Synthesis
  const startSirenSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return

      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      const osc = ctx.createOscillator()
      const lfo = ctx.createOscillator()
      const lfoGain = ctx.createGain()
      const mainGain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(550, ctx.currentTime)

      lfo.type = 'sine'
      lfo.frequency.setValueAtTime(2.0, ctx.currentTime) // sweep cycle speed

      lfoGain.gain.setValueAtTime(250, ctx.currentTime) // sweep range +/- 250Hz

      mainGain.gain.setValueAtTime(0.3, ctx.currentTime) // Volume

      // Connect LFO modulation
      lfo.connect(lfoGain)
      lfoGain.connect(osc.frequency)

      // Connect output
      osc.connect(mainGain)
      mainGain.connect(ctx.destination)

      osc.start()
      lfo.start()

      mainOscRef.current = osc
      lfoOscRef.current = lfo
    } catch (e) {
      console.warn('Web Audio API is blocked or unsupported', e)
    }
  }

  const stopSirenSound = () => {
    try {
      if (mainOscRef.current) {
        mainOscRef.current.stop()
        mainOscRef.current.disconnect()
        mainOscRef.current = null
      }
      if (lfoOscRef.current) {
        lfoOscRef.current.stop()
        lfoOscRef.current.disconnect()
        lfoOscRef.current = null
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close()
        audioCtxRef.current = null
      }
    } catch (e) {
      console.warn('Error closing AudioContext', e)
    }
  }

  // PIN verification to cancel SOS
  const handleKeypadPress = (num: string) => {
    setPinError(false)
    if (pinInput.length < 4) {
      const updated = pinInput + num
      setPinInput(updated)
      
      if (updated === '1234') {
        // Disarm SOS
        stopSirenSound()
        onCancelSOS()
        setPinInput('')
      } else if (updated.length === 4) {
        // Wrong PIN entered
        setTimeout(() => {
          setPinError(true)
          setPinInput('')
        }, 150)
      }
    }
  }

  const handleBackspace = () => {
    setPinInput(pinInput.slice(0, -1))
  }

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => {
      stopSirenSound()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      
      {/* SOS Button Area */}
      {!isSosTriggered ? (
        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            
            {/* Pulsing Back Rings */}
            <div className={`absolute inset-0 rounded-full bg-red-500/10 ${isHolding ? 'animate-ping scale-110' : 'animate-pulse'}`}></div>
            <div className="absolute -inset-4 rounded-full bg-red-500/5 animate-pulse delay-75"></div>

            {/* Hold progress ring */}
            {isHolding && (
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="rgba(239, 68, 68, 0.2)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="80"
                  stroke="#EF4444"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 80}
                  strokeDashoffset={2 * Math.PI * 80 * (1 - holdProgress / 100)}
                />
              </svg>
            )}

            {/* Held button core */}
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className={`w-36 h-36 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-150 select-none ${
                isHolding
                  ? 'bg-red-700 scale-95 text-white'
                  : 'bg-gradient-to-br from-red-500 to-red-600 text-white hover:scale-105 active:scale-95'
              }`}
            >
              <span className="text-3xl font-black tracking-widest uppercase">SOS</span>
              <span className="text-[10px] mt-1 font-bold text-red-100 uppercase tracking-widest">
                {isHolding ? 'Hold...' : 'Hold 2s'}
              </span>
            </button>

          </div>

          <p className="text-xs text-slate-400 max-w-[280px]">
            In case of emergency, hold the SOS button down. Airport security and police dispatch will be notified immediately.
          </p>
        </div>
      ) : (
        /* Flashing SOS Broadcast Screen */
        <div className="fixed inset-0 z-50 bg-slate-900 flex flex-col items-center justify-center p-6 text-white overflow-y-auto">
          {/* Siren Light Effect Overlay */}
          <div className="absolute inset-0 bg-red-600/20 animate-pulse pointer-events-none"></div>

          <div className="text-center space-y-3 z-10 max-w-sm mb-6">
            <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto text-3xl animate-bounce">
              🚨
            </div>
            <h2 className="text-2xl font-black uppercase tracking-wider text-red-500">SOS Active</h2>
            <div className="text-xs font-semibold text-slate-300">
              Emergency details transmitted to Security Hub.
            </div>
            <div className="bg-red-950/60 border border-red-500/30 p-3 rounded-2xl text-[11px] leading-relaxed text-red-200">
              <strong>Emergency GPS:</strong> Terminal 1 Central Area<br/>
              <strong>Status:</strong> Security Response Officer dispatched (ETA: 90s)
            </div>
          </div>

          {/* Secure PIN keypad to Cancel SOS */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 w-full max-w-[280px] shadow-2xl z-10">
            <div className="text-center mb-3">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ENTER DEACTIVATION PIN</div>
              
              {/* Dot Indicators */}
              <div className="flex justify-center gap-3 my-2.5">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      pinInput.length > idx
                        ? 'bg-emerald-500 border-emerald-400 scale-110 shadow-sm'
                        : 'border-slate-600 bg-slate-900'
                    }`}
                  ></div>
                ))}
              </div>

              {pinError && (
                <div className="text-[10px] text-red-400 font-bold animate-shake">INCORRECT PIN - Siren active</div>
              )}
              {!pinError && pinInput.length === 0 && (
                <div className="text-[9px] text-slate-500">Default Test PIN: 1234</div>
              )}
            </div>

            {/* Keypad Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeypadPress(num)}
                  className="h-12 bg-slate-700 hover:bg-slate-600 text-sm font-bold rounded-xl active:bg-slate-500 transition-colors"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={handleBackspace}
                className="h-12 bg-slate-750 hover:bg-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center text-slate-400"
              >
                ⌫
              </button>
              <button
                onClick={() => handleKeypadPress('0')}
                className="h-12 bg-slate-700 hover:bg-slate-600 text-sm font-bold rounded-xl active:bg-slate-500"
              >
                0
              </button>
              <button
                onClick={() => {
                  stopSirenSound()
                  onCancelSOS()
                  setPinInput('')
                }}
                className="h-12 bg-red-950 text-red-400 hover:bg-red-900 text-[10px] font-bold rounded-xl border border-red-500/20"
              >
                TEST BYPASS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
