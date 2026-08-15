// ── Notification Service (Polling-based) ──────────────────────────────────────
//
// Why polling instead of setTimeout?
// ─────────────────────────────────────────────────────────────────────────────
// Modern browsers throttle/suspend setTimeout callbacks for background tabs
// (Chrome caps them at 1 Hz after ~5 minutes; some browsers suspend entirely).
// A setInterval that runs while the tab is visible is far more reliable for
// time-sensitive event firing.
//
// Dual-delivery strategy
// ─────────────────────────────────────────────────────────────────────────────
// 1. In-app toast overlay  – shown via a global React callback every time an
//    event fires.  Always works when the tab is open.
// 2. Web Notification API  – fires a native OS notification.  Works when the
//    tab is open AND the user has granted permission.  Falls back silently.
// ─────────────────────────────────────────────────────────────────────────────

export type PermissionState = 'granted' | 'denied' | 'default' | 'unsupported'

// ── Permission helpers ────────────────────────────────────────────────────────

export async function requestPermission(): Promise<PermissionState> {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  const result = await Notification.requestPermission()
  return result as PermissionState
}

export function getPermissionState(): PermissionState {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission as PermissionState
}

// ── In-app notification callback ──────────────────────────────────────────────
// The EventSchedulerPage registers a handler here.  When an event fires, the
// polling loop calls this handler so the page can display an in-app toast.

export type InAppHandler = (name: string) => void
let _inAppHandler: InAppHandler | null = null

export function registerInAppHandler(fn: InAppHandler): void {
  _inAppHandler = fn
}

export function unregisterInAppHandler(): void {
  _inAppHandler = null
}

// ── Fired-event tracking ──────────────────────────────────────────────────────
// Prevents the same event from firing twice during a session.
const _fired = new Set<string>()

// ── Polling loop ──────────────────────────────────────────────────────────────
// Stores the events to watch.  Updated by the event store.

export interface WatchedEvent {
  id: string
  name: string
  scheduledAt: number
}

let _watchList: WatchedEvent[] = []
let _pollInterval: ReturnType<typeof setInterval> | null = null

function _tick() {
  const now = Date.now()
  for (const ev of _watchList) {
    if (_fired.has(ev.id)) continue
    if (ev.scheduledAt > now) continue

    // Mark as fired so we don't show it again this session
    _fired.add(ev.id)

    // 1. In-app overlay
    if (_inAppHandler) {
      _inAppHandler(ev.name)
    }

    // 2. Web Notification API (best-effort)
    try {
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Event Reminder 🔔', {
          body: `${ev.name} is happening now.`,
          icon: '/favicon.ico',
          tag: ev.id,
          requireInteraction: true,
        })
      }
    } catch {
      // Silently ignore — in-app toast is the primary delivery
    }
  }
}

export function startPolling(events: WatchedEvent[]): void {
  _watchList = events.filter(e => !_fired.has(e.id))
  if (_pollInterval !== null) return          // already running
  _pollInterval = setInterval(_tick, 10_000)  // every 10 seconds
  _tick()                                     // also check immediately
}

export function updateWatchList(events: WatchedEvent[]): void {
  _watchList = events.filter(e => !_fired.has(e.id))
}

export function stopPolling(): void {
  if (_pollInterval !== null) {
    clearInterval(_pollInterval)
    _pollInterval = null
  }
}
