import React, { useState } from 'react'
import LuggageCalculator from '../components/BaggageCalculator'
import TravelRules from '../components/TravelRules'
import BagTracker from '../components/BagTracker'

type TabType = 'rules' | 'calculator' | 'tracker'

export default function BaggageGuidancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('rules')

  const tabItems = [
    { id: 'rules',      label: 'Travel Rules',       icon: '🚫' },
    { id: 'calculator', label: 'Luggage Calculator',  icon: '⚖️' },
    { id: 'tracker',    label: 'Bag Tracker',         icon: '🏷️' },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-9xl pointer-events-none select-none">
          🧳
        </div>
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs uppercase tracking-widest font-black text-blue-400 bg-blue-500/10 border border-blue-400/20 px-3 py-1 rounded-full">
            Baggage Guidance
          </span>
          <h2 className="text-3xl font-black tracking-tight">Smart Baggage Guidance</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Check travel rules by airport, calculate baggage allowance, and track your checked bags in real time.
          </p>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-1">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-150 select-none ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === 'rules'      && <TravelRules />}
        {activeTab === 'calculator' && <LuggageCalculator />}
        {activeTab === 'tracker'    && <BagTracker />}
      </div>
    </div>
  )
}
