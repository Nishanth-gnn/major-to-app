import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HeartPulse,
  Pill,
  Plane,
  Utensils,
  Clock,
  Bot,
  Settings,
  ShieldCheck,
  ArrowLeft,
  Download,
  Upload,
  Globe,
  Moon,
  CheckCircle2,
  AlertTriangle,
  Siren,
} from 'lucide-react';
import Header from '../../home/components/Header';
import BottomNavigation from '../../home/components/BottomNavigation';
import HealthProfileCard from '../components/HealthProfileCard';
import MedicationCard from '../components/MedicationCard';
import MealCompatibilityCard from '../components/MealCompatibilityCard';
import RestaurantRecommendationCard from '../components/RestaurantRecommendationCard';
import MedicationReminderCard from '../components/MedicationReminderCard';
import NutritionTimeline from '../components/NutritionTimeline';
import AIMealAssistantCard from '../components/AIMealAssistantCard';
import EmergencyHealthSummary from '../components/EmergencyHealthSummary';

import {
  HealthProfile,
  MedicationItem,
  FlightMealInfo,
  RestaurantOption,
  AIMealChatMessage,
} from '../types';
import {
  getHealthProfile,
  saveHealthProfile,
  getMedications,
  saveMedications,
  getFlightMealCompatibility,
  exportHealthProfileJSON,
} from '../services/healthService';
import {
  NEARBY_RESTAURANTS,
  NUTRITION_TIMELINE,
  INITIAL_AI_CHAT_MESSAGES,
} from '../data/healthMockData';

