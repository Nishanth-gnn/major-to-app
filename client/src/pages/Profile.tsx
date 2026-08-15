import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../config/api'
import {
  User,
  ShieldCheck,
  ArrowRight,
  Mail,
  HeartPulse,
  AlertCircle,
  Pill,
  Utensils,
  Stethoscope,
  Edit2,
  CheckCircle2,
  Lock,
  Fingerprint,
} from 'lucide-react'

export default function ProfilePage() {
  const [guardian, setGuardian] = useState<{ guardianEmail: string; guardianVerified: boolean } | null>(null)
  const token = localStorage.getItem('token')

  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>(['Vegetarian', 'Gluten-Free'])
  const [allergies, setAllergies] = useState<string[]>(['Peanuts', 'Lactose'])
  const [medicalConditions, setMedicalConditions] = useState<string[]>(['Asthma (Mild)'])
  const [flightMealPref, setFlightMealPref] = useState('Asian Vegetarian (AVML)')

  useEffect(() => {
    if (!token) return
    apiFetch('/api/guardian/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.guardian) {
          setGuardian(data.guardian)
        }
      })
      .catch((err) => console.error(err))
  }, [token])

  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="p-8 rounded-[28px] bg-gradient-to-br from-[#0F1E35] via-[#162742] to-[#071326] border border-white/10 shadow-2xl relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2F80FF] to-[#14C8FF] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-500/25">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#F8FAFC]">Sai Venkat</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Fingerprint className="w-3 h-3" /> Verified Passenger
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">Passport: *****8921 • Frequent Flyer AI-GOLD</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-[#14C8FF] border border-blue-400/30 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" /> Encrypted Health ID
          </span>
        </div>
      </div>

      {/* Grid Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Personal Diet & Medical Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical & Dietary Overview Card */}
          <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-400" />
                <h2 className="text-lg font-bold text-[#F8FAFC]">Medical & Personal Diet Profile</h2>
              </div>
              <button className="text-xs font-bold text-[#14C8FF] flex items-center gap-1 hover:underline">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            </div>

            {/* Dietary Preferences */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-400" />
                <span>Dietary Preferences</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {dietaryPrefs.map((pref) => (
                  <span
                    key={pref}
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold"
                  >
                    {pref}
                  </span>
                ))}
              </div>
            </div>

            {/* Allergies & Intolerances */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span>Known Allergies</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allergies.map((alg) => (
                  <span
                    key={alg}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-bold"
                  >
                    ⚠️ {alg}
                  </span>
                ))}
              </div>
            </div>

            {/* Medical Conditions & Medications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#162742] border border-white/5 space-y-1">
                <div className="text-[10px] font-bold uppercase text-[#94A3B8] flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-[#2F80FF]" /> Medical Conditions
                </div>
                <div className="text-xs font-bold text-[#F8FAFC]">{medicalConditions.join(', ')}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#162742] border border-white/5 space-y-1">
                <div className="text-[10px] font-bold uppercase text-[#94A3B8] flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-emerald-400" /> Flight Meal Preference
                </div>
                <div className="text-xs font-bold text-emerald-400">{flightMealPref}</div>
              </div>
            </div>
          </div>

          {/* Emergency Medical Summary Card */}
          <div className="p-6 rounded-[28px] bg-red-500/10 border border-red-500/30 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
              <ShieldCheck className="w-5 h-5" /> Emergency Medical Card Summary
            </div>
            <p className="text-xs text-red-200/80 leading-relaxed">
              This card is accessible to airport emergency medical personnel in the event of an incident. Includes blood type (O+), emergency contact numbers, and inhaler prescription.
            </p>
          </div>
        </div>

        {/* Right Column: Personal Guardian & Account Settings */}
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#F8FAFC] text-sm">
                <ShieldCheck className="w-4 h-4 text-[#2F80FF]" />
                <span>Personal Guardian</span>
              </div>
              {guardian?.guardianVerified ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Configured
                </span>
              )}
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Nominate a trusted guardian to monitor your flight status and receive emergency alerts.
            </p>

            <Link
              to="/personal-guardian"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14C8FF] hover:underline"
            >
              <span>Manage Personal Guardian</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
