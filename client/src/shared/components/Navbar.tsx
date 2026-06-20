import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Navbar(){
  const linkClass = (isActive: boolean) =>
    `px-3 py-2 rounded ${isActive ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-slate-100'}`

  return (
    <nav className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center gap-3">
            <div className="text-xl font-semibold">Smart Airport</div>
            <div className="hidden md:flex items-center gap-1">
              <NavLink to="/" end className={({isActive})=>linkClass(isActive)}>Home</NavLink>
              <NavLink to="/navigate" className={({isActive})=>linkClass(isActive)}>Navigate</NavLink>
              <NavLink to="/chat" className={({isActive})=>linkClass(isActive)}>Aura</NavLink>
              <NavLink to="/transit" className={({isActive})=>linkClass(isActive)}>Flights</NavLink>
              <NavLink to="/luggage" className={({isActive})=>linkClass(isActive)}>Luggage</NavLink>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <NavLink to="/profile" className={({isActive})=>linkClass(isActive)}>Profile</NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}
