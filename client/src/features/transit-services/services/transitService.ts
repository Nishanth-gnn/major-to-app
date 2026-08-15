import { Airport, MetroService, MultiModalOption, TelemetryData } from '../types';
import { AIRPORTS, getMetroServicesForAirport, getMultiModalOptions } from '../data/transitData';
import { apiFetch } from '../../../config/api';

export async function fetchAirports(): Promise<Airport[]> {
  try {
    const res = await apiFetch('/api/transit-services/airports');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('[TransitService] Using local airports fallback', e);
  }
  return AIRPORTS;
}

export async function fetchMetroRoutes(airportId: string, destination: string): Promise<MetroService[]> {
  try {
    const res = await apiFetch(`/api/transit-services/metro/routes?airportId=${airportId}&destination=${encodeURIComponent(destination)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[TransitService] Using local metro services fallback', e);
  }
  return getMetroServicesForAirport(airportId, destination);
}

export async function fetchMultiModalComparison(airportId: string, destination: string): Promise<MultiModalOption[]> {
  const airport = AIRPORTS.find(a => a.id === airportId) || AIRPORTS[0];
  try {
    const res = await apiFetch(`/api/transit-services/cab/estimate?airportId=${airportId}&destination=${encodeURIComponent(destination)}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('[TransitService] Using local multimodal fallback', e);
  }
  return getMultiModalOptions(airport, destination);
}

export async function fetchLiveTelemetry(serviceId: string): Promise<TelemetryData> {
  return {
    speed: 94,
    heading: 'North-East (42°)',
    currentStation: 'RGIA Airport Central Platform 2',
    nextStation: 'Cyber Towers Junction',
    destinationStation: 'Ameerpet Metro Interchange',
    distanceRemainingKm: 14.2,
    progressPercent: 35,
    latitude: 17.2403,
    longitude: 78.4294,
    lastUpdated: new Date().toLocaleTimeString(),
    fare: '₹60',
    status: 'On Time',
  };
}
