export const AIRPORT_COORDS: [number, number] = [17.2403, 78.4294];

export const CITY_COORDS: Record<string, [number, number]> = {
  'Miyapur': [17.4966, 78.3483],
  'Ameerpet': [17.4375, 78.4482],
  'Secunderabad': [17.4399, 78.4983],
  'JBS': [17.4497, 78.4996],
  'Koti': [17.3828, 78.4816],
  'LB Nagar': [17.3460, 78.5516],
  'Uppal': [17.4019, 78.5602],
  'Gachibowli': [17.4401, 78.3489],
  'Hitech City': [17.4435, 78.3773],
  'Kondapur': [17.4617, 78.3683]
};

/**
 * Resolves destination coordinates based on the selected city.
 * Falls back to Hyderabad Center if the city is not predefined.
 */
export function getDestinationCoords(city: string): [number, number] {
  if (!city) return [17.3850, 78.4867];
  
  const key = Object.keys(CITY_COORDS).find(
    k => k.toLowerCase() === city.toLowerCase()
  );
  return key ? CITY_COORDS[key] : [17.3850, 78.4867];
}

/**
 * Calculates straight-line distance between two coordinates in kilometers using the Haversine formula.
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
