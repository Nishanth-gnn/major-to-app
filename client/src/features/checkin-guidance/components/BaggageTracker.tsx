import React, { useState } from 'react'

interface TrackingStep {
  id: number
  title: string
  subtitle: string
  status: 'pending' | 'active' | 'completed'
  time?: string
}

export default function BaggageTracker() {
  const [bagTagId, setBagTagId] = useState(() => 'AI-' + Math.floor(100000 + Math.random() * 900000))
  const [bagsCount, setBagsCount] = useState(2)
  const [currentStepIndex, setCurrentStepIndex] = useState(2) // Defaults to "In-Transit"

  const trackingSteps: TrackingStep[] = [
    {
      id: 0,
      title: 'Baggage Checked-in',
      subtitle: 'Registered at Desk 12, Terminal 1',
      status: currentStepIndex > 0 ? 'completed' : currentStepIndex === 0 ? 'active' : 'pending',
      time: '08:45 AM'
    },
    {
      id: 1,
      title: 'Security Cleared',
      subtitle: 'Passed airport screening & sorting',
      status: currentStepIndex > 1 ? 'completed' : currentStepIndex === 1 ? 'active' : 'pending',
      time: '09:02 AM'
    },
    {
      id: 2,
      title: 'Loaded in Cargo',
      subtitle: 'Placed in cargo hold of Flight AI217',
      status: currentStepIndex > 2 ? 'completed' : currentStepIndex === 2 ? 'active' : 'pending',
      time: '09:40 AM'
    },
    {
      id: 3,
      title: 'In-Transit',
      subtitle: 'Flying from Hyderabad (HYD) to Delhi (DEL)',
      status: currentStepIndex > 3 ? 'completed' : currentStepIndex === 3 ? 'active' : 'pending',
      time: 'Active'
    },
    {
      id: 4,
      title: 'Ready for Collection',
      subtitle: 'Arrived at destination Carousel 4',
      status: currentStepIndex > 4 ? 'completed' : currentStepIndex === 4 ? 'active' : 'pending',
      time: 'Pending'
    }
  ]

  function nextStep() {
    if (currentStepIndex < 4) {
      setCurrentStepIndex(currentStepIndex + 1)
    }
  }

  function prevStep() {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1)
    }
  }

  function resetTracker() {
    setCurrentStepIndex(0)
    setBagTagId('AI-' + Math.floor(100000 + Math.random() * 900000))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Luggage Sorting & Tracker</h3>
          <p className="text-xs text-slate-400">Simulate and track the real-time status of your checked bags.</p>
        </div>
      </div>

      {/* Bag metadata cards */}
      <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
        <div>
          <div className="text-slate-400 font-semibold mb-0.5">TAG NUMBER</div>
          <div className="font-bold text-slate-800 select-all">{bagTagId}</div>
        </div>
        <div>
          <div className="text-slate-400 font-semibold mb-0.5">BAG COUNT</div>
          <div className="font-bold text-slate-800">{bagsCount} Checked Bags</div>
        </div>
        <div>
          <div className="text-slate-400 font-semibold mb-0.5">CAROUSEL</div>
          <div className="font-bold text-slate-800">
            {currentStepIndex === 4 ? (
              <span className="text-green-600 animate-bounce block">CAROUSEL 4</span>
            ) : (
              <span className="text-slate-400">TBD on Arrival</span>
            )}
          </div>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6">
        {/* Connector Line */}
        <div className="absolute left-[7px] top-2 bottom-2 w-[2px] bg-slate-100"></div>

        {trackingSteps.map((step) => {
          const isActive = step.status === 'active'
          const isCompleted = step.status === 'completed'

          return (
            <div key={step.id} className="relative flex gap-4 items-start">
              {/* Timeline Indicator */}
              <div
                className={`absolute -left-[23px] w-[16px] h-[16px] rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 shadow-sm shadow-blue-200 scale-110'
                    : isActive
                    ? 'bg-white border-blue-500 ring-4 ring-blue-50 animate-pulse scale-125'
                    : 'bg-white border-slate-200 scale-90'
                }`}
              >
                {isCompleted && (
                  <svg className="w-2.5 h-2.5 text-white mx-auto mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>

              {/* Step info */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700 font-semibold' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-50 text-blue-600 font-bold' : isCompleted ? 'bg-slate-100 text-slate-500' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {step.time}
                  </span>
                </div>
                <p className={`text-xs mt-0.5 ${isActive ? 'text-slate-600 font-medium' : isCompleted ? 'text-slate-500' : 'text-slate-400'}`}>
                  {step.subtitle}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Simulation Dashboard */}
      <div className="mt-8 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-2xl">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Luggage Simulator Controls</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="flex-1 bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-700 font-semibold py-2 px-3 rounded-lg border border-slate-200 text-xs shadow-xs"
          >
            ← Previous Stage
          </button>
          <button
            onClick={nextStep}
            disabled={currentStepIndex === 4}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2 px-3 rounded-lg text-xs shadow"
          >
            Advance Baggage →
          </button>
          <button
            onClick={resetTracker}
            className="bg-white hover:bg-slate-100 text-slate-600 font-semibold py-2 px-3 rounded-lg border border-slate-200 text-xs shadow-xs"
          >
            Reset Tag
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-3 text-center leading-relaxed">
          Simulate scans at the check-in desk, loading bays, airline flight trackers, and delivery carousels.
        </p>
      </div>
    </div>
  )
}
