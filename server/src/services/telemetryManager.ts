/**
 * telemetryManager.ts
 *
 * Wraps all outbound driver communication behind a stable interface.
 *
 * Currently backed by Telegram. In the future, replacing this service
 * with a GPS device integration requires changing only this file —
 * no other service or controller needs to change.
 */

import { sendTelegramMessage } from './telegramService';

/**
 * Sends a location-sharing request to the driver identified by driverName.
 * The message is delivered via Telegram using the server-side bot token.
 *
 * The TELEGRAM_CHAT_ID env variable targets the single configured driver chat.
 */
export async function requestDriverLocation(driverName: string): Promise<void> {
  const message = [
    '🚍 <b>Airport Companion</b>',
    '',
    `Passenger has requested live tracking for <b>${driverName}</b>.`,
    '',
    'Please share your <b>Telegram Live Location</b>.',
  ].join('\n');

  await sendTelegramMessage(message);
}
