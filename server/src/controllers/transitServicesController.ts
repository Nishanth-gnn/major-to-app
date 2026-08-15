import { Request, Response } from 'express';

export const getAirports = (req: Request, res: Response) => {
  res.json([
    { id: 'hyd', code: 'HYD', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', country: 'India', region: 'India', flag: '🇮🇳' },
    { id: 'del', code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', region: 'India', flag: '🇮🇳' },
    { id: 'bom', code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Airport', city: 'Mumbai', country: 'India', region: 'India', flag: '🇮🇳' },
    { id: 'blr', code: 'BLR', name: 'Kempegowda International Airport', city: 'Bengaluru', country: 'India', region: 'India', flag: '🇮🇳' },
    { id: 'dxb', code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', region: 'Middle East', flag: '🇦🇪' },
    { id: 'lhr', code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'UK', region: 'Europe', flag: '🇬🇧' },
    { id: 'sin', code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', region: 'Asia', flag: '🇸🇬' },
    { id: 'jfk', code: 'JFK', name: 'John F. Kennedy Airport', city: 'New York', country: 'USA', region: 'North America', flag: '🇺🇸' },
    { id: 'syd', code: 'SYD', name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', region: 'Australia', flag: '🇦🇺' },
  ]);
};

export const getTransitOptions = (req: Request, res: Response) => {
  const { id } = req.params;
  res.json({
    airportId: id,
    transitModes: ['metro', 'bus', 'skytrain', 'cab', 'walking'],
  });
};

export const getMetroRoutes = (req: Request, res: Response) => {
  const { airportId, destination } = req.query;
  res.json([
    {
      id: `${airportId}-express`,
      lineName: 'Airport Express Line',
      lineCode: 'EXP-01',
      trainType: 'Non-stop Express',
      nextTrainMinutes: 3,
      etaMinutes: 22,
      fare: '₹60',
      status: 'On Time',
      color: '#3b82f6',
      route: ['Airport Station', 'Cyber Towers', 'Ameerpet Hub', 'Secunderabad Central'],
      frequency: 'Every 8 mins',
      speedKmh: 110,
      totalStations: 4,
      fromStation: 'Airport Central Station',
      toStation: (destination as string) || 'City Centre Station',
    },
    {
      id: `${airportId}-rapid`,
      lineName: 'Blue Metro Line',
      lineCode: 'BLU-02',
      trainType: 'Rapid Transit',
      nextTrainMinutes: 8,
      etaMinutes: 31,
      fare: '₹40',
      status: 'On Time',
      color: '#06b6d4',
      route: ['Airport Station', 'South Hub', 'Financial District', 'Ameerpet'],
      frequency: 'Every 10 mins',
      speedKmh: 80,
      totalStations: 8,
      fromStation: 'Airport Central Station',
      toStation: (destination as string) || 'City Centre Station',
    },
  ]);
};

export const getLiveMetro = (req: Request, res: Response) => {
  const { route } = req.params;
  res.json({
    routeId: route,
    speed: 94,
    heading: 'North-East (42°)',
    currentStation: 'Airport Platform 2',
    nextStation: 'Ameerpet Interchange',
    distanceRemainingKm: 14.2,
    progressPercent: 35,
    latitude: 17.2403,
    longitude: 78.4294,
    lastUpdated: new Date().toISOString(),
  });
};

export const getCabEstimate = (req: Request, res: Response) => {
  const { airportId, destination } = req.query;
  res.json([
    { mode: 'metro', title: 'Airport Metro Express', fare: '₹60', etaMinutes: 22, distanceKm: 18, icon: '🚆', tag: 'Recommended', color: 'from-blue-600 to-cyan-500', notes: 'Direct express line.' },
    { mode: 'bus', title: 'Pushpak AC Bus', fare: '₹250', etaMinutes: 38, distanceKm: 20, icon: '🚌', tag: 'AC Deluxe', color: 'from-emerald-600 to-teal-500', notes: 'Direct AC coach.' },
    { mode: 'cab', title: 'Airport Taxi / Uber', fare: '₹720', etaMinutes: 32, distanceKm: 19, icon: '🚖', tag: 'Door to Door', color: 'from-amber-500 to-orange-600', notes: 'On-demand cab.' },
  ]);
};

export const getTerminalNavigation = (req: Request, res: Response) => {
  res.json({
    terminal: 'Terminal 3 Arrivals',
    metroStation: 'Airport Metro Station',
    distanceMeters: 420,
    walkingTimeMins: 6,
    level: 'Lower Ground',
    elevatorAvailable: true,
    wheelchairAccessible: true,
  });
};
