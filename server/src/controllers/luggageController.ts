import { Request, Response } from 'express';
import prisma from '../prisma/client';

export async function getDomestic(req: Request, res: Response) {
  try {
    const items = await prisma.luggageGuide.findMany({ where: { category: 'domestic' }, orderBy: { stepNumber: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error('Luggage domestic error', err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getInternational(req: Request, res: Response) {
  try {
    const items = await prisma.luggageGuide.findMany({ where: { category: 'international' }, orderBy: { stepNumber: 'asc' } });
    res.json(items);
  } catch (err) {
    console.error('Luggage international error', err);
    res.status(500).json({ error: 'Server error' });
  }
}
