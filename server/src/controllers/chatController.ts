import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth';
import { queryOpenAI } from '../services/openai';

export async function handleChat(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    // Optional: build context from recent messages
    const recent = await prisma.chatHistory.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 10 });
    const prompt = `User: ${message}\nAssistant: `;
    const responseText = await queryOpenAI(prompt);
    const record = await prisma.chatHistory.create({ data: { userId, message, response: responseText } });
    res.json({ id: record.id, response: responseText });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getHistory(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const items = await prisma.chatHistory.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}
