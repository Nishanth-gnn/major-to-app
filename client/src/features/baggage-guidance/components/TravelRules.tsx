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
    bg: 'bg-red-50',
    border: 'border-red-200',
    titleColor: 'text-red-700',
    badgeBg: 'bg-red-100 text-red-700',
    dotColor: 'bg-red-500',
  },
  {
    key: 'carryOnOnly' as const,
    label: 'Carry-on Only',
    icon: '⚠️',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    titleColor: 'text-amber-700',
    badgeBg: 'bg-amber-100 text-amber-700',
    dotColor: 'bg-amber-500',
  },
  {
    key: 'checkedOnly' as const,
    label: 'Checked Baggage Only',
    icon: '🧳',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    titleColor: 'text-blue-700',
    badgeBg: 'bg-blue-100 text-blue-700',
    dotColor: 'bg-blue-500',
  },
  {
    key: 'allowed' as const,
    label: 'Allowed',
    icon: '✅',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    titleColor: 'text-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    dotColor: 'bg-emerald-500',
  },
]

// ── Skeleton loader ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="animate-pulse bg-white rounded-2xl p-5 border border-slate-100">
      <div className="h-4 bg-slate-200 rounded w-1/3 mb-4" />
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-3 bg-slate-100 rounded w-full" />
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
      setError(
        err?.response?.data?.message ||
        'Unable to fetch travel rules. Please try again.'
      )
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Travel Rules</h3>
          <p className="text-xs text-slate-400">
            Select an airport to view prohibited and permitted item regulations.
          </p>
        </div>
      </div>

      {/* Airport Selector */}
      <div className="mb-6 relative">
        <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
          Select Airport
        </label>

        <button
          onClick={() => setDropdownOpen(prev => !prev)}
          className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all hover:bg-white"
        >
          <span className={selectedAirport ? 'text-slate-800 font-semibold' : 'text-slate-400'}>
            {selectedAirport
              ? `${selectedAirport.name} (${selectedAirport.code})`
              : 'Select Airport ▾'}
          </span>
          <svg
            className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {dropdownOpen && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
            {/* Search inside dropdown */}
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search airport or city…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" strokeWidth="2" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Airport list */}
            <ul className="max-h-52 overflow-y-auto divide-y divide-slate-50">
              {filteredAirports.length > 0 ? (
                filteredAirports.map(airport => (
                  <li key={airport.code}>
                    <button
                      onClick={() => selectAirport(airport)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                          {airport.code}
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-800 leading-tight">
                            {airport.name}
                          </div>
                          <div className="text-xs text-slate-400">{airport.city}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-6 text-center text-slate-400 text-sm">
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
        <div className="text-center py-14 text-slate-400">
          <div className="text-5xl mb-4">🛫</div>
          <div className="text-sm font-semibold text-slate-600">No airport selected</div>
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
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-500 text-lg shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-700">Failed to load travel rules</div>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
            <button
              onClick={() => fetchRules(selectedAirportCode)}
              className="mt-2 text-xs font-bold text-red-700 underline hover:no-underline"
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
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
              {selectedAirport?.code}
            </span>
            <span className="text-sm font-bold text-slate-700">
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
                            <div className="text-xs font-semibold text-slate-800 leading-tight">
                              {item.name}
                            </div>
                            {item.notes && (
                              <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No items in this category.</p>
                  )}
                </div>
              )
            })}
          </div>

          <p className="mt-4 text-[10px] text-slate-400 text-center">
            Rules displayed are provided by the airport authority. Always verify with your airline before travel.
          </p>
        </>
      )}
    </div>
  )
}
