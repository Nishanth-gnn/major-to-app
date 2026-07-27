import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { pois, POINode } from '../data/mapData';

type Props = {
  onSelect: (poi: POINode | null) => void;
  selectedPOI: POINode | null;
};

export default function SearchBar({ onSelect, selectedPOI }: Props) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external selection back to search input
  useEffect(() => {
    if (selectedPOI) {
      setQuery(selectedPOI.label);
      setIsOpen(false);
    } else {
      setQuery('');
    }
  }, [selectedPOI]);

  const filtered = pois.filter(p => p.label.toLowerCase().includes(query.toLowerCase()));

  const handleSelect = (poi: POINode) => {
    onSelect(poi);
    setQuery(poi.label);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const clearSearch = () => {
    setQuery('');
    onSelect(null);
    inputRef.current?.focus();
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 relative z-50">
      <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/50 dark:border-slate-700/50 overflow-hidden flex items-center transition-all focus-within:shadow-[0_8px_30px_rgb(59,130,246,0.2)] focus-within:ring-2 focus-within:ring-blue-400">
        <div className="pl-5 pr-3 text-blue-500">
          <Search size={22} />
        </div>
        
        <input 
          ref={inputRef}
          type="text" 
          placeholder="Where do you want to go?"
          className="flex-1 py-4 bg-transparent text-slate-800 dark:text-slate-100 outline-none placeholder:text-slate-400 dark:placeholder-slate-500 font-semibold text-lg"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') {
              onSelect(null);
            }
          }}
          onFocus={() => setIsOpen(true)}
        />

        {query && (
          <button 
            onClick={clearSearch}
            className="p-3 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (query || true) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-20 left-4 right-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-slate-700/50 overflow-hidden max-h-80 overflow-y-auto"
          >
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-slate-500 dark:text-slate-400 font-medium">
                No destinations found for "{query}"
              </div>
            ) : (
              <ul className="py-2">
                {filtered.map(poi => (
                  <li key={poi.id}>
                    <button 
                      onClick={() => handleSelect(poi)}
                      className="w-full text-left px-4 py-3 flex items-center gap-4 hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors"
                    >
                      <div className="bg-blue-100 dark:bg-blue-900/50 p-2.5 rounded-full text-blue-600 dark:text-blue-400 shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{poi.label}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{poi.category}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
