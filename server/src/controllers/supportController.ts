import { Request, Response } from 'express';
import { sendTelegramMessage } from '../services/telegramService';

export async function sendSupportMessage(req: Request, res: Response) {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message content is required.' });
    }

    const date = new Date();
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    // Format the message with bold headers and custom template
    const formattedMessage = `✈ <b>Airport Companion</b>\n\n<b>Customer Support Request</b>\n\n<b>Message:</b>\n${message.trim()}\n\n<b>Time:</b>\n${timeStr}`;

    await sendTelegramMessage(formattedMessage);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('[Support Send Error]', error.message || error);
    return res.status(500).json({ error: error.message || 'Unable to send support message.' });
  }
}
