import React from 'react';

export default function AirportSVG() {
  return (
    <svg 
      className="absolute inset-0 w-full h-full text-slate-200 pointer-events-none" 
      viewBox="0 0 800 800" 
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Soft shadow for the terminal layout */}
        <filter id="terminal-shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="10" stdDeviation="15" floodColor="#0f172a" floodOpacity="0.05" />
        </filter>
        {/* Grid pattern for the floor */}
        <pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
        </pattern>
      </defs>

      {/* Main Terminal Outer Boundary */}
      <path 
        d="M 300 750 L 500 750 L 500 450 L 750 450 L 750 150 L 650 50 L 150 50 L 50 150 L 50 450 L 300 450 Z" 
        fill="#ffffff" 
        filter="url(#terminal-shadow)" 
        stroke="#e2e8f0" 
        strokeWidth="2" 
      />
      
      {/* Floor Grid Pattern */}
      <path 
        d="M 300 750 L 500 750 L 500 450 L 750 450 L 750 150 L 650 50 L 150 50 L 50 150 L 50 450 L 300 450 Z" 
        fill="url(#floor-grid)" 
      />

      {/* Security & Check-in Zones (Light tint) */}
      <rect x="320" y="500" width="160" height="100" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
      <text x="400" y="555" textAnchor="middle" fill="#94a3b8" fontSize="12" className="uppercase tracking-widest font-semibold">Security</text>

      <rect x="320" y="650" width="160" height="80" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 4" />
      <text x="400" y="695" textAnchor="middle" fill="#94a3b8" fontSize="12" className="uppercase tracking-widest font-semibold">Check-in</text>

      {/* West Wing Walls */}
      <path d="M 50 150 L 150 150 L 150 300 L 280 300 L 280 450" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <path d="M 50 450 L 300 450" fill="none" stroke="#e2e8f0" strokeWidth="3" />

      {/* East Wing Walls */}
      <path d="M 750 150 L 650 150 L 650 300 L 520 300 L 520 450" fill="none" stroke="#e2e8f0" strokeWidth="3" />
      <path d="M 750 450 L 500 450" fill="none" stroke="#e2e8f0" strokeWidth="3" />

      {/* North / Center Features */}
      <rect x="320" y="100" width="160" height="300" rx="16" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
      <text x="400" y="250" textAnchor="middle" fill="#94a3b8" fontSize="14" className="uppercase tracking-widest font-bold">Duty Free</text>

      {/* Gates Indicative Markers (subtle shapes) */}
      <circle cx="100" cy="400" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="100" cy="250" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="200" cy="150" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      
      <circle cx="400" cy="100" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="500" cy="100" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

      <circle cx="700" cy="400" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
      <circle cx="700" cy="250" r="25" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

    </svg>
  );
}
