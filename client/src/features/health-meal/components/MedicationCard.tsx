import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, Plus, Trash2, Bell, BellOff, Utensils } from 'lucide-react';
import { MedicationItem } from '../types';

interface MedicationCardProps {
  medications: MedicationItem[];
  onAddMedication: (med: MedicationItem) => void;
  onRemoveMedication: (id: string) => void;
  onToggleReminder: (id: string) => void;
}

export default function MedicationCard({
  medications,
  onAddMedication,
  onRemoveMedication,
  onToggleReminder,
}: MedicationCardProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMed, setNewMed] = useState<Partial<MedicationItem>>({
    name: '',
    dosage: '',
    frequency: 'Once Daily',
    time: '08:00 AM',
    instruction: 'With Food',
    reminderEnabled: true,
  });

  const handleAdd = () => {
    if (!newMed.name || !newMed.dosage) return;
    onAddMedication({
      id: `med-${Date.now()}`,
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency || 'Once Daily',
      time: newMed.time || '08:00 AM',
      instruction: (newMed.instruction as any) || 'With Food',
      reminderEnabled: newMed.reminderEnabled ?? true,
    });
    setNewMed({ name: '', dosage: '', frequency: 'Once Daily', time: '08:00 AM', instruction: 'With Food' });
    setShowAddModal(false);
  };

  return (
    <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Pill size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Passenger Medication Schedule</span>
              <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                {medications.length} Active Doses
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Timely reminders synchronized with flight & time zone changes
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-blue-600/25"
        >
          <Plus size={15} />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Medication Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {medications.map((med) => (
          <motion.div
            key={med.id}
            whileHover={{ y: -2 }}
            className="p-4 rounded-xl bg-[#0d1628] border border-white/8 hover:border-blue-500/40 shadow-lg flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  <Pill size={14} className="text-blue-400" />
                  {med.name}
                </span>
                <button
                  onClick={() => onRemoveMedication(med.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                  title="Remove medication"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="bg-blue-500/20 text-blue-300 font-mono text-[10px] px-2 py-0.5 rounded-md border border-blue-500/30">
                  {med.dosage}
                </span>
                <span className="text-[11px] text-slate-400">• {med.frequency}</span>
              </div>

              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Clock size={12} /> {med.time}
                </span>
                <span className="text-amber-300/90 text-[11px] flex items-center gap-1">
                  <Utensils size={11} /> {med.instruction}
                </span>
              </div>
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/5">
              <span className="text-[10px] text-slate-400 font-medium">Flight Notification</span>
              <button
                onClick={() => onToggleReminder(med.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                  med.reminderEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-white/5 text-slate-500 border border-white/10'
                }`}
              >
                {med.reminderEnabled ? <Bell size={11} /> : <BellOff size={11} />}
                <span>{med.reminderEnabled ? 'Active' : 'Off'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Medication Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0c1322] border border-white/15 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4"
            >
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Pill className="text-blue-400" size={18} />
                Add Medication to Health Profile
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Medication Name</label>
                  <input
                    type="text"
                    value={newMed.name}
                    onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    placeholder="e.g. Metformin, Insulin, Aspirin"
                    className="w-full bg-[#0d1628] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Dosage</label>
                    <input
                      type="text"
                      value={newMed.dosage}
                      onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                      placeholder="e.g. 500 mg, 10 Units"
                      className="w-full bg-[#0d1628] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 font-bold block mb-1">Scheduled Time</label>
                    <input
                      type="text"
                      value={newMed.time}
                      onChange={(e) => setNewMed({ ...newMed, time: e.target.value })}
                      placeholder="e.g. 06:30 PM"
                      className="w-full bg-[#0d1628] border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-bold block mb-1">Instruction</label>
                  <select
                    value={newMed.instruction}
                    onChange={(e) => setNewMed({ ...newMed, instruction: e.target.value as any })}
                    className="w-full bg-[#0d1628] border border-white/10 rounded-xl px-3 py-2 text-white outline-none cursor-pointer"
                  >
                    <option value="With Food">With Food</option>
                    <option value="Empty Stomach">Empty Stomach</option>
                    <option value="After Meal">After Meal</option>
                    <option value="Before Bed">Before Bed</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30"
                >
                  Save Medication
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
