import https from 'https';

/**
 * Sends a message via the Telegram Bot API.
 * Reads TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from server-side environment.
 * These values are NEVER sent to or accessible from the frontend.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token   = process.env.TELEGRAM_BOT_TOKEN;
  const chat_id = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chat_id) {
    throw new Error('Telegram credentials are not configured in server environment.');
  }

  const payload = JSON.stringify({ chat_id, text, parse_mode: 'HTML' });

  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${token}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok) {
            resolve();
          } else {
            reject(new Error(`Telegram API error: ${parsed.description || 'Unknown error'}`));
          }
        } catch {
          reject(new Error('Failed to parse Telegram API response'));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(payload);
    req.end();
  });
}

/**
 * Generates a realistic airport location string from coordinates.
 * Falls back gracefully when reverse geocoding is unavailable.
 */
export function generateLocationString(lat: number, lng: number): string {
  // Known airport coordinate ranges for demonstration
  const airports = [
    { name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', latMin: 17.2, latMax: 17.3, lngMin: 78.4, lngMax: 78.5 },
    { name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', latMin: 19.0, latMax: 19.1, lngMin: 72.8, lngMax: 72.9 },
    { name: 'Indira Gandhi International Airport', city: 'New Delhi', latMin: 28.5, latMax: 28.6, lngMin: 77.0, lngMax: 77.2 },
    { name: 'Kempegowda International Airport', city: 'Bengaluru', latMin: 13.1, latMax: 13.2, lngMin: 77.6, lngMax: 77.8 },
    { name: 'Chennai International Airport', city: 'Chennai', latMin: 12.9, latMax: 13.0, lngMin: 80.1, lngMax: 80.3 },
  ];

  const match = airports.find(
    (a) => lat >= a.latMin && lat <= a.latMax && lng >= a.lngMin && lng <= a.lngMax
  );

  if (match) {
    const terminals = ['Terminal 1', 'Terminal 2', 'Terminal 3'];
    const gates = ['Gate A4', 'Gate B14', 'Gate C2', 'Gate D7', 'Gate E12'];
    const terminal = terminals[Math.floor(Math.random() * terminals.length)];
    const gate     = gates[Math.floor(Math.random() * gates.length)];
    return `${match.name}\n${terminal} — ${gate}\n${match.city}`;
  }

  // Generic fallback
  return `Airport Premises\nCoordinates: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

// ── Long polling ───────────────────────────────────────────────────────────────

let lastUpdateId = 0;

/**
 * Callback type invoked when a Telegram location update is received.
 * The caller (index.ts) wires this to the TrackingRepository upsert.
 */
export type OnLocationUpdate = (data: {
  latitude: number;
  longitude: number;
  timestampMs: number;
  /** Seconds the live location will remain active. null if not provided by Telegram. */
  livePeriodSeconds: number | null;
}) => void;

/**
 * Starts the Telegram long-polling daemon.
 *
 * @param onMessageReceived  Called for plain text messages (existing support chat flow).
 * @param onLocationUpdate   Called when a location message is received. The caller persists
 *                           the data to Prisma via the TrackingRepository.
 *
 * NOTE: The in-memory latestBusLocation cache has been removed.
 *       All location state now lives in the BusTracking Prisma table.
 */
export function startTelegramLongPolling(
  onMessageReceived: (text: string) => void,
  onLocationUpdate: OnLocationUpdate,
) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn('Telegram bot token not configured. Skipping long polling.');
    return;
  }

  const poll = () => {
    const path = `/bot${token}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`;
    const options: https.RequestOptions = {
      hostname: 'api.telegram.org',
      port: 443,
      path,
      method: 'GET'
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.ok && parsed.result && parsed.result.length > 0) {
            for (const update of parsed.result) {
              lastUpdateId = Math.max(lastUpdateId, update.update_id);

              const message = update.message || update.edited_message;
              if (
                message &&
                message.chat &&
                String(message.chat.id) === String(process.env.TELEGRAM_CHAT_ID)
              ) {
                // Ignore messages sent by the bot itself
                if (message.from && !message.from.is_bot) {
                  if (message.location) {
                    // Extract live_period only from the original message (not edits).
                    // Telegram does not re-send live_period on edited_message updates.
                    const livePeriodSeconds: number | null =
                      update.message?.location?.live_period ?? null;

                    const timestampMs =
                      (message.edit_date ?? message.date) * 1000;

                    onLocationUpdate({
                      latitude: message.location.latitude,
                      longitude: message.location.longitude,
                      timestampMs,
                      livePeriodSeconds,
                    });

                    console.log(
                      '[Telegram] Location update received:',
                      message.location.latitude,
                      message.location.longitude,
                      '| live_period:',
                      livePeriodSeconds ?? 'not provided (using default)',
                    );
                  } else if (message.text) {
                    onMessageReceived(message.text);
                  }
                }
              }
            }
          }
        } catch (e) {
          console.error('[Telegram] Error parsing updates:', e);
        }
        // Poll again immediately
        setTimeout(poll, 1000);
      });
    });

    req.on('error', (err) => {
      console.error('[Telegram] Polling error:', err);
      // Wait before retrying on error
      setTimeout(poll, 5000);
    });

    req.end();
  };

  poll();
}
