import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function BottomNavigation() {
  const loc = useLocation()

  const navItems = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/navigation', label: 'Navigation', icon: '🧭' },
    { to: '/baggage-guidance', label: 'Baggage', icon: '🧳' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ]

  const openAura = () => {
    window.dispatchEvent(new Event('aura-open-event'));
  };

  return (
    <>
      {/* ── Bottom Navigation Bar ─────────────────────────────────────────── */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 safe-bottom z-40"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">

          {/* Home */}
          <Link
            to={navItems[0].to}
            className={`flex-1 flex flex-col items-center gap-0.5 text-center ${loc.pathname === navItems[0].to ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
          >
            <span className="text-base leading-none">{navItems[0].icon}</span>
            <span className="text-[11px]">{navItems[0].label}</span>
          </Link>

          {/* Navigation */}
          <Link
            to={navItems[1].to}
            className={`flex-1 flex flex-col items-center gap-0.5 text-center ${loc.pathname === navItems[1].to || loc.pathname === '/heathrow-map' || loc.pathname === '/navigate' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
          >
            <span className="text-base leading-none">{navItems[1].icon}</span>
            <span className="text-[11px]">{navItems[1].label}</span>
          </Link>

          {/* ── Aura centre button ─────────────────────────────────────────── */}
          <button
            id="aura-ai-assistant-btn"
            onClick={openAura}
            className="flex-1 flex flex-col items-center focus:outline-none"
            aria-label="Open Aura AI Assistant"
          >
            <div className="relative -mt-6">
              <div
                className="mx-auto w-14 h-14 rounded-full text-white flex items-center justify-center shadow-xl font-extrabold text-sm transition-transform hover:scale-110 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
              >
                Aura
              </div>
              <div className="text-xs mt-1 text-slate-600">AI Assistant</div>
            </div>
          </button>

          {/* Baggage */}
          <Link
            to={navItems[2].to}
            className={`flex-1 flex flex-col items-center gap-0.5 text-center ${loc.pathname === navItems[2].to ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
          >
            <span className="text-base leading-none">{navItems[2].icon}</span>
            <span className="text-[11px]">{navItems[2].label}</span>
          </Link>

          {/* Profile */}
          <Link
            to={navItems[3].to}
            className={`flex-1 flex flex-col items-center gap-0.5 text-center ${loc.pathname === navItems[3].to ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
          >
            <span className="text-base leading-none">{navItems[3].icon}</span>
            <span className="text-[11px]">{navItems[3].label}</span>
          </Link>

        </div>
      </div>
    </>
  )
}

