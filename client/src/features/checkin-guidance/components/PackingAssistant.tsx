import React, { useState, useEffect } from 'react'

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

interface PackingCategory {
  title: string
  items: ChecklistItem[]
}

const DEFAULT_LISTS: Record<string, Record<string, string[]>> = {
  business: {
    'Documents & Money': [
      'Passport & Visas (Physical + Digital)',
      'Boarding Pass & Hotel Bookings',
      'Corporate ID & Business Cards',
      'Credit Cards & local currency cash'
    ],
    'Professional Clothes': [
      'Formal Suit / Blazer',
      'Press shirts & ties (x3)',
      'Formal leather shoes & belt',
      'Socks & undershirts'
    ],
    'Electronics': [
      'Work Laptop & Charger',
      'Phone & Smartwatch Chargers',
      'International Travel Adaptor',
      'Noise-canceling headphones',
      'Power Bank (Must go in Cabin!)'
    ],
    'Toiletries & Self Care': [
      'Toothbrush & travel toothpaste',
      'Hair gel / comb',
      'Deodorant (max 100ml for cabin)',
      'Prescription medicines'
    ]
  },
  beach: {
    'Documents & Money': [
      'Passport & Visas',
      'Flight tickets & Resort vouchers',
      'Travel health insurance docs',
      'Cash / cards'
    ],
    'Casual Wear': [
      'Swim shorts / swimsuits (x2)',
      'Light t-shirts & shorts',
      'Sunglasses & sun hat',
      'Flip-flops & sandals'
    ],
    'Sun & Protection': [
      'Sunscreen SPF 50+ (liquid rules!)',
      'After-sun aloe gel',
      'Beach towel',
      'Dry pouch for smartphone'
    ],
    'Electronics': [
      'Waterproof camera / GoPro',
      'E-reader / Kindle',
      'Bluetooth speaker',
      'Charging cables'
    ]
  },
  cold: {
    'Documents & Money': [
      'Passport & Visas',
      'Flight tickets & Hotel vouchers',
      'Emergency contacts sheet'
    ],
    'Winter Apparel': [
      'Heavy insulated jacket / parkas',
      'Thermal base layers (tops & bottoms)',
      'Woolen socks & thermal gloves',
      'Beanie / scarf',
      'Sturdy waterproof boots'
    ],
    'Skincare & Comfort': [
      'Heavy lip balm / chapstick',
      'Moisturizing skin lotion',
      'Hand warmers packs'
    ],
    'Electronics': [
      'Extra battery pack (cold drains charge faster)',
      'Camera with lens hood',
      'Charging cables'
    ]
  }
}

