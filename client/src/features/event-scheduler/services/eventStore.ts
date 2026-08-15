import {
  startPolling,
  updateWatchList,
  type WatchedEvent,
} from '../services/notificationService'

const STORAGE_KEY = 'airport_scheduled_events'

export interface ScheduledEvent {
  id: string
  name: string
  scheduledAt: number   // Unix ms
  createdAt: number
}

// ── persistence ──────────────────────────────────────────────────────────────

export function loadEvents(): ScheduledEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ScheduledEvent[]
  } catch {
    return []
  }
}

function saveEvents(events: ScheduledEvent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
}

// ── public API ────────────────────────────────────────────────────────────────

/** Save a new event and update the watch list. */
export function addEvent(name: string, scheduledAt: number): ScheduledEvent {
  const event: ScheduledEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name,
    scheduledAt,
    createdAt: Date.now(),
  }
  const events = loadEvents()
  events.push(event)
  saveEvents(events)
  updateWatchList(events)
  return event
}

/** Delete an event and update the watch list. */
export function deleteEvent(id: string): void {
  const events = loadEvents().filter(e => e.id !== id)
  saveEvents(events)
  updateWatchList(events)
}

/** Start polling for all future events. Call once on mount. */
export function initializeScheduler(): void {
  const events = loadEvents()
  startPolling(events)
}