export default function HealthMealPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'profile' | 'medications' | 'flight-meal' | 'restaurants' | 'timeline' | 'ai' | 'settings'
  >('overview');

  const [profile, setProfile] = useState<HealthProfile>(getHealthProfile);
  const [medications, setMedications] = useState<MedicationItem[]>(getMedications);
  const [chatMessages, setChatMessages] = useState<AIMealChatMessage[]>(INITIAL_AI_CHAT_MESSAGES);
  const [language, setLanguage] = useState('English');
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

  const flightMeal = getFlightMealCompatibility(profile);

  const handleUpdateProfile = (newProfile: HealthProfile) => {
    setProfile(newProfile);
    saveHealthProfile(newProfile);
  };

  const handleAddMedication = (med: MedicationItem) => {
    const updated = [med, ...medications];
    setMedications(updated);
    saveMedications(updated);
  };

  const handleRemoveMedication = (id: string) => {
    const updated = medications.filter((m) => m.id !== id);
    setMedications(updated);
    saveMedications(updated);
  };

  const handleToggleReminder = (id: string) => {
    const updated = medications.map((m) =>
      m.id === id ? { ...m, reminderEnabled: !m.reminderEnabled } : m
    );
    setMedications(updated);
    saveMedications(updated);
  };

  const handleSendMessage = (text: string) => {
    const userMsg: AIMealChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let replyText = `Based on your health profile (${profile.medicalConditions.join(', ')}), `;
    let badge: 'RECOMMENDED' | 'CAUTION' | 'SAFE' = 'SAFE';
    let suggestions: string[] = [];

    const lower = text.toLowerCase();
    if (lower.includes('diabetes') || lower.includes('sugar') || lower.includes('carb')) {
      replyText += 'we recommend low-glycemic foods like steamed millet, salads, and sugar-free almond yogurt. Avoid refined rice, sugary sodas, and pastries.';
      badge = 'CAUTION';
      suggestions = ['Steamed Millet Bowl (Gate 18)', 'Sugar-Free Almond Yogurt'];
    } else if (lower.includes('dairy') || lower.includes('lactose') || lower.includes('milk')) {
      replyText += 'your profile indicates Lactose Intolerance. Please select non-dairy beverages like coconut water or almond milk. Avoid cream pasta and milk desserts.';
      badge = 'CAUTION';
      suggestions = ['Coconut Water', 'Non-Dairy Oat Milk Coffee'];
    } else if (lower.includes('layover') || lower.includes('long flight')) {
      replyText += 'for a long layover, stay hydrated (water every 2 hrs) and choose a light protein snack like grilled tofu or mixed fruit to maintain steady blood glucose.';
      badge = 'SAFE';
      suggestions = ['Grilled Tofu Salad', 'Hydration Water Pack'];
    } else {
      replyText += 'this food choice appears suitable if prepared without added refined sugar or dairy. Enjoy your meal and have a healthy flight!';
      badge = 'SAFE';
    }

    const aiMsg: AIMealChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badge,
      suggestedItems: suggestions,
    };

    setChatMessages((prev) => [...prev, userMsg, aiMsg]);
  };

  const handleExportProfile = () => {
    const jsonStr = exportHealthProfileJSON(profile, medications);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Health_Profile_${profile.passengerName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccessMsg('Health profile exported successfully as JSON file!');
    setTimeout(() => setExportSuccessMsg(''), 4000);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-28 font-sans">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <Header minimal />

        {/* Page Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
                <HeartPulse size={24} className="text-emerald-400" />
                Personal Health & Meal Preference Assistant
              </h1>
              <p className="text-xs text-slate-400">
                Intelligent flight dietary companion, medication schedule & health alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/emergency-contact')}
              className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Siren size={14} className="animate-pulse" />
              <span>Medical SOS Link</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
          {[
            { id: 'overview', label: 'Overview', icon: HeartPulse },
            { id: 'profile', label: 'Health Profile', icon: ShieldCheck },
            { id: 'medications', label: 'Medications', icon: Pill },
            { id: 'flight-meal', label: 'Flight Meal', icon: Plane },
            { id: 'restaurants', label: 'Healthy Dining', icon: Utensils },
            { id: 'timeline', label: 'Timeline & Reminders', icon: Clock },
            { id: 'ai', label: 'AI Assistant', icon: Bot },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-[#0d1628] hover:bg-[#131f38] text-slate-300 border border-white/5'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Quick Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#0c1322] border border-white/10 p-4 rounded-2xl shadow-xl space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Passenger Health Status</div>
                  <div className="text-sm font-extrabold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={16} /> Active & Monitored
                  </div>
                  <p className="text-xs text-slate-300">
                    {profile.medicalConditions.join(' • ')}
                  </p>
                </div>

                <div className="bg-[#0c1322] border border-white/10 p-4 rounded-2xl shadow-xl space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Next Medication Dose</div>
                  <div className="text-sm font-extrabold text-blue-400 flex items-center gap-1.5">
                    <Pill size={16} /> Metformin (500mg)
                  </div>
                  <p className="text-xs text-slate-300">Today at 06:30 PM (With Food)</p>
                </div>

                <div className="bg-[#0c1322] border border-white/10 p-4 rounded-2xl shadow-xl space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Flight Meal Status</div>
                  <div className="text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle size={16} /> Meal Caution (AI 542)
                  </div>
                  <p className="text-xs text-slate-300">Diabetic Replacement DBML Recommended</p>
                </div>
              </div>

              {/* Medication Reminder Card */}
              <MedicationReminderCard medications={medications} />

              {/* Flight Meal Compatibility Card */}
              <MealCompatibilityCard flightMeal={flightMeal} healthProfile={profile} />

              {/* Emergency Health Summary Integration */}
              <EmergencyHealthSummary profile={profile} medications={medications} />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <HealthProfileCard profile={profile} onSaveProfile={handleUpdateProfile} />
            </motion.div>
          )}

          {activeTab === 'medications' && (
            <motion.div
              key="medications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MedicationCard
                medications={medications}
                onAddMedication={handleAddMedication}
                onRemoveMedication={handleRemoveMedication}
                onToggleReminder={handleToggleReminder}
              />
            </motion.div>
          )}

          {activeTab === 'flight-meal' && (
            <motion.div
              key="flight-meal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <MealCompatibilityCard flightMeal={flightMeal} healthProfile={profile} />
            </motion.div>
          )}

          {activeTab === 'restaurants' && (
            <motion.div
              key="restaurants"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <RestaurantRecommendationCard restaurants={NEARBY_RESTAURANTS} />
            </motion.div>
          )}

          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <MedicationReminderCard medications={medications} />
              <NutritionTimeline steps={NUTRITION_TIMELINE} />
            </motion.div>
          )}

          {activeTab === 'ai' && (
            <motion.div
              key="ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AIMealAssistantCard
                messages={chatMessages}
                healthProfile={profile}
                onSendMessage={handleSendMessage}
              />
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-6"
            >
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white">
                  <Settings size={22} />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Assistant Settings & Data Backup</h2>
                  <p className="text-xs text-slate-400">Export health records, sync settings & preferences</p>
                </div>
              </div>

              {exportSuccessMsg && (
                <div className="bg-emerald-500/20 border border-emerald-500/40 p-3 rounded-xl text-xs font-bold text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  <span>{exportSuccessMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Data Export & Import */}
                <div className="bg-[#0d1628] p-4 rounded-xl border border-white/8 space-y-3">
                  <h3 className="font-extrabold text-white flex items-center gap-2">
                    <Download size={16} className="text-blue-400" /> Export & Backup Profile
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Download an encrypted JSON copy of your health conditions, allergies, and medication schedule for offline medical emergency access.
                  </p>
                  <button
                    onClick={handleExportProfile}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
                  >
                    <Download size={14} /> Export Health Profile (JSON)
                  </button>
                </div>

                {/* Preferred Language & Dark Mode */}
                <div className="bg-[#0d1628] p-4 rounded-xl border border-white/8 space-y-3">
                  <h3 className="font-extrabold text-white flex items-center gap-2">
                    <Globe size={16} className="text-purple-400" /> Language & Theme
                  </h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-slate-400 font-bold block mb-1">Preferred Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-[#070b14] border border-white/10 rounded-xl px-3 py-2 text-white outline-none cursor-pointer"
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi (हिंदी)</option>
                        <option value="Telugu">Telugu (తెలుగు)</option>
                        <option value="Spanish">Spanish (Español)</option>
                      </select>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <Moon size={14} className="text-indigo-400" /> Dark Mode
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                        Enabled (Default)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavigation />
    </div>
  );
}
