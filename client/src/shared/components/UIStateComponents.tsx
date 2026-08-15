import React from 'react'
import { AlertTriangle, CheckCircle, RefreshCw, Layers, ArrowRight } from 'lucide-react'

// ── SKELETON LOADER ──────────────────────────────────────────
export function SkeletonLoader({ count = 3, height = 'h-20' }: { count?: number; height?: string }) {
  return (
    <div className="space-y-3 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`w-full ${height} bg-[#162742] rounded-2xl border border-white/5`} />
      ))}
    </div>
  )
}

// ── EMPTY STATE ──────────────────────────────────────────────
export function EmptyState({
  title = 'No Data Available',
  description = 'There is currently no information to display for this view.',
  actionLabel,
  onAction,
  icon: Icon = Layers,
}: {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: any
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#0F1E35] rounded-3xl border border-white/10 shadow-xl my-4">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#14C8FF]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-[#F8FAFC]">{title}</h3>
      <p className="text-xs text-[#94A3B8] max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary text-xs">
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

// ── ERROR STATE ──────────────────────────────────────────────
export function ErrorState({
  title = 'Operational Warning',
  message = 'Failed to load telemetry or connectivity status. Please try refreshing.',
  onRetry,
}: {
  title?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="p-5 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-200 my-4 flex items-start gap-4">
      <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0 text-red-400">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-bold text-red-300">{title}</h4>
        <p className="text-xs text-red-200/80 mt-1 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-xs font-bold text-red-200 border border-red-500/30 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  )
}

// ── SUCCESS STATE ─────────────────────────────────────────────
export function SuccessState({
  title = 'Action Completed',
  message = 'Your operation was successfully processed and logged into SkyOS.',
  onClose,
}: {
  title?: string
  message?: string
  onClose?: () => void
}) {
  return (
    <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center my-4">
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
        <CheckCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-emerald-300">{title}</h3>
      <p className="text-xs text-emerald-200/80 mt-1 max-w-md mx-auto">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}

// ── STATUS BADGE ──────────────────────────────────────────────
export function StatusBadge({
  status,
  variant = 'info',
}: {
  status: string
  variant?: 'success' | 'warning' | 'danger' | 'info'
}) {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'danger':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-blue-500/20 text-[#14C8FF] border-blue-400/30'
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getColors()}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {status}
    </span>
  )
}
