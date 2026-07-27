import { Request, Response } from 'express';
import { sendTelegramMessage, generateLocationString } from '../services/telegramService';

interface EmergencyAlertPayload {
  passengerName: string;
  ticketId: string;
  emergencyReason: string;
  latitude: number;
  longitude: number;
  accuracy: number | null;   // metres, from browser Geolocation API
  timestamp: string;
}

/**
 * POST /api/emergency-alert
 *
 * Validates the incoming emergency payload, constructs a professional
 * Telegram message, and dispatches it via the Telegram Bot API.
 *
 * Telegram credentials are read ONLY from server-side environment variables.
 * They are never sent to or visible from the frontend.
 */
export async function sendEmergencyAlert(req: Request, res: Response) {
  try {
    const {
      passengerName,
      ticketId,
      emergencyReason,
      latitude,
      longitude,
      accuracy,
      timestamp,
    } = req.body as EmergencyAlertPayload;

    // ── Validate required fields ─────────────────────────────
    if (!emergencyReason || !latitude || !longitude) {
      return res.status(400).json({
        error: 'Missing required fields: emergencyReason, latitude, longitude',
      });
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'latitude and longitude must be numbers' });
    }

    // ── Build location string & maps link ────────────────────
    const locationString = generateLocationString(latitude, longitude);
    const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;

    // ── Format timestamp ─────────────────────────────────────
    const formattedTime = timestamp
      ? new Date(timestamp).toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // ── Compose professional Telegram message ─────────────────
    const message = [
      '🚨 <b>AIRPORT EMERGENCY ALERT</b>',
      '',
      '<b>Passenger Name:</b>',
      passengerName || 'Not provided',
      '',
      '<b>Ticket ID:</b>',
      ticketId || 'Not provided',
      '',
      '<b>Emergency Reason:</b>',
      emergencyReason,
      '',
      '<b>Current Location:</b>',
      locationString,
      '',
      `<b>Coordinates:</b>`,
      `${latitude}, ${longitude}`,
      accuracy != null ? `<b>Accuracy:</b> ±${Math.round(accuracy)} m` : '',
      '',
      `<b>Google Maps:</b>`,
      mapsLink,
      '',
      '<b>Time:</b>',
      formattedTime,
      '',
      '⚠️ <b>Please respond immediately.</b>',
    ].join('\n');

    // ── Send via Telegram ─────────────────────────────────────
    await sendTelegramMessage(message);

    return res.status(200).json({ success: true, message: 'Emergency alert sent successfully.' });
  } catch (err: any) {
    console.error('[Emergency Alert Error]', err.message || err);
    return res.status(500).json({
      error: err.message || 'Failed to send emergency alert. Please try again.',
    });
  }
}
