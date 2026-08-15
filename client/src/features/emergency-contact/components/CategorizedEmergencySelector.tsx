import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import {
  EMERGENCY_CATEGORIES,
  EMERGENCY_REASONS,
  AGENCIES,
  EmergencyReasonItem,
  AgencyType,
} from '../data/emergencyCategories';

interface CategorizedEmergencySelectorProps {
  selectedReason: EmergencyReasonItem | null;
  onSelectReason: (reason: EmergencyReasonItem) => void;
}

export default function CategorizedEmergencySelector({
  selectedReason,
  onSelectReason,
}: CategorizedEmergencySelectorProps) {
  const [activeCategory, setActiveCategory] = useState<'Police' | 'Medical' | 'Fire'>('Medical');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter reasons by category & search query
  const filteredReasons = EMERGENCY_REASONS.filter((item) => {
    const matchesCategory = searchQuery ? true : item.category === activeCategory;
    const matchesSearch = item.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="grid grid-cols-3 gap-2">
        {EMERGENCY_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id && !searchQuery;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSearchQuery('');
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-br from-blue-600/30 to-indigo-600/20 border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : 'bg-[#0d1628]/80 hover:bg-[#131f38] border-white/8 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xl">{cat.icon}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
              </div>
              <span className="text-xs font-bold text-white mt-2 leading-tight">{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search emergency reason (e.g. chest pain, lost baggage, fire)..."
          className="w-full bg-[#0d1628] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Reason List */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {filteredReasons.map((item) => {
          const isSelected = selectedReason?.id === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 3 }}
              onClick={() => onSelectReason(item)}
              className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                isSelected
                  ? 'bg-blue-600/20 border-blue-500/70 text-white shadow-md'
                  : 'bg-[#0c1322] hover:bg-[#111a2e] border-white/5 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base">{AGENCIES[item.primaryAgency].icon}</span>
                <span className="text-xs font-semibold truncate">{item.label}</span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    item.priority === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : item.priority === 'HIGH'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {item.priority}
                </span>
                {isSelected ? (
                  <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}

        {filteredReasons.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            No matching emergency reason found. Please select from the categories above.
          </div>
        )}
      </div>

      {/* Dynamic Agency Preview Box (Step 2) */}
      <AnimatePresence>
        {selectedReason && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-gradient-to-br from-[#0e172a] to-[#0a1020] border border-blue-500/30 shadow-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={14} className="text-blue-400" />
                Dynamic Agency Routing Matrix
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Category: {selectedReason.category}
              </span>
            </div>

            {/* Responding Agency Badges */}
            <div className="space-y-2">
              <div className="text-[11px] text-slate-400">Responding Agencies:</div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Primary Agency */}
                <div
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-md ${AGENCIES[selectedReason.primaryAgency].badgeBg} ${AGENCIES[selectedReason.primaryAgency].badgeBorder} ${AGENCIES[selectedReason.primaryAgency].badgeText}`}
                >
                  <span>{AGENCIES[selectedReason.primaryAgency].icon}</span>
                  <span>{AGENCIES[selectedReason.primaryAgency].shortName}</span>
                  <span className="text-[9px] bg-white/10 px-1.5 py-0.2 rounded font-extrabold ml-1">PRIMARY</span>
                </div>

                {/* Additional Agencies */}
                {selectedReason.additionalAgencies.map((agencyKey) => {
                  const ag = AGENCIES[agencyKey as AgencyType];
                  return (
                    <div
                      key={agencyKey}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-md ${ag.badgeBg} ${ag.badgeBorder} ${ag.badgeText}`}
                    >
                      <span>{ag.icon}</span>
                      <span>{ag.shortName}</span>
                      <span className="text-[9px] opacity-75 font-normal ml-0.5">(Joint Ops)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedReason.additionalAgencies.length > 0 && (
              <p className="text-[11px] text-amber-300/90 flex items-center gap-1 mt-1">
                <AlertTriangle size={12} className="shrink-0" />
                Critical Incident: Multiple airport authorities will be dispatched simultaneously.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
