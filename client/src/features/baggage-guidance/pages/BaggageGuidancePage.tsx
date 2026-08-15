import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Luggage, Scale, AlertTriangle, ShieldCheck, RefreshCw, CheckCircle2 } from 'lucide-react'
import LuggageCalculator from '../components/BaggageCalculator'
import TravelRules from '../components/TravelRules'
import BagTracker from '../components/BagTracker'

type TabType = 'tracker' | 'rules' | 'calculator'

export default function BaggageGuidancePage() {
  const [activeTab, setActiveTab] = useState<TabType>('tracker')

  const tabItems = [
    { id: 'tracker', label: 'Enterprise Bag Tracker', icon: Luggage, badge: 'LIVE' },
    { id: 'rules', label: 'Prohibited Items & Rules', icon: AlertTriangle },
    { id: 'calculator', label: 'Weight Allowance Tool', icon: Scale },
  ]

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-8 rounded-[28px] bg-gradient-to-br from-[#0F1E35] via-[#162742] to-[#071326] border border-white/10 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none p-6">
          <Luggage className="w-64 h-64 text-[#14C8FF]" />
        </div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-400/20 inline-flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Industrial Baggage Operations</span>
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Shipment-Style Baggage Guidance & Live Tracker
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Real-time baggage telemetry from check-in counter → TSA security → aircraft cargo hold → arrival belt.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-2 rounded-2xl bg-[#0F1E35] border border-white/10 shadow-xl flex flex-wrap gap-2">
        {tabItems.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-[#2F80FF] text-white shadow-lg shadow-blue-500/25 border border-blue-400/30'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-cyan-400/20 text-[#14C8FF] border border-cyan-400/30 rounded-full">
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl">
        {activeTab === 'tracker' && <BagTracker />}
        {activeTab === 'rules' && <TravelRules />}
        {activeTab === 'calculator' && <LuggageCalculator />}
      </div>
    </div>
  )
}
