import { Request, Response } from 'express';
import prisma from '../prisma/client';
import { AuthRequest } from '../middleware/auth';

function computeStress(minutes: number) {
  if (minutes > 90) return 'green';
  if (minutes >= 45) return 'yellow';
  return 'red';
}

export async function calculateTransit(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { flightNumber, arrivalTime, departureTime } = req.body;
    if (!flightNumber || !arrivalTime || !departureTime) return res.status(400).json({ error: 'Missing fields' });
    const a = new Date(arrivalTime);
    const d = new Date(departureTime);
    const layoverMs = d.getTime() - a.getTime();
    const layoverMinutes = Math.max(0, Math.round(layoverMs / 60000));
    const now = new Date();
    const remainingMs = d.getTime() - now.getTime();
    const remainingMinutes = Math.max(0, Math.round(remainingMs / 60000));
    const stressLevel = computeStress(layoverMinutes);
    const recommendation =
      stressLevel === 'green'
        ? 'You have enough time for a meal or shopping.'
        : stressLevel === 'yellow'
        ? 'Consider a quick meal; head toward your gate soon.'
        : 'Boarding soon. Proceed to gate and avoid stops.';
    const rec = await prisma.transitRecord.create({
      data: {
        userId,
        flightNumber,
        arrivalTime: a,
        departureTime: d,
        layoverMinutes,
        stressLevel,
        recommendation
      }
    });
    res.json({ layoverMinutes, remainingMinutes, stressLevel, recommendation, id: rec.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

export async function getTransits(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const items = await prisma.transitRecord.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
}

export async function trackTransit(req: AuthRequest, res: Response) {
  try {
    const { flightNumber } = req.body;
    if (!flightNumber) return res.status(400).json({ error: 'Missing flightNumber' });
    const flight = await prisma.flight.findUnique({ where: { flightNumber } });
    if (!flight) return res.status(404).json({ error: 'Flight not found' });

    const arrival = flight.arrivalTime ? new Date(flight.arrivalTime) : null;
    const departure = flight.departureTime ? new Date(flight.departureTime) : null;

    // Case A: arrival_time is NULL
    if (!arrival) {
      return res.json({
        flightNumber: flight.flightNumber,
        arrivalTime: null,
        departureTime: departure ? departure.toISOString() : null,
        gate: flight.gate || null,
        status: flight.status || null,
        category: 'NOT_ARRIVED',
        message: 'Your flight has not arrived yet. Please wait for arrival updates.',
        suggestions: []
      });
    }

    // Case B: departure_time is NULL
    if (!departure) {
      return res.json({
        flightNumber: flight.flightNumber,
        arrivalTime: arrival.toISOString(),
        departureTime: null,
        gate: flight.gate || null,
        status: flight.status || null,
        category: 'FINAL_DESTINATION',
        message: 'You have reached your final destination. No further transit is required.',
        suggestions: []
      });
    }

    // Case C: both exist -> compute layover
    const layoverMs = departure.getTime() - arrival.getTime();
    const layoverMinutes = Math.max(0, Math.round(layoverMs / 60000));
    const layoverHours = Math.round(layoverMinutes / 60);

    let category = 'MODERATE_LAYOVER';
    let message = 'You have moderate transit time available.';
    let suggestions: string[] = [
      'Visit airport restaurants',
      'Relax in passenger lounges',
      'Charge electronic devices',
      'Explore duty-free shopping',
      'Freshen up before boarding'
    ];

    if (layoverMinutes < 90) {
      category = 'SHORT_LAYOVER';
      message = 'Short transit window detected.';
      suggestions = [
        'Proceed immediately to the next boarding gate.',
        'Complete security and immigration checks.',
        'Avoid shopping or long breaks.',
        'Boarding may begin shortly.'
      ];
    } else if (layoverMinutes >= 120 && layoverMinutes <= 300) {
      category = 'MODERATE_LAYOVER';
      message = 'You have moderate transit time available.';
      suggestions = [
        'Visit airport restaurants.',
        'Relax in passenger lounges.',
        'Charge electronic devices.',
        'Explore duty-free shopping.',
        'Freshen up before boarding.'
      ];
    } else if (layoverMinutes > 300) {
      category = 'LONG_LAYOVER';
      message = 'You have a long layover available.';
      suggestions = [
        'Use airport lounges or sleeping pods.',
        'Explore airport entertainment zones.',
        'Visit nearby attractions if permitted.',
        'Take proper meals and rest.',
        'Return to the gate at least 60 minutes before departure.'
      ];
    }

    return res.json({
      flightNumber: flight.flightNumber,
      arrivalTime: arrival.toISOString(),
      departureTime: departure.toISOString(),
      gate: flight.gate || null,
      status: flight.status || null,
      layoverHours,
      category,
      message,
      suggestions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}
