import React, { useState } from 'react'
import {
  Bell,
  X,
  Plane,
  Train,
  Luggage,
  Utensils,
  ShieldAlert,
  Info,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
} from 'lucide-react'

export interface NotificationItem {
  id: string
  category: 'Flight' | 'Transit' | 'Baggage' | 'Food' | 'Emergency' | 'System'
  priority: 'High' | 'Medium' | 'Low'
  title: string
  description: string
  timestamp: string
  unread: boolean
  actionUrl?: string
  actionLabel?: string
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    category: 'Flight',
    priority: 'High',
    title: 'Gate Changed to T2 - Gate 14B',
    description: 'Flight AI-102 has updated departure gate from 12A to 14B. Boarding starts at 15:45.',
    timestamp: '2 mins ago',
    unread: true,
    actionUrl: '/flight-tracking',
    actionLabel: 'View Flight Gate',
  },
  {
    id: 'n2',
    category: 'Baggage',
    priority: 'Medium',
    title: 'Bag Tag #BAG-8821 Loaded onto Aircraft',
    description: 'Your checked bag has cleared security and is verified loaded in Cargo Hold 3.',
    timestamp: '14 mins ago',
    unread: true,
    actionUrl: '/baggage-guidance',
    actionLabel: 'Track Baggage',
  },
  {
    id: 'n3',
    category: 'Transit',
    priority: 'Low',
    title: 'Airport Express Metro Arriving Platform 2',
    description: 'Next express service departing in 4 mins. Current crowd density is LOW.',
    timestamp: '25 mins ago',
    unread: false,
    actionUrl: '/transit-services/track',
    actionLabel: 'Live Metro Map',
  },
  {
    id: 'n4',
    category: 'Food',
    priority: 'Medium',
    title: 'Order Delivered to Gate 14B',
    description: 'Your order from Urban Bistro has arrived at seat delivery desk.',
    timestamp: '40 mins ago',
    unread: false,
    actionUrl: '/meal-delivery',
    actionLabel: 'View Order Status',
  },
  {
    id: 'n5',
    category: 'Emergency',
    priority: 'High',
    title: 'Medical Assistance Station Nearby',
    description: 'First Aid Center T2 Level 2 is open 24/7. Response team ETA < 3 mins.',
    timestamp: '1 hour ago',
    unread: false,
    actionUrl: '/emergency-contact',
    actionLabel: 'Emergency Hub',
  },
]

interface NotificationCenterModalProps {
  open: boolean
  onClose: () => void
}

export default function NotificationCenterModal({ open, onClose }: NotificationCenterModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  if (!open) return null

  const categories = ['All', 'Flight', 'Transit', 'Baggage', 'Food', 'Emergency', 'System']

  const filtered = notifications.filter((n) => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Flight':
        return <Plane className="w-4 h-4 text-[#2F80FF]" />
      case 'Transit':
        return <Train className="w-4 h-4 text-emerald-400" />
      case 'Baggage':
        return <Luggage className="w-4 h-4 text-cyan-400" />
      case 'Food':
        return <Utensils className="w-4 h-4 text-amber-400" />
      case 'Emergency':
        return <ShieldAlert className="w-4 h-4 text-red-400" />
      default:
        return <Info className="w-4 h-4 text-[#94A3B8]" />
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0F1E35] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#162742]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2F80FF]/20 border border-blue-400/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#2F80FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC]">Operational Notifications</h2>
              <p className="text-xs text-[#94A3B8]">Real-time flight, baggage & transit updates</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllRead}
              className="text-xs text-[#14C8FF] hover:underline font-semibold px-2 py-1"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="p-4 border-b border-white/10 bg-[#071326]/50 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search alert updates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#162742] border border-white/10 rounded-xl text-xs text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2F80FF]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#2F80FF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[#162742] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 text-[#94A3B8]/30 mx-auto mb-3" />
              <div className="text-sm font-semibold text-[#F8FAFC]">No Notifications</div>
              <div className="text-xs text-[#94A3B8]">You are up to date on all operational alerts.</div>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition-all ${
                  item.unread
                    ? 'bg-[#162742] border-blue-500/30 shadow-lg shadow-blue-500/5'
                    : 'bg-[#0F1E35] border-white/5 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F8FAFC]">{item.title}</span>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#2F80FF] animate-pulse" />
                        )}
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed">{item.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] text-[#94A3B8] font-mono">{item.timestamp}</span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            item.priority === 'High'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : item.priority === 'Medium'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}
                        >
                          {item.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>

                  {item.actionLabel && (
                    <a
                      href={item.actionUrl || '#'}
                      onClick={() => onClose()}
                      className="shrink-0 flex items-center gap-1 text-xs font-bold text-[#14C8FF] hover:underline bg-[#2F80FF]/10 px-3 py-1.5 rounded-xl border border-cyan-400/20"
                    >
                      <span>{item.actionLabel}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
