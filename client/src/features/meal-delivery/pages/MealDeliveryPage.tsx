import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  X,
  Plane,
  ShoppingBag,
  ChevronRight,
  CheckCircle2,
  QrCode,
  Users,
  Sparkles,
  ChevronDown,
  Utensils,
  Package,
} from 'lucide-react'
import {
  RESTAURANTS,
  TRACKING_STEPS,
  AI_RECOMMENDATIONS,
  Restaurant,
  MenuItem,
  CartItem,
  PlacedOrder,
} from '../data/mealDeliveryData'

type View = 'landing' | 'menu' | 'checkout' | 'confirmation' | 'tracking' | 'qr' | 'crew'

interface TicketInfo {
  passengerName: string
  airline: string
  flightNumber: string
  from: string
  to: string
  gate: string
  boardingTime: string
  seat: string
  terminal: string
  date: string
}

export default function MealDeliveryPage() {
  const navigate = useNavigate()
  const [view, setView] = useState<View>('landing')
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [order, setOrder] = useState<PlacedOrder | null>(null)
  const [trackingStep, setTrackingStep] = useState(0)

  const ticket: TicketInfo = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('boardingData')
      if (raw) {
        const d = JSON.parse(raw)
        return {
          passengerName: d.passenger_name || 'Sai Venkat',
          airline: 'Air India',
          flightNumber: d.flight_id || 'AI 542',
          from: d.from || 'HYD',
          to: d.to || 'DEL',
          gate: 'A12',
          boardingTime: '3:20 PM',
          seat: d.seat || '18A',
          terminal: d.terminal || 'T3',
          date: d.date || new Date().toLocaleDateString(),
        }
      }
    } catch {}
    return {
      passengerName: 'Sai Venkat',
      airline: 'Air India',
      flightNumber: 'AI 542',
      from: 'HYD',
      to: 'DEL',
      gate: 'A12',
      boardingTime: '3:20 PM',
      seat: '18A',
      terminal: 'T3',
      date: new Date().toLocaleDateString(),
    }
  }, [])

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id)
      if (existing) return prev.map((c) => (c.item.id === item.id ? { ...c, qty: c.qty + 1 } : c))
      return [...prev, { item, qty: 1 }]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId)
      if (!existing) return prev
      if (existing.qty <= 1) return prev.filter((c) => c.item.id !== itemId)
      return prev.map((c) => (c.item.id === itemId ? { ...c, qty: c.qty - 1 } : c))
    })
  }

  const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.qty, 0)
  const cartCount = cart.reduce((s, c) => s + c.qty, 0)

  const placeOrder = () => {
    const newOrder: PlacedOrder = {
      orderId: `#AFD${Math.floor(1000 + Math.random() * 9000)}`,
      restaurantName: selectedRestaurant?.name ?? '',
      restaurantEmoji: selectedRestaurant?.emoji ?? '🍽️',
      items: [...cart],
      total: cartTotal,
      flightNumber: ticket.flightNumber,
      airline: ticket.airline,
      passengerName: ticket.passengerName,
      seat: ticket.seat,
      gate: ticket.gate,
      boardingTime: ticket.boardingTime,
      placedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setOrder(newOrder)
    setTrackingStep(0)
    setView('confirmation')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (view === 'landing') navigate('/')
              else setView('landing')
            }}
            className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#14C8FF]">
              Airport Commerce Hub
            </span>
            <h1 className="text-2xl font-black text-[#F8FAFC]">Airport-to-Aircraft Meal Delivery</h1>
          </div>
        </div>
      </div>

      {/* Main Landing View */}
      {view === 'landing' && (
        <div className="space-y-6">
          {/* Restaurant Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {RESTAURANTS.map((res) => (
              <div
                key={res.id}
                onClick={() => {
                  setSelectedRestaurant(res)
                  setCart([])
                  setView('menu')
                }}
                className="p-5 rounded-[24px] bg-[#0F1E35] hover:bg-[#162742] border border-white/10 shadow-xl cursor-pointer transition-all space-y-4 group"
              >
                <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#162742] to-[#071326] flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  {res.emoji}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#F8FAFC]">{res.name}</h3>
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {res.rating}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">{res.cuisine}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-[#94A3B8] border-t border-white/10 pt-3">
                  <span>Prep: {res.prepMins} mins</span>
                  <span className="text-[#14C8FF] font-semibold">{res.gate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu View */}
      {view === 'menu' && selectedRestaurant && (
        <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">{selectedRestaurant.name} Menu</h2>
              <p className="text-xs text-[#94A3B8]">{selectedRestaurant.cuisine}</p>
            </div>
            <button
              onClick={() => setView('checkout')}
              disabled={cartCount === 0}
              className="btn btn-primary text-xs"
            >
              <span>View Order ({cartCount})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {selectedRestaurant.menu.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-[#162742] border border-white/5 space-y-3 flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-[#F8FAFC]">{item.name}</div>
                  <div className="text-xs text-[#94A3B8]">{item.description}</div>
                  <div className="text-sm font-extrabold text-[#14C8FF] mt-2">₹{item.price}</div>
                </div>
                <button
                  onClick={() => addToCart(item)}
                  className="p-2 rounded-xl bg-[#2F80FF] hover:bg-[#1E6DFF] text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checkout View */}
      {view === 'checkout' && (
        <div className="p-6 rounded-[28px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-[#F8FAFC]">Confirm Airport-to-Aircraft Order</h2>
          <div className="space-y-3">
            {cart.map((c) => (
              <div key={c.item.id} className="p-4 rounded-2xl bg-[#162742] flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#F8FAFC]">{c.item.name}</div>
                  <div className="text-xs text-[#94A3B8]">Qty: {c.qty}</div>
                </div>
                <div className="text-sm font-bold text-[#14C8FF]">₹{c.item.price * c.qty}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <span className="text-base font-bold text-[#F8FAFC]">Total Amount</span>
            <span className="text-2xl font-black text-[#22C55E]">₹{cartTotal}</span>
          </div>
          <button onClick={placeOrder} className="w-full btn btn-primary">
            Confirm Seat Delivery to {ticket.seat}
          </button>
        </div>
      )}

      {/* Confirmation View — Zomato/Swiggy-style Order Status Card */}
      {view === 'confirmation' && order && (() => {
        const ORDER_STEPS = [
          { label: 'Order Confirmed', icon: '✅', desc: 'Kitchen notified', done: true },
          { label: 'Being Prepared', icon: '👨‍🍳', desc: 'Chef is cooking your meal', done: trackingStep >= 1 },
          { label: 'Quality Check', icon: '🔍', desc: 'Checked for hygiene & packing', done: trackingStep >= 2 },
          { label: 'Boarding Pass Scanned', icon: '🎫', desc: 'Runner heading to your gate', done: trackingStep >= 3 },
          { label: 'Delivered to Seat', icon: '💺', desc: `Seat ${ticket.seat} — Bon appétit!`, done: trackingStep >= 4 },
        ]
        const currentStep = ORDER_STEPS.findLastIndex(s => s.done)
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            {/* Top success banner */}
            <div className="p-5 rounded-[24px] bg-gradient-to-r from-emerald-500/20 via-[#0F1E35] to-[#0F1E35] border border-emerald-400/30 flex items-center gap-4 shadow-xl shadow-emerald-500/5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shrink-0 animate-bounce">
                {order.restaurantEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Order Logged Successfully</div>
                <div className="text-lg font-extrabold text-[#F8FAFC] truncate">{order.restaurantName}</div>
                <div className="text-xs text-[#94A3B8]">Order ID: <span className="text-[#14C8FF] font-mono font-bold">{order.orderId}</span> • Placed at {order.placedAt}</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
            </div>

            {/* Live Tracking Stepper */}
            <div className="p-5 rounded-[24px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-[#F8FAFC]">Live Order Tracking</div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>

              <div className="space-y-3">
                {ORDER_STEPS.map((step, i) => {
                  const isActive = i === currentStep + 1 || (currentStep === ORDER_STEPS.length - 1 && i === ORDER_STEPS.length - 1)
                  const isDone = step.done
                  return (
                    <div key={i} className="flex items-start gap-3">
                      {/* Timeline dot + line */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-500/30'
                            : isActive
                            ? 'bg-[#2F80FF]/20 border-[#2F80FF] text-[#14C8FF] animate-pulse'
                            : 'bg-white/5 border-white/15 text-[#64748B]'
                        }`}>
                          {isDone ? '✓' : step.icon}
                        </div>
                        {i < ORDER_STEPS.length - 1 && (
                          <div className={`w-0.5 h-6 mt-1 rounded-full transition-all ${isDone ? 'bg-emerald-400/50' : 'bg-white/10'}`} />
                        )}
                      </div>
                      {/* Step info */}
                      <div className="flex-1 min-w-0 pt-1">
                        <div className={`text-sm font-bold ${isDone ? 'text-[#F8FAFC]' : isActive ? 'text-[#14C8FF]' : 'text-[#64748B]'}`}>
                          {step.label}
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">{step.desc}</div>
                      </div>
                      {isDone && <div className="text-[10px] text-emerald-400 font-bold shrink-0 pt-1.5">Done</div>}
                    </div>
                  )
                })}
              </div>

              {/* Simulate progress button (for demo) */}
              {trackingStep < ORDER_STEPS.length - 1 && (
                <button
                  onClick={() => setTrackingStep(s => Math.min(s + 1, ORDER_STEPS.length - 1))}
                  className="w-full py-2.5 text-xs font-bold rounded-xl bg-[#2F80FF]/15 hover:bg-[#2F80FF]/25 border border-[#2F80FF]/30 text-[#14C8FF] transition-all"
                >
                  Simulate Next Step →
                </button>
              )}
            </div>

            {/* Order Summary Card */}
            <div className="p-5 rounded-[24px] bg-[#0F1E35] border border-white/10 shadow-xl space-y-4">
              <div className="text-sm font-extrabold text-[#F8FAFC]">Order Summary</div>
              <div className="space-y-2">
                {order.items.map((c) => (
                  <div key={c.item.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-md bg-[#2F80FF]/20 text-[#14C8FF] text-[10px] font-extrabold flex items-center justify-center border border-[#2F80FF]/30">
                        {c.qty}×
                      </span>
                      <span className="text-sm text-[#F8FAFC] font-medium">{c.item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-[#14C8FF]">₹{c.item.price * c.qty}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wider">Total Paid</span>
                <span className="text-xl font-black text-[#22C55E]">₹{order.total}</span>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Seat', value: ticket.seat, icon: '💺', color: 'text-[#14C8FF]' },
                { label: 'Gate', value: ticket.gate, icon: '🚪', color: 'text-amber-400' },
                { label: 'Boarding', value: ticket.boardingTime, icon: '⏰', color: 'text-violet-400' },
              ].map((info) => (
                <div key={info.label} className="p-3 rounded-2xl bg-[#0F1E35] border border-white/10 text-center space-y-1">
                  <div className="text-xl">{info.icon}</div>
                  <div className={`text-sm font-extrabold ${info.color}`}>{info.value}</div>
                  <div className="text-[10px] text-[#64748B] uppercase tracking-wider">{info.label}</div>
                </div>
              ))}
            </div>

            {/* Back to restaurants */}
            <button
              onClick={() => { setView('landing'); setCart([]); setOrder(null); setTrackingStep(0) }}
              className="w-full py-3.5 rounded-2xl bg-[#0F1E35] hover:bg-[#162742] border border-white/10 text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-bold transition-all"
            >
              ← Order from Another Restaurant
            </button>
          </motion.div>
        )
      })()}
    </div>
  )
}
