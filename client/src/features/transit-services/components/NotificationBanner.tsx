import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bell, AlertTriangle, CheckCircle, Info, X, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TransitNotification } from '../types';

interface NotificationBannerProps {
  notifications: TransitNotification[];
  onMarkRead?: (id: string) => void;
}

export default function NotificationBanner({ notifications, onMarkRead }: NotificationBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<TransitNotification[]>(notifications);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);

  const unreadCount = items.filter(n => !n.read).length;

  const handleToggleRead = (id: string) => {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    if (onMarkRead) onMarkRead(id);
  };

  const getIcon = (type: TransitNotification['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={15} className="text-amber-400 shrink-0" />;
      case 'success': return <CheckCircle size={15} className="text-emerald-400 shrink-0" />;
      case 'alert': return <AlertTriangle size={15} className="text-red-400 shrink-0" />;
      default: return <Info size={15} className="text-blue-400 shrink-0" />;
    }
  };

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        right: (document.documentElement.clientWidth - rect.right) + window.scrollX,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('resize', updateCoords);
      window.addEventListener('scroll', updateCoords);
    }
    return () => {
      window.removeEventListener('resize', updateCoords);
      window.removeEventListener('scroll', updateCoords);
    };
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2.5 text-slate-300 hover:text-white transition-all flex items-center gap-2"
        title="Transit Notifications Center"
      >
        <Bell size={18} />
        <span className="text-xs font-bold hidden sm:inline-block">Alerts</span>
        {unreadCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center Dropdown */}
      <AnimatePresence>
        {isOpen && coords && createPortal(
          <>
            {/* Backdrop to close on background clicks */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 8990 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: 'absolute',
                top: coords.top + 8, // mt-2 offset
                right: coords.right,
                zIndex: 9000,
              }}
              className="w-80 sm:w-96 bg-[#0a1020]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl overflow-hidden divide-y divide-white/8"
            >
              <div className="p-3.5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                  <Volume2 size={16} className="text-blue-400" />
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Transit Alerts & Live Updates
                  </h4>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto custom-scrollbar p-2 space-y-1.5">
                {items.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">No active notifications</div>
                ) : (
                  items.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleToggleRead(n.id)}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all flex items-start gap-2.5 ${
                        n.read ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/8 border-blue-500/30'
                      }`}
                    >
                      {getIcon(n.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="text-xs font-bold text-white">{n.title}</h5>
                          <span className="text-[9px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{n.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>,
          document.body
        )}
      </AnimatePresence>
    </div>
  );
}
