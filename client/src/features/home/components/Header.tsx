import React from 'react'
import { user } from '../../../data/homeMockData'
import { useDarkMode } from '../../../shared/hooks/useDarkMode'

export default function Header({ name = user.name, airport = user.airport, terminal = user.terminal, minimal = false }: { name?: string; airport?: string; terminal?: string; minimal?: boolean }){
  const { isDark, toggleDarkMode } = useDarkMode()

  return (
    <div className={`flex items-center ${minimal ? 'justify-end' : 'justify-between'}`}>
      {!minimal && (
        <div className="flex items-start gap-3">
          <button className="p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Good Morning, 👋</div>
            <div className="font-semibold text-lg text-slate-900 dark:text-slate-100">{name}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{airport} | Terminal {terminal}</div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* ── Dark Mode Toggle ───────────────────────────────────── */}
        <button
          id="dark-mode-toggle-btn"
          type="button"
          onClick={toggleDarkMode}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
          className={`relative flex h-9 w-16 items-center rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isDark
              ? 'bg-slate-700 focus:ring-slate-500'
              : 'bg-slate-200 focus:ring-sky-400'
          }`}
        >
          {/* Track icons */}
          <span className="absolute left-1.5 text-xs" aria-hidden="true">🌙</span>
          <span className="absolute right-1.5 text-xs" aria-hidden="true">☀️</span>

          {/* Sliding knob */}
          <span
            className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
              isDark ? 'translate-x-7' : 'translate-x-0'
            }`}
          >
            {isDark ? (
              /* Moon icon */
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-slate-700" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
              </svg>
            ) : (
              /* Sun icon */
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-amber-500" aria-hidden="true">
                <circle cx="12" cy="12" r="5" fill="currentColor"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </span>
        </button>

        {!minimal && (
          <>
            {/* Notification bell */}
            <button className="relative p-2 rounded-full bg-white dark:bg-slate-800 shadow transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">3</span>
            </button>

            {/* Avatar */}
            <div className="relative w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
              <img src={localStorage.getItem('avatar') || user.avatar} alt="avatar" className="w-full h-full object-cover" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-white dark:ring-slate-800" />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
