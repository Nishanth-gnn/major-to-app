import React, { useState, useEffect } from 'react'
import axios from 'axios'

// ── Types ─────────────────────────────────────────────────────────────────────

interface BagTag {
  tag: string
}

interface BagStatus {
  bagTag:            string
  currentStatus:     string
  eta:               string
  lastUpdated:       string
  lastScanLocation:  string
  expectedBelt:      string
  timeline:          TimelineStep[]
}

interface TimelineStep {
  label:     string
  completed: boolean
  active:    boolean
  time?:     string
}

// ── Timeline step component ───────────────────────────────────────────────────

function TimelineItem({ step, isLast }: { step: TimelineStep; isLast: boolean }) {
  return (
    <div className="flex gap-4 relative">
      {/* Connector line */}
      {!isLast && (
        <div
          className={`absolute left-[11px] top-6 bottom-0 w-0.5 ${
            step.completed ? 'bg-blue-300' : 'bg-slate-200'
          }`}
        />
      )}

      {/* Dot indicator */}
      <div className="shrink-0 mt-0.5">
        {step.completed ? (
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ) : step.active ? (
          <div className="w-6 h-6 rounded-full border-2 border-blue-500 bg-white ring-4 ring-blue-50 animate-pulse" />
        ) : (
          <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white" />
        )}
      </div>

      {/* Step content */}
      <div className="pb-6 flex-1">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm font-bold ${
              step.active ? 'text-blue-600' : step.completed ? 'text-slate-700' : 'text-slate-400'
            }`}
          >
            {step.label}
          </span>
          {step.time && (
            <span
              className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                step.active
                  ? 'bg-blue-50 text-blue-600'
                  : step.completed
                  ? 'bg-slate-100 text-slate-500'
                  : 'bg-slate-50 text-slate-400'
              }`}
            >
              {step.time}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Status report modal/panel ─────────────────────────────────────────────────

function StatusReport({
  status,
  onClose,
}: {
  status: BagStatus
  onClose: () => void
}) {
  return (
    <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Report header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between">
        <div>
          <div className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">Baggage Status Report</div>
          <div className="text-white font-extrabold text-base font-mono mt-0.5">{status.bagTag}</div>
        </div>
        <button
          onClick={onClose}
          className="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-5">
        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Current Status',     value: status.currentStatus,    highlight: true },
            { label: 'ETA',                value: status.eta,              highlight: false },
            { label: 'Last Scan Location', value: status.lastScanLocation, highlight: false },
            { label: 'Expected Belt',      value: status.expectedBelt,     highlight: false },
            { label: 'Last Updated',       value: status.lastUpdated,      highlight: false },
          ].map(info => (
            <div
              key={info.label}
              className={`p-3 rounded-xl border ${
                info.highlight
                  ? 'bg-blue-50 border-blue-200 col-span-2'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
                {info.label}
              </div>
              <div className={`text-sm font-bold ${info.highlight ? 'text-blue-700' : 'text-slate-800'}`}>
                {info.value}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Timeline */}
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
            Progress Timeline
          </div>
          <div className="relative">
            {status.timeline.map((step, idx) => (
              <TimelineItem key={idx} step={step} isLast={idx === status.timeline.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Bag card ──────────────────────────────────────────────────────────────────

function BagCard({
  bag,
  bagNumber,
}: {
  bag: BagTag
  bagNumber: number
}) {
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)
  const [status, setStatus]     = useState<BagStatus | null>(null)

  async function checkStatus() {
    setLoading(true)
    setError(null)
    setStatus(null)
    try {
      const response = await axios.get<BagStatus>(
        `/api/baggage/status/${encodeURIComponent(bag.tag)}`
      )
      setStatus(response.data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        'Unable to fetch bag status. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Card body */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">
              Bag {bagNumber}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="7" width="16" height="13" rx="2" ry="2" />
                  <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Tag Number</div>
                <div className="text-base font-black text-slate-800 font-mono tracking-wide">{bag.tag}</div>
              </div>
            </div>
          </div>

          {status && (
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full">
              {status.currentStatus}
            </span>
          )}
        </div>

        {/* Check Status button */}
        <button
          onClick={checkStatus}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait text-white font-bold rounded-xl text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Checking Status…
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Check Status
            </>
          )}
        </button>

        {/* Inline error */}
        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
            <span className="text-red-500 shrink-0">⚠️</span>
            <p className="text-xs text-red-600 font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Status report */}
      {status && (
        <div className="px-5 pb-5">
          <StatusReport status={status} onClose={() => setStatus(null)} />
        </div>
      )}
    </div>
  )
}

// ── Main BagTracker component ─────────────────────────────────────────────────

export default function BagTracker() {
  const [bags, setBags]       = useState<BagTag[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    async function fetchBags() {
      try {
        const response = await axios.get<BagTag[]>('/api/baggage/tags')
        setBags(response.data)
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          'Unable to fetch your bag tags. Please log in and try again.'
        )
      } finally {
        setLoading(false)
      }
    }
    fetchBags()
  }, [])

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Bag Tracker</h3>
          <p className="text-xs text-slate-400">
            View all your checked bags and get real-time status updates.
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse bg-slate-50 rounded-2xl border border-slate-100 p-5">
              <div className="h-4 bg-slate-200 rounded w-1/4 mb-3" />
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-4" />
              <div className="h-10 bg-slate-100 rounded-xl w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
          <span className="text-red-500 text-lg shrink-0">⚠️</span>
          <div>
            <div className="text-sm font-bold text-red-700">Unable to load bags</div>
            <p className="text-xs text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && bags.length === 0 && (
        <div className="text-center py-14 text-slate-400">
          <div className="text-5xl mb-4">🧳</div>
          <div className="text-sm font-semibold text-slate-600">No checked bags found</div>
          <p className="text-xs mt-1">
            Your checked bags will appear here once your boarding pass is scanned.
          </p>
        </div>
      )}

      {/* Bag cards */}
      {!loading && !error && bags.length > 0 && (
        <div className="space-y-4">
          {bags.map((bag, idx) => (
            <BagCard key={bag.tag} bag={bag} bagNumber={idx + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
