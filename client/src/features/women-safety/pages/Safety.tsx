import React, { useState } from 'react'
import SOSButton from '../components/SOSButton'
import CompanionMode from '../components/CompanionMode'
import DiscreetReporter from '../components/DiscreetReporter'
import SafeSpaces from '../components/SafeSpaces'
import EmergencyHelplines from '../components/EmergencyHelplines'

type TabType = 'sos' | 'companion' | 'report' | 'spaces' | 'helplines'

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sos')
  const [isSosTriggered, setIsSosTriggered] = useState(false)

  const tabItems = [
    { id: 'sos', label: 'SOS Trigger', icon: '🚨' },
    { id: 'companion', label: 'Companion Walk', icon: '🛡️' },
    { id: 'report', label: 'Discreet Report', icon: '🔒' },
    { id: 'spaces', label: 'Safe Spaces', icon: '🏢' },
    { id: 'helplines', label: 'Helplines', icon: '📞' }
  ]

  const handleTriggerSOS = () => {
    setIsSosTriggered(true)
  }

  const handleCancelSOS = () => {
    setIsSosTriggered(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
        <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-10 text-9xl pointer-events-none select-none">
          🛡️
        </div>
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-xs uppercase tracking-widest font-black text-rose-400 bg-rose-500/10 border border-rose-400/20 px-3 py-1 rounded-full">
            Airport Security Network
          </span>
          <h2 className="text-3xl font-black tracking-tight">Women Safety & SOS Center</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Access secure areas, set up safety companion monitoring, report stalkers discreetly, or trigger the loud emergency response siren.
          </p>
        </div>
      </div>

      {/* Horizontal Tabs Menu */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-1">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-150 select-none ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white shadow-md font-bold'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Dynamic Module Content */}
      <div className="transition-all duration-300 ease-in-out">
        {activeTab === 'sos' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[300px]">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Held SOS Emergency Alarm</h3>
              <p className="text-xs text-slate-400">Trigger security sirens and share emergency coordinates with dispatch rooms.</p>
            </div>
            <SOSButton
              onTriggerSOS={handleTriggerSOS}
              onCancelSOS={handleCancelSOS}
              isSosTriggered={isSosTriggered}
            />
          </div>
        )}
        {activeTab === 'companion' && <CompanionMode onTriggerSOS={handleTriggerSOS} />}
        {activeTab === 'report' && <DiscreetReporter />}
        {activeTab === 'spaces' && <SafeSpaces />}
        {activeTab === 'helplines' && <EmergencyHelplines />}
      </div>
    </div>
  )
}
