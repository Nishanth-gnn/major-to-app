import React, { useState } from 'react'

interface ProhibitedItem {
  id: string
  name: string
  category: 'liquids' | 'electronics' | 'dangerous' | 'other'
  cabin: 'yes' | 'no' | 'warning'
  cabinText: string
  checked: 'yes' | 'no' | 'warning'
  checkedText: string
  tips: string
}

const ITEMS: ProhibitedItem[] = [
  {
    id: 'powerbank',
    name: 'Power Bank (Lithium Battery)',
    category: 'electronics',
    cabin: 'warning',
    cabinText: 'Allowed (Max 20,000mAh)',
    checked: 'no',
    checkedText: 'Strictly Prohibited',
    tips: 'Must carry on your person or in cabin baggage only. Do not place in checked luggage due to fire risk.'
  },
  {
    id: 'perfume',
    name: 'Perfumes & Aerosols (<100ml)',
    category: 'liquids',
    cabin: 'warning',
    cabinText: 'Allowed under 100ml',
    checked: 'yes',
    checkedText: 'Allowed in Checked',
    tips: 'Hand luggage items must fit inside a transparent, resealable 1-litre plastic bag.'
  },
  {
    id: 'shampoo',
    name: 'Shampoo & Conditioner (>100ml)',
    category: 'liquids',
    cabin: 'no',
    cabinText: 'Strictly Prohibited',
    checked: 'yes',
    checkedText: 'Allowed in Checked',
    tips: 'Any liquid container larger than 100ml must go into checked luggage, even if only partially full.'
  },
  {
    id: 'laptop',
    name: 'Laptop & Tablet',
    category: 'electronics',
    cabin: 'yes',
    cabinText: 'Allowed',
    checked: 'warning',
    checkedText: 'Allowed (Must be powered off)',
    tips: 'Laptops must be removed from your bag and placed in a separate tray during security screening.'
  },
  {
    id: 'scissors',
    name: 'Scissors / Pocket Knife',
    category: 'dangerous',
    cabin: 'no',
    cabinText: 'Strictly Prohibited',
    checked: 'yes',
    checkedText: 'Allowed in Checked',
    tips: 'Blades must be shorter than 6cm to be allowed in checked baggage on some flights, otherwise checked is fine.'
  },
  {
    id: 'lighter',
    name: 'Matchbox / Lighter',
    category: 'dangerous',
    cabin: 'warning',
    cabinText: '1 allowed on body only',
    checked: 'no',
    checkedText: 'Strictly Prohibited',
    tips: 'Must be carried on your person. Do not leave it inside hand baggage or checked baggage.'
  },
  {
    id: 'dryice',
    name: 'Dry Ice (for preservation)',
    category: 'other',
    cabin: 'warning',
    cabinText: 'Airline Approval Req.',
    checked: 'warning',
    checkedText: 'Airline Approval Req.',
    tips: 'Maximum 2.5 kg per person. Packages must allow release of carbon dioxide gas.'
  },
  {
    id: 'medication',
    name: 'Prescription Medicines (Liquid)',
    category: 'other',
    cabin: 'yes',
    cabinText: 'Allowed (Carry prescription)',
    checked: 'yes',
    checkedText: 'Allowed',
    tips: 'Exempt from the 100ml liquid rule. Be prepared to show your medical certificate or prescription.'
  },
  {
    id: 'alcohol',
    name: 'Alcoholic Beverages',
    category: 'liquids',
    cabin: 'no',
    cabinText: 'Prohibited (except Duty Free)',
    checked: 'warning',
    checkedText: 'Max 5 Liters per person',
    tips: 'Must be in retail packaging with 24%–70% alcohol by volume. Duty-free alcohol is allowed in cabin if sealed in security bag.'
  },
  {
    id: 'spray',
    name: 'Pepper Spray',
    category: 'dangerous',
    cabin: 'no',
    cabinText: 'Strictly Prohibited',
    checked: 'no',
    checkedText: 'Strictly Prohibited',
    tips: 'Self-defense sprays are completely banned on aircraft and inside airport terminals.'
  }
]

export default function ProhibitedItems() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'liquids' | 'electronics' | 'dangerous' | 'other'>('all')

  const filteredItems = ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tips.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  function getBadgeStyle(status: 'yes' | 'no' | 'warning') {
    switch (status) {
      case 'yes':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'no':
        return 'bg-red-50 text-red-700 border-red-200'
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200'
    }
  }

  function getStatusIcon(status: 'yes' | 'no' | 'warning') {
    switch (status) {
      case 'yes':
        return (
          <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
        )
      case 'no':
        return (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">✗</span>
        )
      case 'warning':
        return (
          <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs">!</span>
        )
    }
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Prohibited & Restricted Items Scanner</h3>
          <p className="text-xs text-slate-400">Search and verify regulations for items in cabin and checked luggage.</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items (e.g. power bank, dry ice, perfume...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-3.5 text-slate-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>

        {/* Categories Tab Row */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'liquids', 'electronics', 'dangerous', 'other'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors duration-150 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of items */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 transition-all duration-200 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 text-sm">{item.name}</span>
                <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-widest px-2 py-0.5 bg-slate-200 rounded">
                  {item.category}
                </span>
              </div>

              {/* Cabin & Checked boxes */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${getBadgeStyle(item.cabin)}`}>
                  {getStatusIcon(item.cabin)}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Cabin Bag</div>
                    <div className="text-xs font-bold">{item.cabinText}</div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-lg border flex items-center gap-2.5 ${getBadgeStyle(item.checked)}`}>
                  {getStatusIcon(item.checked)}
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Checked Bag</div>
                    <div className="text-xs font-bold">{item.checkedText}</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 bg-white p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                <span className="font-semibold text-slate-600">Officer Tip:</span> {item.tips}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400">
            <svg className="mx-auto mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <div className="text-sm font-semibold">No items match your search</div>
            <p className="text-xs mt-1">Try another keyword, or choose a category filter.</p>
          </div>
        )}
      </div>

      {/* Helpful reminder */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3 text-xs text-blue-800 leading-relaxed">
        <span>ℹ️</span>
        <div>
          <strong className="font-bold">Liquids Container Rule:</strong> All liquids, gels, and aerosols in hand luggage must be in containers of <strong className="font-bold">100ml or less</strong>, and all fit in a single, transparent, resealable <strong className="font-bold">1-liter plastic bag</strong>. Containers larger than 100ml must go in checked baggage, even if only partially full.
        </div>
      </div>
    </div>
  )
}
