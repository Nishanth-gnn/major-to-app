import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Plane,
  Luggage,
  Train,
  Grid,
  MapPin,
  Utensils,
  ShieldAlert,
  User,
  Sparkles,
} from 'lucide-react'

export interface NavZone {
  id: string
  label: string
  path: string
  icon: any
  badge?: string
  exact?: boolean
}

export const ENTERPRISE_ZONES: NavZone[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    id: 'flights',
    label: 'Flights',
    path: '/flight-tracking',
    icon: Plane,
    badge: 'LIVE',
  },
  {
    id: 'baggage',
    label: 'Baggage',
    path: '/baggage-guidance',
    icon: Luggage,
  },
  {
    id: 'transit',
    label: 'Transit',
    path: '/transit-services',
    icon: Train,
  },
  {
    id: 'services',
    label: 'Services',
    path: '/profile',
    icon: Grid,
  },
]

export default function EnterpriseNavigation() {
  const location = useLocation()

  return (
    <>
      {/* ── Mobile Bottom Navigation Bar (Fixed bottom for screens < 1024px) ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-panel border-t border-white/10 safe-bottom shadow-2xl bg-[#06121F]/95 backdrop-blur-xl"
        aria-label="Mobile Navigation Bar"
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-md mx-auto">
          {ENTERPRISE_ZONES.map((zone) => {
            const Icon = zone.icon
            const isActive = zone.exact
              ? location.pathname === zone.path
              : location.pathname.startsWith(zone.path)

            return (
              <NavLink
                key={zone.id}
                to={zone.path}
                className={({ isActive }) =>
                  `relative flex flex-col items-center justify-center w-full h-full py-1 rounded-2xl transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'text-[#2F80FF] font-bold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`
                }
              >
                {isActive && (
                  <div className="absolute top-1 w-8 h-1 rounded-full bg-[#2F80FF] shadow-sm shadow-blue-500/50" />
                )}
                <div className="relative mt-1">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {zone.badge && (
                    <span className="absolute -top-1 -right-2 px-1 py-0.2 text-[8px] font-extrabold bg-[#2F80FF] text-white rounded-full">
                      {zone.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium tracking-tight mt-0.5">{zone.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}
