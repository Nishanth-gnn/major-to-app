import React, { useState } from 'react'

interface SafeSpace {
  id: string
  title: string
  location: string
  category: 'lounge' | 'nursing' | 'police' | 'zone'
  securityLevel: string
  accessCode: string
  details: string
  amenities: string[]
}

const SPACES: SafeSpace[] = [
  {
    id: 'lounge1',
    title: 'All-Women Premium Lounge',
    location: 'Terminal 1, Departure Level (Near Gate B4)',
    category: 'lounge',
    securityLevel: 'CCTV + Guard on Entry',
    accessCode: 'Free for women boarding flights',
    details: 'A clean, well-lit secure relaxation zone with charging points, tea/coffee, and comfortable lounge beds, strictly reserved for women travelers.',
    amenities: ['Secure access lock', 'Female security guards', 'Comfortable couches', 'Free refreshments']
  },
  {
    id: 'nursing1',
    title: 'Baby Care & Secure Lactation Lounge',
    location: 'Terminal 1, Security Area (Opposite Duty Free)',
    category: 'nursing',
    securityLevel: 'Smart Card Access Control',
    accessCode: 'Request code at Information Desk',
    details: 'Quiet private nursery room equipped with changing tables, diapers, nursing chairs, and a hand sanitizing station. Restricted access to women only.',
    amenities: ['Lockable private cubicles', 'Diaper disposals', 'Hot water dispenser', 'Air conditioned']
  },
  {
    id: 'kiosk1',
    title: 'All-Women Police Assistance Kiosk',
    location: 'Arrival Hall Plaza (Next to Exit Gate 3)',
    category: 'police',
    securityLevel: 'Active Police Booth',
    accessCode: 'No registration needed',
    details: 'Dedicated police help desk managed by female airport security officers. Head here for quick physical assistance, filing complaints, or taxi security verification.',
    amenities: ['24/7 staffing', 'Emergency radio connection', 'Taxi number tracking log']
  },
  {
    id: 'zone1',
    title: 'Well-Lit "Safe Haven" Zone',
    location: 'Terminal 1, Lower Mezzanine (Gate B12 corridor)',
    category: 'zone',
    securityLevel: 'High-density CCTV coverage',
    accessCode: 'Open public area',
    details: 'Specially designated waiting corridor monitored continuously by airport control room staff. Perfect for solo travelers during long night layovers.',
    amenities: ['Pan-tilt-zoom camera focus', 'Direct emergency hotline phone', 'Bright daylight lighting']
  }
]

export default function SafeSpaces() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'lounge' | 'nursing' | 'police' | 'zone'>('all')

  const filtered = SPACES.filter(s => activeCategory === 'all' || s.category === activeCategory)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Airport Safe Spaces Directory</h3>
          <p className="text-xs text-slate-400">Locate secure lounges, lactation rooms, emergency desks, and well-lit corridor zones.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['all', 'lounge', 'nursing', 'police', 'zone'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
            }`}
          >
            {cat === 'all' ? 'All Spaces' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
        {filtered.map((space) => (
          <div key={space.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition">
            <div className="flex justify-between items-start gap-2.5 mb-2.5">
              <div>
                <h4 className="text-xs font-bold text-slate-800">{space.title}</h4>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{space.location}</p>
              </div>
              <span className="text-[9px] uppercase font-bold px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full shrink-0">
                {space.category}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">{space.details}</p>

            <div className="grid grid-cols-2 gap-3 mb-3 text-[10px] border-t border-slate-200/50 pt-3">
              <div>
                <div className="text-slate-400 font-semibold uppercase tracking-wider mb-0.5">SECURITY</div>
                <div className="font-bold text-slate-700">{space.securityLevel}</div>
              </div>
              <div>
                <div className="text-slate-400 font-semibold uppercase tracking-wider mb-0.5">ENTRY POLICY</div>
                <div className="font-bold text-slate-700">{space.accessCode}</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {space.amenities.map((am, idx) => (
                <span key={idx} className="bg-white border border-slate-150 rounded px-2 py-0.5 text-[9px] font-medium text-slate-600">
                  {am}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
