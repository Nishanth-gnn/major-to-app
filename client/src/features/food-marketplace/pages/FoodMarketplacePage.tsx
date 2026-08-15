import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, Star, Clock, MapPin, ChevronRight, X,
  Sparkles, Bot, Send, ShoppingBag, Plane, AlarmClock, Pill,
  CheckCircle2, AlertTriangle, XCircle, ChevronLeft, Zap, Heart,
  Flame, Leaf, Filter, ArrowRight,
} from 'lucide-react';
import {
  FOOD_CATEGORIES, RESTAURANTS, MEAL_RECOMMENDATIONS,
  INITIAL_AI_MESSAGES, FLIGHT_INFO, MEDICATION_REMINDERS,
  Restaurant, MenuItem, AIChatMessage,
} from '../data/foodMarketplaceData';
import BottomNavigation from '../../home/components/BottomNavigation';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function HealthBadge({ pct }: { pct: number }) {
  const color =
    pct >= 85 ? 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30' :
    pct >= 60 ? 'text-amber-400 bg-amber-500/15 border-amber-500/30' :
                'text-red-400 bg-red-500/15 border-red-500/30';
  return (
    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${color}`}>
      {pct}% Match
    </span>
  );
}

function SuitabilityBadge({ status }: { status: 'EXCELLENT' | 'GOOD' | 'CAUTION' }) {
  const map = {
    EXCELLENT: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    GOOD: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    CAUTION: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  };
  return (
    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${map[status]}`}>
      {status === 'EXCELLENT' ? '✦ Excellent' : status === 'GOOD' ? '✓ Good' : '⚠ Caution'}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Category Chips
// ─────────────────────────────────────────────────────────────────────────────
function CategoryChips({
  active, onSelect,
}: {
  active: string;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
      style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
    >
      {FOOD_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 border shrink-0 ${
            active === cat.id
              ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/25'
              : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
          }`}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured Banner
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 40%, #0891b2 100%)',
      }}
    >
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 80% 50%, white 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div className="relative px-5 py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-white/70 uppercase tracking-widest">✈ Recommended for Your Flight</span>
            </div>
            <h2 className="text-xl font-extrabold text-white leading-snug mb-1">
              Healthy Meals for<br />Long-Haul Flights
            </h2>
            <p className="text-sm text-white/70 max-w-xs">
              Energising options curated for your health profile. Order before boarding at 3:20 PM.
            </p>
            <button className="mt-4 flex items-center gap-1.5 bg-white text-purple-700 text-xs font-bold px-4 py-2 rounded-full hover:bg-white/90 transition-all shadow-lg">
              Browse Recommendations <ArrowRight size={13} />
            </button>
          </div>
          <div className="text-6xl ml-4 shrink-0 drop-shadow-xl select-none">🥗</div>
        </div>
      </div>
      {/* Bottom strip */}
      <div className="bg-white/10 backdrop-blur-sm px-5 py-2 flex items-center gap-4 border-t border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-white/80">
          <Clock size={12} /> <span>Order by 2:45 PM</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/80">
          <MapPin size={12} /> <span>Nearest: Gate 18</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-bold">
          <Sparkles size={12} /> <span>AI Curated</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Flight Aware Widget
// ─────────────────────────────────────────────────────────────────────────────
function FlightAwareWidget() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/25 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Plane size={16} className="text-blue-400" />
        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Flight-Aware Meal Timing</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Your Flight', value: FLIGHT_INFO.flightNumber, sub: FLIGHT_INFO.airline, icon: '✈️' },
          { label: 'Order By', value: FLIGHT_INFO.recommendedOrderTime, sub: 'Recommended', icon: '⏰' },
          { label: 'Pickup By', value: FLIGHT_INFO.safePickupBy, sub: 'Latest safe time', icon: '🏃' },
        ].map((item) => (
          <div key={item.label} className="bg-white/5 rounded-xl p-3 text-center">
            <div className="text-xl mb-1">{item.icon}</div>
            <div className="text-white font-extrabold text-sm">{item.value}</div>
            <div className="text-slate-400 text-[10px] mt-0.5">{item.label}</div>
            <div className="text-blue-300/60 text-[9px]">{item.sub}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 bg-amber-500/10 rounded-xl px-3 py-2 border border-amber-500/20">
        <AlarmClock size={14} className="text-amber-400 shrink-0" />
        <span className="text-xs text-amber-300">Boarding at <span className="font-bold">{FLIGHT_INFO.boardingTime}</span> at Gate <span className="font-bold">{FLIGHT_INFO.gate}</span>. Order soon for pickup before boarding.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Medication Banner
// ─────────────────────────────────────────────────────────────────────────────
function MedicationBanner() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-2xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/25 p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
          <Pill size={18} className="text-violet-400" />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold text-violet-300 uppercase tracking-widest mb-1">💊 Medication Reminder</div>
          <p className="text-sm text-white font-medium">Take your medication with food.</p>
          <p className="text-xs text-slate-400 mt-0.5">Your meal will be ready before your scheduled medicine time.</p>
          <div className="flex gap-2 mt-2">
            {MEDICATION_REMINDERS.map((m) => (
              <div key={m.id} className="bg-white/5 rounded-lg px-2.5 py-1.5 text-xs">
                <span className="text-white font-semibold">{m.name}</span>
                <span className="text-slate-400 ml-1.5">{m.time} · {m.instruction}</span>
              </div>
            ))}
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-slate-500 hover:text-slate-300">
          <X size={16} />
        </button>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Restaurant Card
// ─────────────────────────────────────────────────────────────────────────────
function RestaurantCard({
  restaurant, onClick,
}: {
  restaurant: Restaurant;
  onClick: () => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl overflow-hidden border border-white/8 bg-[#0d1628] shadow-xl hover:shadow-2xl hover:border-white/15 transition-all"
    >
      {/* Image area */}
      <div className={`relative h-36 bg-gradient-to-br ${restaurant.imageColor} flex items-center justify-center`}>
        <div className="text-6xl drop-shadow-xl">{restaurant.emoji}</div>
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`text-[10px] font-extrabold px-2 py-1 rounded-full border ${
            restaurant.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
            restaurant.status === 'BUSY' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
            'bg-red-500/20 text-red-300 border-red-500/30'
          }`}>
            {restaurant.status === 'OPEN' ? '● Open' : restaurant.status === 'BUSY' ? '⊙ Busy' : '✕ Closed'}
          </span>
        </div>
        {/* Health match */}
        <div className="absolute top-3 right-3">
          <HealthBadge pct={restaurant.healthMatch} />
        </div>
        {/* Price */}
        <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {restaurant.priceRange}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-extrabold text-sm mb-0.5">{restaurant.name}</h3>
        <p className="text-slate-400 text-xs mb-3 truncate">{restaurant.cuisine}</p>

        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <Star size={11} className="text-amber-400 fill-amber-400" />
            <span className="font-bold text-white">{restaurant.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={11} className="text-slate-400" />
            <span>{restaurant.deliveryMins} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-slate-400" />
            <span>{restaurant.gate}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Meal Recommendation Card
// ─────────────────────────────────────────────────────────────────────────────
function MealRecommendationCard({ meal, onOrder }: {
  meal: typeof MEAL_RECOMMENDATIONS[0];
  onOrder: (meal: typeof MEAL_RECOMMENDATIONS[0]) => void;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-2xl bg-[#0d1628] border border-white/8 p-4 flex gap-3 shadow-lg hover:border-white/15 transition-all"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-600/30 to-teal-600/30 border border-emerald-500/20 flex items-center justify-center text-3xl shrink-0">
        {meal.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-white font-bold text-sm leading-snug">{meal.name}</h4>
          <SuitabilityBadge status={meal.suitability} />
        </div>
        <p className="text-slate-400 text-xs mb-2">
          {meal.restaurant} · {meal.gate}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {meal.tags.map((tag) => (
            <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>🔥 {meal.calories} kcal</span>
            <span>💪 {meal.protein}</span>
            <span className="text-emerald-400 font-bold">₹{meal.price}</span>
          </div>
          <button
            onClick={() => onOrder(meal)}
            className="text-xs font-bold bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-full transition-all shadow-lg shadow-orange-500/20"
          >
            Order Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Restaurant Detail Modal
// ─────────────────────────────────────────────────────────────────────────────
type OrderItem = { item: MenuItem; qty: number };

function RestaurantDetailModal({
  restaurant, onClose, onAddToOrder,
}: {
  restaurant: Restaurant;
  onClose: () => void;
  onAddToOrder: (item: MenuItem) => void;
}) {
  const [tab, setTab] = useState<'recommended' | 'caution' | 'avoid'>('recommended');

  const TABS: { key: typeof tab; label: string; icon: React.ReactNode; color: string }[] = [
    { key: 'recommended', label: 'Recommended', icon: <CheckCircle2 size={13} />, color: 'text-emerald-400 border-emerald-500 bg-emerald-500/10' },
    { key: 'caution', label: 'Use with Caution', icon: <AlertTriangle size={13} />, color: 'text-amber-400 border-amber-500 bg-amber-500/10' },
    { key: 'avoid', label: 'Avoid', icon: <XCircle size={13} />, color: 'text-red-400 border-red-500 bg-red-500/10' },
  ];

  const items = restaurant[tab];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-[#0a0f1e] rounded-t-3xl overflow-hidden border-t border-white/10 max-h-[85vh] flex flex-col"
      >
        {/* Header */}
        <div className={`bg-gradient-to-r ${restaurant.imageColor} p-5 flex items-start justify-between`}>
          <div>
            <div className="text-4xl mb-2">{restaurant.emoji}</div>
            <h2 className="text-xl font-extrabold text-white">{restaurant.name}</h2>
            <p className="text-white/70 text-xs mt-0.5">{restaurant.cuisine}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Star size={12} className="fill-amber-400 text-amber-400" /> {restaurant.rating}
              </span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                <Clock size={12} /> {restaurant.deliveryMins} mins
              </span>
              <span className="flex items-center gap-1 text-xs text-white/80">
                <MapPin size={12} /> {restaurant.gate} ({restaurant.distanceMeters}m)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/30 flex items-center justify-center text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Compatibility header */}
        <div className="px-5 pt-4 pb-2 border-b border-white/8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Meal Compatibility for Your Health Profile</p>
          <div className="flex gap-2">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  tab === t.key ? t.color : 'text-slate-400 border-white/10 bg-white/5'
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-sm">
              No items in this category
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white/5 rounded-2xl p-3 border border-white/8"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-slate-400 text-xs truncate">{item.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.tags.map((t) => (
                      <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/15">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-white font-extrabold text-sm">₹{item.price}</div>
                  {tab === 'recommended' && (
                    <button
                      onClick={() => onAddToOrder(item)}
                      className="mt-1 text-[10px] font-bold bg-orange-500 hover:bg-orange-400 text-white px-2.5 py-1 rounded-full transition-all"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Order Preview Panel
// ─────────────────────────────────────────────────────────────────────────────
function OrderPreviewPanel({
  items, restaurant, onClose, onRemove,
}: {
  items: OrderItem[];
  restaurant: Restaurant | null;
  onClose: () => void;
  onRemove: (id: string) => void;
}) {
  const total = items.reduce((sum, o) => sum + o.item.price * o.qty, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-[#0a0f1e] rounded-3xl overflow-hidden border border-white/10 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-amber-600 p-5 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white/70 uppercase tracking-widest mb-1">Order Preview</div>
            <div className="text-white font-extrabold text-lg">{restaurant?.name}</div>
            <div className="text-white/70 text-xs">{restaurant?.gate}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-4xl">{restaurant?.emoji}</div>
            <button onClick={onClose} className="mt-2 w-7 h-7 rounded-full bg-black/20 flex items-center justify-center">
              <X size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Items */}
        <div className="p-5 space-y-3">
          {items.map((o) => (
            <div key={o.item.id} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/8">
              <div className="flex items-center gap-3">
                <span className="text-xl">{o.item.emoji}</span>
                <div>
                  <div className="text-white text-sm font-bold">{o.item.name}</div>
                  <div className="text-slate-400 text-xs">{o.qty} × ₹{o.item.price}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white font-extrabold">₹{o.qty * o.item.price}</span>
                <button onClick={() => onRemove(o.item.id)} className="text-red-400 hover:text-red-300">
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="border-t border-white/10 pt-3 flex items-center justify-between">
            <span className="text-slate-300 font-semibold">Total</span>
            <span className="text-white font-extrabold text-xl">₹{total}</span>
          </div>

          {/* Pickup info */}
          <div className="bg-blue-500/10 rounded-2xl p-4 border border-blue-500/20 space-y-2">
            {[
              { icon: <Clock size={14} className="text-blue-400" />, label: 'Estimated Pickup', value: `${restaurant?.deliveryMins} minutes` },
              { icon: <MapPin size={14} className="text-blue-400" />, label: 'Pickup Location', value: restaurant?.gate ?? '' },
              { icon: <Plane size={14} className="text-blue-400" />, label: 'Your Flight', value: FLIGHT_INFO.flightNumber },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  {row.icon} {row.label}
                </div>
                <span className="text-white text-xs font-bold">{row.value}</span>
              </div>
            ))}
          </div>

          <button className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 hover:from-orange-400 hover:to-amber-400 transition-all flex items-center justify-center gap-2">
            <ShoppingBag size={16} /> Confirm Order
          </button>
          <p className="text-center text-slate-500 text-xs">No payment required · Pickup at counter</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AI Food Assistant
// ─────────────────────────────────────────────────────────────────────────────
const AI_RESPONSES: Record<string, { text: string; suggestions?: string[] }> = {
  default: {
    text: "Based on your health profile (Diabetes, Lactose Intolerance), I recommend **Grilled Vegetable Bowl** at Fresh Greens (Gate 18) or **Millet Khichdi**. Both are low-GI, dairy-free, and nut-free. 🥗",
    suggestions: ['Show nearest options', 'Vegan choices only', 'Best for long flight'],
  },
  flight: {
    text: "For a 4-hour flight: eat a **light, high-fiber meal** 45-60 minutes before boarding. Avoid heavy fried food and carbonated drinks. Best pick: Grilled Vegetable Bowl or Clear Vegetable Broth. Stay hydrated! ✈️",
    suggestions: ['Order Grilled Bowl', 'View hydration options'],
  },
  protein: {
    text: "High-protein vegetarian options near your gate: **Avocado Green Bowl** (Fresh Greens, ₹290) · **Veggie Delight Sub** (Subway, ₹220) · **Steamed Veg Dumplings** (Wok Express, ₹160). All are diabetic-safe! 💪",
    suggestions: ['Order from Fresh Greens', 'Show all protein meals'],
  },
  gluten: {
    text: "Gluten-free options near Gate 12: **Garden Fresh Salad Bowl** at Subway (no bread, ₹180) · **Clear Vegetable Broth** at Wok Express (₹100) · **Coconut Water** at Pure Sattvik (₹60). All verified gluten-free! 🌾",
    suggestions: ['Navigate to Gate 12', 'Show Subway menu'],
  },
  acidity: {
    text: "To avoid acidity during travel: avoid spicy, oily, and caffeinated food. Best choices: **Clear Vegetable Broth** · **Steamed Millet Bowl** · plain **Coconut Water**. Avoid coffee, soda, and fried items. 🍵",
    suggestions: ['Order Millet Bowl', 'Find Sattvik Kitchen'],
  },
};

function AIFoodAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>(INITIAL_AI_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('flight') || lower.includes('hour')) return AI_RESPONSES.flight;
    if (lower.includes('protein')) return AI_RESPONSES.protein;
    if (lower.includes('gluten')) return AI_RESPONSES.gluten;
    if (lower.includes('acidity') || lower.includes('acid')) return AI_RESPONSES.acidity;
    return AI_RESPONSES.default;
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: AIChatMessage = {
      id: `u${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => {
      const resp = getResponse(text);
      const aiMsg: AIChatMessage = {
        id: `a${Date.now()}`,
        sender: 'assistant',
        text: resp.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: resp.suggestions,
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 700);
  };

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-purple-700 shadow-xl shadow-violet-500/30 flex items-center justify-center z-40 border border-violet-400/30"
      >
        <Bot size={24} className="text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-[#0a0f1e] animate-pulse" />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-lg bg-[#0a0f1e] rounded-t-3xl border-t border-white/10 overflow-hidden flex flex-col"
              style={{ maxHeight: '70vh' }}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-violet-700 to-purple-700 p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-extrabold text-sm">AI Food Assistant</div>
                    <div className="text-purple-200 text-xs">Personalised for your health profile</div>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${msg.sender === 'user' ? 'bg-violet-600 text-white rounded-2xl rounded-br-sm' : 'bg-white/8 text-slate-200 rounded-2xl rounded-bl-sm border border-white/10'} px-4 py-2.5 text-sm`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.suggestions && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {msg.suggestions.map((s) => (
                            <button
                              key={s}
                              onClick={() => sendMessage(s)}
                              className="text-xs bg-white/10 hover:bg-white/20 text-violet-300 px-2.5 py-1 rounded-full border border-violet-500/30 transition-all"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-[9px] text-white/40 mt-1">{msg.timestamp}</div>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-white/10 shrink-0">
                <div className="flex items-center gap-2 bg-white/5 rounded-2xl border border-white/10 px-4 py-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                    placeholder="Ask about meals, allergies, flight food..."
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    onClick={() => sendMessage(input)}
                    disabled={!input.trim()}
                    className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center disabled:opacity-40 transition-all"
                  >
                    <Send size={14} className="text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function FoodMarketplacePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [orderRestaurant, setOrderRestaurant] = useState<Restaurant | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showOrder, setShowOrder] = useState(false);

  // Read boarding data for flight-aware widgets
  const [hasFlight, setHasFlight] = useState(false);
  useEffect(() => {
    setHasFlight(!!sessionStorage.getItem('boardingData'));
  }, []);

  // Filter restaurants
  const filteredRestaurants = RESTAURANTS.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === 'all' || r.tags.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const handleAddToOrder = (item: MenuItem, restaurant: Restaurant) => {
    setOrderRestaurant(restaurant);
    setOrderItems((prev) => {
      const existing = prev.find((o) => o.item.id === item.id);
      if (existing) return prev.map((o) => o.item.id === item.id ? { ...o, qty: o.qty + 1 } : o);
      return [...prev, { item, qty: 1 }];
    });
    setSelectedRestaurant(null);
    setShowOrder(true);
  };

  const handleRemoveFromOrder = (itemId: string) => {
    setOrderItems((prev) => {
      const updated = prev.filter((o) => o.item.id !== itemId);
      if (updated.length === 0) setShowOrder(false);
      return updated;
    });
  };

  const orderCount = orderItems.reduce((s, o) => s + o.qty, 0);

  return (
    <div className="min-h-screen bg-[#070d1a] pb-28 font-sans">
      <div className="max-w-3xl mx-auto">

        {/* ── TOP HEADER ── */}
        <div className="sticky top-0 z-30 bg-[#070d1a]/95 backdrop-blur-xl border-b border-white/5 px-4 pt-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex-1 mx-3">
              <h1 className="text-white font-extrabold text-base leading-tight">
                🍽️ Airport Food Marketplace
              </h1>
              <p className="text-slate-400 text-[11px] leading-snug">
                Smart meals based on your health profile & flight schedule
              </p>
            </div>
            {orderCount > 0 && (
              <button
                onClick={() => setShowOrder(true)}
                className="relative w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400"
              >
                <ShoppingBag size={18} />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-orange-500 rounded-full text-white text-[10px] font-extrabold flex items-center justify-center">
                  {orderCount}
                </span>
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search restaurants, healthy meals, diabetic food, vegan options..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500/50 focus:bg-white/8 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 space-y-6 pt-4">

          {/* Category chips */}
          <CategoryChips active={activeCategory} onSelect={setActiveCategory} />

          {/* Flight aware widget (only if boarding data exists) */}
          {hasFlight && <FlightAwareWidget />}
          {!hasFlight && (
            <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 px-4 py-3 flex items-center gap-3">
              <Plane size={18} className="text-blue-400 shrink-0" />
              <p className="text-xs text-slate-400">
                <span className="text-blue-300 font-semibold">Scan your boarding pass</span> on the home page to unlock flight-aware meal timing and personalised recommendations.
              </p>
            </div>
          )}

          {/* Featured banner */}
          {!searchQuery && activeCategory === 'all' && <FeaturedBanner />}

          {/* Medication reminder */}
          <MedicationBanner />

          {/* ── RECOMMENDED MEALS ── */}
          {!searchQuery && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-extrabold text-sm flex items-center gap-2">
                  <Heart size={15} className="text-emerald-400" />
                  Meals for Your Health Profile
                </h2>
                <span className="text-[10px] text-slate-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full text-emerald-400 font-bold">
                  AI Curated
                </span>
              </div>
              <div className="space-y-3">
                {MEAL_RECOMMENDATIONS.map((meal) => (
                  <MealRecommendationCard
                    key={meal.id}
                    meal={meal}
                    onOrder={(m) => {
                      const rest = RESTAURANTS.find((r) => r.name === m.restaurant) ?? RESTAURANTS[0];
                      const menuItem = rest.recommended.find((i) => i.name === m.name) ?? rest.recommended[0];
                      handleAddToOrder(menuItem, rest);
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── NEARBY RESTAURANTS ── */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-extrabold text-sm flex items-center gap-2">
                <MapPin size={15} className="text-orange-400" />
                {searchQuery ? `Results for "${searchQuery}"` : 'Nearby Airport Restaurants'}
              </h2>
              <span className="text-slate-400 text-xs">{filteredRestaurants.length} open</span>
            </div>

            {filteredRestaurants.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-sm">
                <div className="text-4xl mb-3">🔍</div>
                No restaurants found. Try a different search or category.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {filteredRestaurants.map((r) => (
                  <RestaurantCard
                    key={r.id}
                    restaurant={r}
                    onClick={() => setSelectedRestaurant(r)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* ── HEALTH PROFILE SUMMARY ── */}
          {!searchQuery && (
            <section className="rounded-2xl bg-gradient-to-br from-[#0d1628] to-[#0a1020] border border-white/8 p-4">
              <h3 className="text-white font-extrabold text-sm mb-3 flex items-center gap-2">
                <Zap size={15} className="text-violet-400" />
                Your Health Profile (Active)
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Diabetes', 'Lactose Intolerance', 'Nut Allergy', 'Vegetarian', 'Low Sodium'].map((cond) => (
                  <span key={cond} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {cond}
                  </span>
                ))}
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Restaurant compatibility is calculated in real-time based on your active health conditions. Items marked <span className="text-emerald-400 font-bold">Recommended</span> are verified safe. <span className="text-red-400 font-bold">Avoid</span> items may conflict with your profile.
              </p>
            </section>
          )}

        </div>
      </div>

      {/* Restaurant Detail Modal */}
      <AnimatePresence>
        {selectedRestaurant && (
          <RestaurantDetailModal
            restaurant={selectedRestaurant}
            onClose={() => setSelectedRestaurant(null)}
            onAddToOrder={(item) => handleAddToOrder(item, selectedRestaurant)}
          />
        )}
      </AnimatePresence>

      {/* Order Preview */}
      <AnimatePresence>
        {showOrder && orderItems.length > 0 && (
          <OrderPreviewPanel
            items={orderItems}
            restaurant={orderRestaurant}
            onClose={() => setShowOrder(false)}
            onRemove={handleRemoveFromOrder}
          />
        )}
      </AnimatePresence>

      {/* AI Food Assistant */}
      <AIFoodAssistant />

      <BottomNavigation />
    </div>
  );
}
