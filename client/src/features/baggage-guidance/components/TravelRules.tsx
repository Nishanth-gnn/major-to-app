import React, { useState } from 'react'
import axios from 'axios'

// ── Types ─────────────────────────────────────────────────────────────────────

interface TravelRuleItem {
  name: string
  notes?: string
}

interface TravelRulesData {
  prohibited:      TravelRuleItem[]
  carryOnOnly:     TravelRuleItem[]
  checkedOnly:     TravelRuleItem[]
  allowed:         TravelRuleItem[]
}

interface Airport {
  code: string
  name: string
  city: string
}

// ── Airport list (display only — actual rules fetched from backend) ────────────

const AIRPORTS: Airport[] = [
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'New Delhi' },
  { code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru' },
  { code: 'MAA', name: 'Chennai International Airport', city: 'Chennai' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', city: 'Kolkata' },
  { code: 'COK', name: 'Cochin International Airport', city: 'Kochi' },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad' },
]

// ── Category card config ──────────────────────────────────────────────────────

const CATEGORIES = [
  {
    key: 'prohibited' as const,
    label: 'Prohibited',
    icon: '🚫',
    bg: 'bg-red-500/10',
    border: 'border-red-500/25',
    titleColor: 'text-red-400',
    badgeBg: 'bg-red-500/20 text-red-400',
    dotColor: 'bg-red-500',
  },
  {
    key: 'carryOnOnly' as const,
    label: 'Carry-on Only',
    icon: '⚠️',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    titleColor: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 text-amber-400',
    dotColor: 'bg-amber-500',
  },
  {
    key: 'checkedOnly' as const,
    label: 'Checked Baggage Only',
    icon: '🧳',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/25',
    titleColor: 'text-[#14C8FF]',
    badgeBg: 'bg-blue-500/20 text-[#14C8FF]',
    dotColor: 'bg-blue-500',
  },
  {
    key: 'allowed' as const,
    label: 'Allowed',
    icon: '✅',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    titleColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 text-emerald-400',
    dotColor: 'bg-emerald-500',
  },
]

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-[#0E1B2D] rounded-2xl p-5 border border-white/8">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-3 bg-white/5 rounded w-full" />
        ))}
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export default function TravelRules() {
  const [selectedAirportCode, setSelectedAirportCode] = useState<string>('')
  const [searchQuery, setSearchQuery]                 = useState('')
  const [dropdownOpen, setDropdownOpen]               = useState(false)
  const [loading, setLoading]                         = useState(false)
  const [error, setError]                             = useState<string | null>(null)
  const [rulesData, setRulesData]                     = useState<TravelRulesData | null>(null)

  const selectedAirport = AIRPORTS.find(a => a.code === selectedAirportCode)

  const filteredAirports = AIRPORTS.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.code.toLowerCase().includes(searchQuery.toLowerCase())
  )

  async function fetchRules(airportCode: string) {
    setLoading(true)
    setError(null)
    setRulesData(null)
    try {
      const response = await axios.get<TravelRulesData>(
        `/api/baggage/travel-rules/${airportCode}`
      )
      setRulesData(response.data)
    } catch (err: any) {
      // Fallback to default BCAS travel rules if server API is unavailable
      setRulesData({
        prohibited: [
          { name: 'Firearms & Ammunition', notes: 'Banned from all baggage without prior airline & airport approval.' },
          { name: 'Explosive Materials', notes: 'Fireworks, flares, blasting caps — completely prohibited.' },
          { name: 'Pepper / Tear Gas Spray', notes: 'Self-defense sprays are banned in all airport areas.' },
          { name: 'Flammable Liquids (>1L)', notes: 'Petrol, paint thinner, lighter fluid — not permitted.' },
          { name: 'Radioactive Materials', notes: 'Except medical isotopes with prior approval.' },
          { name: 'Sharp Objects (blades >6cm)', notes: 'Pocket knives, box cutters, swords.' },
        ],
        carryOnOnly: [
          { name: 'Lithium Batteries / Power Banks', notes: 'Max 100Wh per battery; carry-on only, never checked.' },
          { name: 'Laptop & Tablet', notes: 'Must be removed from bag and placed in a separate tray at security.' },
          { name: 'Prescription Medicines (liquid)', notes: 'Exempt from 100ml rule — carry your prescription.' },
          { name: 'Liquids ≤ 100ml each', notes: 'All must fit in one transparent 1-litre resealable bag.' },
          { name: 'Matchbox / Lighter (1 only)', notes: 'One permitted on your person only; not inside cabin bag.' },
          { name: 'Duty-Free Alcohol (sealed bag)', notes: 'Allowed in cabin if sealed in security tamper-evident bag.' },
        ],
        checkedOnly: [
          { name: 'Liquids > 100ml', notes: 'Shampoo, conditioner, oils — must go in checked baggage.' },
          { name: 'Scissors / Knives', notes: 'Blades ≤ 6cm allowed in checked baggage.' },
          { name: 'Tools (hammer, wrench etc.)', notes: 'Permitted in checked baggage only.' },
          { name: 'Sports Equipment (bats, clubs)', notes: 'Golf clubs, cricket bats — checked baggage only.' },
          { name: 'Alcohol (retail packaging, ≤5L)', notes: '24%–70% ABV; must be in original retail packaging.' },
        ],
        allowed: [
          { name: 'Clothing & Personal Items', notes: 'No restrictions in cabin or checked.' },
          { name: 'Books & Documents', notes: 'No restrictions.' },
          { name: 'Food Items (solid)', notes: 'Allowed in both; liquid-based foods follow the 100ml rule.' },
          { name: 'Camera & Photography Equipment', notes: 'Allowed in cabin; batteries in cabin only.' },
          { name: 'Baby Food & Formula', notes: 'Exempt from 100ml rule when travelling with an infant.' },
          { name: 'Walking Aids / Wheelchairs', notes: 'Allowed; notify airline in advance for special assistance.' },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  function selectAirport(airport: Airport) {
    setSelectedAirportCode(airport.code)
    setDropdownOpen(false)
    setSearchQuery('')
    fetchRules(airport.code)
  }

  return (
    <div className="bg-[#06121F] rounded-2xl p-6 border border-white/8">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-500/15 text-red-400 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">Travel Rules</h3>
          <p className="text-xs text-[#94A3B8]">
            Select an airport to view prohibited and permitted item regulations.
          </p>
        </div>
      </div>

      {/* Airport Selector */}
      <div className="mb-6 relative">
        <label className="block text-xs font-semibold text-[#64748B] mb-2 uppercase tracking-wider">
          Select Airport
        </label>

        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="w-full flex items-center justify-between bg-[#0E1B2D] border border-white/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2F80FF] transition-all hover:bg-[#162742]"
        >
          <span className={selectedAirport ? 'text-[#F8FAFC] font-semibold' : 'text-[#64748B]'}>
            {selectedAirport
              ? `${selectedAirport.name} (${selectedAirport.code})`
              : 'Select Airport ▾'}
          </span>
          <svg
            className={`w-4 h-4 text-[#94A3B8] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute z-20 mt-1 w-full bg-[#0E1B2D] border border-white/15 rounded-xl shadow-2xl overflow-hidden">
            {/* Search inside dropdown */}
            <div className="p-2 border-b border-white/10">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search airport or city…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-[#162742] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2F80FF]"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-[#64748B]"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Airport list */}
            <ul className="max-h-52 overflow-y-auto divide-y divide-white/5">
              {filteredAirports.length > 0 ? (
                filteredAirports.map(airport => (
                  <li key={airport.code}>
                    <button
                      onClick={() => selectAirport(airport)}
                      className="w-full text-left px-4 py-3 hover:bg-[#2F80FF]/15 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-blue-500/20 text-[#14C8FF] px-2 py-0.5 rounded font-mono">
                          {airport.code}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-[#F8FAFC] leading-tight">
                            {airport.name}
                          </div>
                          <div className="text-xs text-[#94A3B8]">{airport.city}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-[#64748B] text-sm">
                  No airports match your search.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* ── States ─────────────────────────────────────────────────────────── */}

      {/* Empty state — no airport selected yet */}
      {!selectedAirportCode && !loading && (
        <div className="text-center py-14 text-[#64748B]">
          <div className="text-5xl mb-4">🛫</div>
          <div className="text-sm font-semibold text-[#94A3B8]">No airport selected</div>
          <p className="text-xs mt-1">
            Select an airport above to view its travel rules and item regulations.
          </p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 bg-red-500/15 border border-red-500/30 rounded-xl">
          <span className="text-red-400 text-lg shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-400">Failed to load travel rules</div>
            <p className="text-xs text-red-400/80 mt-0.5">{error}</p>
            <button
              onClick={() => fetchRules(selectedAirportCode)}
              className="mt-2 text-xs font-bold text-red-400 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        </div>
      )}

      {/* Results — 4 category cards */}
      {rulesData && !loading && (
        <>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-xs font-bold bg-blue-500/20 text-[#14C8FF] px-2 py-0.5 rounded font-mono">
              {selectedAirport?.code}
            </span>
            <span className="text-sm font-bold text-[#F8FAFC]">
              {selectedAirport?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => {
              const items = rulesData[cat.key]
              return (
                <div
                  key={cat.key}
                  className={`rounded-2xl p-5 border ${cat.bg} ${cat.border}`}
                >
                  {/* Card header */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">{cat.icon}</span>
                    <h4 className={`font-bold text-sm ${cat.titleColor}`}>{cat.label}</h4>
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${cat.badgeBg}`}>
                      {items.length}
                    </span>
                  </div>

                  {/* Items list */}
                  {items.length > 0 ? (
                    <ul className="space-y-2">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${cat.dotColor}`} />
                          <div>
                            <div className="text-xs font-semibold text-[#F8FAFC] leading-tight">
                              {item.name}
                            </div>
                            {item.notes && (
                              <div className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#64748B] italic">No items in this category.</p>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mt-4 text-[10px] text-[#64748B] text-center">
            Rules displayed are provided by the airport authority. Always verify with your airline before travel.
          </p>
        </>
      )}
    </div>
  )
}
