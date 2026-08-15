import React, { useState } from 'react'

interface AirlineRule {
  name: string
  cabinMaxWeight: number // in kg
  cabinMaxDims: [number, number, number] // L, W, H in cm
  checkedMaxWeight: number // in kg
  checkedMaxDims: number // total linear dimensions (L+W+H) in cm
  excessFeePerKg: number // in INR
  currency: string
}

const AIRLINE_RULES: Record<string, Record<string, AirlineRule>> = {
  indigo: {
    economy: {
      name: 'IndiGo (Economy)',
      cabinMaxWeight: 7,
      cabinMaxDims: [55, 35, 25],
      checkedMaxWeight: 15,
      checkedMaxDims: 158,
      excessFeePerKg: 550,
      currency: '₹'
    },
    business: {
      name: 'IndiGo (Flexi)',
      cabinMaxWeight: 7,
      cabinMaxDims: [55, 35, 25],
      checkedMaxWeight: 25,
      checkedMaxDims: 158,
      excessFeePerKg: 550,
      currency: '₹'
    }
  },
  airindia: {
    economy: {
      name: 'Air India (Economy)',
      cabinMaxWeight: 8,
      cabinMaxDims: [55, 35, 25],
      checkedMaxWeight: 20,
      checkedMaxDims: 158,
      excessFeePerKg: 600,
      currency: '₹'
    },
    business: {
      name: 'Air India (Business)',
      cabinMaxWeight: 12,
      cabinMaxDims: [55, 35, 25],
      checkedMaxWeight: 35,
      checkedMaxDims: 158,
      excessFeePerKg: 600,
      currency: '₹'
    }
  },
  emirates: {
    economy: {
      name: 'Emirates (Economy)',
      cabinMaxWeight: 7,
      cabinMaxDims: [55, 38, 20],
      checkedMaxWeight: 23,
      checkedMaxDims: 150,
      excessFeePerKg: 1250,
      currency: '₹'
    },
    business: {
      name: 'Emirates (Business)',
      cabinMaxWeight: 10,
      cabinMaxDims: [55, 38, 20],
      checkedMaxWeight: 40,
      checkedMaxDims: 150,
      excessFeePerKg: 1250,
      currency: '₹'
    }
  },
  lufthansa: {
    economy: {
      name: 'Lufthansa (Economy)',
      cabinMaxWeight: 8,
      cabinMaxDims: [55, 40, 23],
      checkedMaxWeight: 23,
      checkedMaxDims: 158,
      excessFeePerKg: 1200,
      currency: '₹'
    },
    business: {
      name: 'Lufthansa (Business)',
      cabinMaxWeight: 16, // 2 bags of 8kg each
      cabinMaxDims: [55, 40, 23],
      checkedMaxWeight: 32,
      checkedMaxDims: 158,
      excessFeePerKg: 1200,
      currency: '₹'
    }
  }
}

