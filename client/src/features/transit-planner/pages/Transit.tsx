import React from 'react'
import TransitCountdown from '../components/TransitCountdown'
import FlightTimeline from '../components/FlightTimeline'

export default function TransitPage(){
  const target = new Date(Date.now() + 1000 * 60 * 18).toISOString() // 18 minutes
  const timeline = [
    { time: '08:00', label: 'Depart home' },
    { time: '09:30', label: 'Arrive airport' },
    { time: '10:15', label: 'Security' },
    { time: '11:00', label: 'Boarding' },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-56 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.14),_transparent_60%)]" />
      <div className="relative mx-auto max-w-5xl space-y-5">
        <header className="rounded-3xl bg-white/95 p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 backdrop-blur sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">Transit planner</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Plan airport arrival and boarding flow</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Track the countdown, review the day timeline, and keep the trip plan readable on a mobile screen.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
          <section className="rounded-3xl bg-white p-5 shadow-[0_20px_60px_-36px_rgba(15,23,42,0.45)] ring-1 ring-slate-100 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">Trip overview</p>
            <div className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              Plan your transit to the airport and pickup/dropoff options.
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Best arrival window</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">90 minutes before boarding</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Travel mode</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">Airport transfer ready</div>
              </div>
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <TransitCountdown targetIso={target} />
            <FlightTimeline items={timeline} />
          </aside>
        </div>
      </div>
    </div>
  )
}
