import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HeartPulse, ShieldAlert, Check, Edit2, Save, Sparkles, User, AlertCircle } from 'lucide-react';
import { HealthProfile, MedicalCondition, DietaryPreference } from '../types';

interface HealthProfileCardProps {
  profile: HealthProfile;
  onSaveProfile: (updatedProfile: HealthProfile) => void;
}

const ALL_CONDITIONS: MedicalCondition[] = [
  'Diabetes',
  'Hypertension',
  'Heart Disease',
  'Kidney Disease',
  'Pregnancy',
  'Thyroid Disorder',
  'Lactose Intolerance',
  'Gluten Intolerance',
  'Nut Allergy',
  'Shellfish Allergy',
  'Egg Allergy',
  'Other',
];

const ALL_DIETS: DietaryPreference[] = [
  'Vegetarian',
  'Non-Vegetarian',
  'Vegan',
  'Jain',
  'Halal',
  'Kosher',
  'Low Sodium',
  'Diabetic Meal',
  'Gluten Free',
  'Lactose Free',
];

export default function HealthProfileCard({ profile, onSaveProfile }: HealthProfileCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState<HealthProfile>(profile);

  const toggleCondition = (cond: MedicalCondition) => {
    setEdited((prev) => {
      const exists = prev.medicalConditions.includes(cond);
      return {
        ...prev,
        medicalConditions: exists
          ? prev.medicalConditions.filter((c) => c !== cond)
          : [...prev.medicalConditions, cond],
      };
    });
  };

  const toggleDiet = (diet: DietaryPreference) => {
    setEdited((prev) => {
      const exists = prev.dietaryPreferences.includes(diet);
      return {
        ...prev,
        dietaryPreferences: exists
          ? prev.dietaryPreferences.filter((d) => d !== diet)
          : [...prev.dietaryPreferences, diet],
      };
    });
  };

  const handleSave = () => {
    onSaveProfile({
      ...edited,
      updatedAt: new Date().toLocaleDateString(),
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-[#0c1322] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <HeartPulse size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Personal Health & Dietary Profile</span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-500/30">
                Encrypted Local Sync
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Passenger: <span className="text-white font-semibold">{profile.passengerName}</span> • Last Updated: {profile.updatedAt}
            </p>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
            isEditing
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              : 'bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10'
          }`}
        >
          {isEditing ? <Save size={14} /> : <Edit2 size={14} />}
          <span>{isEditing ? 'Save Profile' : 'Edit Profile'}</span>
        </button>
      </div>

      {/* Medical Conditions Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-rose-400" />
          Medical Conditions & Sensitivities
        </h3>

        {isEditing ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {ALL_CONDITIONS.map((cond) => {
              const selected = edited.medicalConditions.includes(cond);
              return (
                <button
                  key={cond}
                  onClick={() => toggleCondition(cond)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-rose-500/25 border-rose-500/60 text-rose-200 shadow-md'
                      : 'bg-[#0d1628] border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  {selected && <Check size={12} />}
                  <span>{cond}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.medicalConditions.map((cond) => (
              <span
                key={cond}
                className="bg-rose-500/20 text-rose-200 border border-rose-500/40 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                {cond}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Dietary Preferences Section */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles size={14} className="text-emerald-400" />
          Dietary Preferences
        </h3>

        {isEditing ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {ALL_DIETS.map((diet) => {
              const selected = edited.dietaryPreferences.includes(diet);
              return (
                <button
                  key={diet}
                  onClick={() => toggleDiet(diet)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
                    selected
                      ? 'bg-emerald-500/25 border-emerald-500/60 text-emerald-200 shadow-md'
                      : 'bg-[#0d1628] border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  {selected && <Check size={12} />}
                  <span>{diet}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {profile.dietaryPreferences.map((diet) => (
              <span
                key={diet}
                className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5"
              >
                <Check size={12} />
                {diet}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes & Emergency Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div className="bg-[#0d1628] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Physician / Contact</span>
          <p className="text-xs font-bold text-white">{profile.emergencyContactName}</p>
          <p className="text-xs text-blue-400 font-mono">{profile.emergencyContactPhone}</p>
        </div>

        <div className="bg-[#0d1628] p-3.5 rounded-xl border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Special Dietary Notes</span>
          <p className="text-xs text-slate-300 leading-relaxed">{profile.notes}</p>
        </div>
      </div>
    </div>
  );
}