export default function BaggageCalculator() {
  const [airline, setAirline] = useState('indigo')
  const [ticketClass, setTicketClass] = useState('economy')

  // Cabin Bag inputs
  const [cabinWeight, setCabinWeight] = useState(6)
  const [cabinL, setCabinL] = useState(50)
  const [cabinW, setCabinW] = useState(30)
  const [cabinH, setCabinH] = useState(20)

  // Checked Bag inputs
  const [checkedWeight, setCheckedWeight] = useState(14)
  const [checkedL, setCheckedL] = useState(70)
  const [checkedW, setCheckedW] = useState(45)
  const [checkedH, setCheckedH] = useState(28)

  const activeRule = AIRLINE_RULES[airline]?.[ticketClass] || AIRLINE_RULES.indigo.economy

  // Calculations
  const isCabinWeightOk = cabinWeight <= activeRule.cabinMaxWeight
  const isCabinDimsOk =
    cabinL <= activeRule.cabinMaxDims[0] &&
    cabinW <= activeRule.cabinMaxDims[1] &&
    cabinH <= activeRule.cabinMaxDims[2]

  const isCheckedWeightOk = checkedWeight <= activeRule.checkedMaxWeight
  const totalCheckedDims = checkedL + checkedW + checkedH
  const isCheckedDimsOk = totalCheckedDims <= activeRule.checkedMaxDims

  const cabinOverweight = Math.max(0, cabinWeight - activeRule.cabinMaxWeight)
  const checkedOverweight = Math.max(0, checkedWeight - activeRule.checkedMaxWeight)

  // Excess fee (usually assessed on checked bags)
  const excessCheckedFee = checkedOverweight * activeRule.excessFeePerKg
  // Cabin excess baggage is usually required to be checked in at the gate (with checked fees or flat fees)
  const excessCabinFee = cabinOverweight * activeRule.excessFeePerKg * 1.5 // higher rate at gate
  const totalExcessFee = excessCheckedFee + excessCabinFee

  return (
    <div className="bg-[#06121F] rounded-2xl p-6 border border-white/8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-500/15 text-[#14C8FF] rounded-xl animate-pulse">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="7" width="16" height="13" rx="2" ry="2"></rect>
            <path d="M9 7V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v3"></path>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#F8FAFC]">Luggage Allowance &amp; Fee Calculator</h3>
          <p className="text-xs text-[#94A3B8]">Avoid unexpected gate fees by checking sizes and weights beforehand.</p>
        </div>
      </div>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wider">Airline</label>
          <select
            value={airline}
            onChange={(e) => setAirline(e.target.value)}
            className="w-full bg-[#0E1B2D] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F80FF]"
          >
            <option value="indigo">IndiGo</option>
            <option value="airindia">Air India</option>
            <option value="emirates">Emirates</option>
            <option value="lufthansa">Lufthansa</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#64748B] mb-1.5 uppercase tracking-wider">Travel Class</label>
          <select
            value={ticketClass}
            onChange={(e) => setTicketClass(e.target.value)}
            className="w-full bg-[#0E1B2D] border border-white/15 rounded-xl px-3 py-2.5 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#2F80FF]"
          >
            <option value="economy">Economy</option>
            <option value="business">Business / Premium</option>
          </select>
        </div>
      </div>

      <div className="bg-[#0E1B2D] rounded-xl p-4 mb-6 grid grid-cols-2 gap-4 border border-white/8 text-xs">
        <div>
          <div className="font-semibold text-[#64748B] mb-1">CABIN ALLOWANCE</div>
          <div className="text-[#F8FAFC] text-sm font-bold">{activeRule.cabinMaxWeight} kg</div>
          <div className="text-[#94A3B8]">Dimensions: {activeRule.cabinMaxDims.join(' × ')} cm</div>
        </div>
        <div>
          <div className="font-semibold text-[#64748B] mb-1">CHECKED ALLOWANCE</div>
          <div className="text-[#F8FAFC] text-sm font-bold">{activeRule.checkedMaxWeight} kg</div>
          <div className="text-[#94A3B8]">L+W+H max: {activeRule.checkedMaxDims} cm</div>
        </div>
      </div>

      {/* Main Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Cabin Luggage */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#0E1B2D]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
              Cabin Handbag
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isCabinWeightOk && isCabinDimsOk ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {isCabinWeightOk && isCabinDimsOk ? 'Compliant' : 'Exceeded'}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
              <span>Weight: <strong className="text-[#F8FAFC]">{cabinWeight} kg</strong></span>
              <span>Max: {activeRule.cabinMaxWeight} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={cabinWeight}
              onChange={(e) => setCabinWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-[#64748B] mb-0.5">Length (cm)</label>
              <input
                type="number"
                value={cabinL}
                onChange={(e) => setCabinL(Number(e.target.value))}
                className="w-full text-center bg-[#162742] border border-white/10 rounded px-1.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#64748B] mb-0.5">Width (cm)</label>
              <input
                type="number"
                value={cabinW}
                onChange={(e) => setCabinW(Number(e.target.value))}
                className="w-full text-center bg-[#162742] border border-white/10 rounded px-1.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#64748B] mb-0.5">Height (cm)</label>
              <input
                type="number"
                value={cabinH}
                onChange={(e) => setCabinH(Number(e.target.value))}
                className="w-full text-center bg-[#162742] border border-white/10 rounded px-1.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {!isCabinDimsOk && (
            <div className="text-[10px] text-red-400 mt-2 font-medium">
              ⚠️ Dimensions exceed limit of {activeRule.cabinMaxDims.join('x')} cm
            </div>
          )}
        </div>

        {/* Checked Luggage */}
        <div className="p-4 rounded-xl border border-white/10 bg-[#0E1B2D]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[#F8FAFC] text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping"></span>
              Checked Baggage
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isCheckedWeightOk && isCheckedDimsOk ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {isCheckedWeightOk && isCheckedDimsOk ? 'Compliant' : 'Exceeded'}
            </span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-[#94A3B8] mb-1">
              <span>Weight: <strong className="text-[#F8FAFC]">{checkedWeight} kg</strong></span>
              <span>Max: {activeRule.checkedMaxWeight} kg</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={checkedWeight}
              onChange={(e) => setCheckedWeight(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] text-[#64748B] mb-0.5">Length (cm)</label>
              <input
                type="number"
                value={checkedL}
                onChange={(e) => setCheckedL(Number(e.target.value))}
                className="w-full text-center bg-[#162742] border border-white/10 rounded px-1.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#64748B] mb-0.5">Width (cm)</label>
              <input
                type="number"
                value={checkedW}
                onChange={(e) => setCheckedW(Number(e.target.value))}
                className="w-full text-center bg-[#162742] border border-white/10 rounded px-1.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-[#64748B] mb-0.5">Height (cm)</label>
              <input
                type="number"
                value={checkedH}
                onChange={(e) => setCheckedH(Number(e.target.value))}
                className="w-full text-center bg-[#162742] border border-white/10 rounded px-1.5 py-1 text-xs text-[#F8FAFC] focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-[#94A3B8]">Total size (L+W+H): {totalCheckedDims} cm</span>
            <span className="text-[#94A3B8]">Max limit: {activeRule.checkedMaxDims} cm</span>
          </div>
          
          {!isCheckedDimsOk && (
            <div className="text-[10px] text-red-400 font-medium mt-1">
              ⚠️ Total size exceeds limit of {activeRule.checkedMaxDims} cm
            </div>
          )}
        </div>

      </div>

      {/* Summary Area */}
      <div className="mt-6 border-t border-white/8 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {totalExcessFee > 0 ? (
            <div className="bg-red-500/15 border border-red-500/30 p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center font-bold">!</div>
              <div>
                <div className="text-xs text-red-400 font-semibold">Overweight baggage detected</div>
                <div className="text-[10px] text-red-400/80">
                  {cabinOverweight > 0 && `Cabin +${cabinOverweight}kg`}
                  {cabinOverweight > 0 && checkedOverweight > 0 && ' & '}
                  {checkedOverweight > 0 && `Checked +${checkedOverweight}kg`}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/15 border border-emerald-500/30 p-3 rounded-xl flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center font-bold">✓</div>
              <div>
                <div className="text-xs text-emerald-400 font-semibold">Baggage is within guidelines</div>
                <div className="text-[10px] text-emerald-400/70">No overweight fees will apply at check-in.</div>
              </div>
            </div>
          )}
        </div>

        <div className="text-right">
          <div className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Est. Excess Baggage Fee</div>
          <div className="text-2xl font-black text-[#F8FAFC]">
            {activeRule.currency}{totalExcessFee.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#64748B]">Calculated at booking rates; airport rates may vary.</div>
        </div>
      </div>
    </div>
  )
}