export default function PackingAssistant() {
  const [profile, setProfile] = useState<'business' | 'beach' | 'cold'>('business')
  const [duration, setDuration] = useState<'short' | 'medium' | 'long'>('medium')
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Custom checklist state loaded from localStorage if exists
  const [categories, setCategories] = useState<PackingCategory[]>([])
  const [newItemText, setNewItemText] = useState('')
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)

  // Load from localStorage on mount or profile load
  useEffect(() => {
    const saved = localStorage.getItem(`packing_list_${profile}_${duration}`)
    if (saved) {
      setCategories(JSON.parse(saved))
    } else {
      generateList(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, duration])

  // Save to localStorage when categories change
  const saveToLocalStorage = (updated: PackingCategory[]) => {
    localStorage.setItem(`packing_list_${profile}_${duration}`, JSON.stringify(updated))
  }

  function generateList(withAnimation = true) {
    if (withAnimation) {
      setIsGenerating(true)
    }

    const template = DEFAULT_LISTS[profile]
    const multiplier = duration === 'short' ? 0.7 : duration === 'medium' ? 1.0 : 1.5

    const newCategories: PackingCategory[] = Object.entries(template).map(([title, items]) => {
      // Adjust count of clothes or quantity items if duration changes
      const parsedItems = items.map((item, idx) => {
        let adjustedText = item
        if (item.includes('(x')) {
          const baseText = item.split('(x')[0].trim()
          const count = Math.max(1, Math.round(3 * multiplier))
          adjustedText = `${baseText} (x${count})`
        }
        return {
          id: `${profile}_${duration}_${title.replace(/\s+/g, '')}_${idx}`,
          text: adjustedText,
          completed: false
        }
      })
      return { title, items: parsedItems }
    })

    if (withAnimation) {
      setTimeout(() => {
        setCategories(newCategories)
        saveToLocalStorage(newCategories)
        setIsGenerating(false)
      }, 1000)
    } else {
      setCategories(newCategories)
      saveToLocalStorage(newCategories)
    }
  }

  function toggleItem(catIdx: number, itemIdx: number) {
    const nextCategories = [...categories]
    const targetItem = nextCategories[catIdx].items[itemIdx]
    targetItem.completed = !targetItem.completed
    setCategories(nextCategories)
    saveToLocalStorage(nextCategories)
  }

  function addNewItem(e: React.FormEvent) {
    e.preventDefault()
    if (!newItemText.trim() || categories.length === 0) return

    const nextCategories = [...categories]
    nextCategories[activeCategoryIndex].items.push({
      id: `custom_${Date.now()}`,
      text: newItemText.trim(),
      completed: false
    })

    setCategories(nextCategories)
    saveToLocalStorage(nextCategories)
    setNewItemText('')
  }

  function deleteItem(catIdx: number, itemIdx: number) {
    const nextCategories = [...categories]
    nextCategories[catIdx].items.splice(itemIdx, 1)
    setCategories(nextCategories)
    saveToLocalStorage(nextCategories)
  }

  const totalItemsCount = categories.reduce((sum, cat) => sum + cat.items.length, 0)
  const completedItemsCount = categories.reduce((sum, cat) => sum + cat.items.filter(i => i.completed).length, 0)
  const progressPercent = totalItemsCount > 0 ? Math.round((completedItemsCount / totalItemsCount) * 100) : 0

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Smart Packing Planner</h3>
          <p className="text-xs text-slate-400">Generate, customize, and verify your baggage packing checklists.</p>
        </div>
      </div>

      {/* Generator setup */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Destination Vibe</label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="business">👔 Business / Corporate</option>
              <option value="beach">🏖️ Beach / Tropical Resort</option>
              <option value="cold">❄️ Winter / Cold climate</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Trip Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="short">Short Stay (1-3 days)</option>
              <option value="medium">Standard (4-7 days)</option>
              <option value="long">Extended (8+ days)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => generateList(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition shadow-sm h-[32px]"
            >
              Regenerate Template
            </button>
          </div>
        </div>

        {/* Packing Progress */}
        {totalItemsCount > 0 && (
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Packing Progress</span>
              <span>{completedItemsCount} / {totalItemsCount} packed ({progressPercent}%)</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-purple-600 h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {isGenerating ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-sm font-semibold animate-pulse text-purple-700">Analyzing trip parameters...</div>
          <div className="text-[10px] mt-1 text-slate-400">Applying airport luggage policies to checklists</div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Category checklist blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat, catIdx) => (
              <div key={cat.title} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex justify-between items-center">
                  <span>{cat.title}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {cat.items.filter(i => i.completed).length}/{cat.items.length}
                  </span>
                </h4>

                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {cat.items.map((item, itemIdx) => (
                    <div key={item.id} className="flex items-center justify-between group bg-white border border-slate-100 rounded-lg p-2 hover:border-slate-200 transition">
                      <label className="flex items-start gap-2.5 cursor-pointer flex-1 select-none">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleItem(catIdx, itemIdx)}
                          className="mt-0.5 w-3.5 h-3.5 text-purple-600 border-slate-300 rounded focus:ring-purple-500"
                        />
                        <span className={`text-xs ${item.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-700 font-medium'}`}>
                          {item.text}
                        </span>
                      </label>
                      
                      <button
                        onClick={() => deleteItem(catIdx, itemIdx)}
                        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition text-[10px] px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  {cat.items.length === 0 && (
                    <div className="text-center py-4 text-slate-400 text-xs italic">
                      Empty category. Add items below.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add custom item form */}
          {categories.length > 0 && (
            <form onSubmit={addNewItem} className="border-t border-slate-100 pt-4 flex gap-2">
              <div className="flex-1 flex gap-2">
                <select
                  value={activeCategoryIndex}
                  onChange={(e) => setActiveCategoryIndex(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {categories.map((c, idx) => (
                    <option key={idx} value={idx}>{c.title}</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Add custom packing item..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs shadow-xs"
              >
                Add Item
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
