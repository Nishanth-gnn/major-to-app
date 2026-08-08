import axios from 'axios';

const ORS_API_KEY = import.meta.env.VITE_ORS_MAP_API;

export interface RouteData {
  coordinates: [number, number][]; // [lat, lng] for Leaflet
  distance: number; // in meters
  duration: number; // in seconds
}

/**
 * Fetches driving directions between two coordinates using OpenRouteService.
 * Coordinates are passed as [latitude, longitude].
 */
export async function fetchRoute(
  start: [number, number], // [lat, lng]
  end: [number, number]    // [lat, lng]
): Promise<RouteData> {
  if (!ORS_API_KEY) {
    console.error('OpenRouteService API key (VITE_ORS_MAP_API) is missing.');
    throw new Error('API Key missing');
  }

  try {
    // OpenRouteService expects coordinates as [longitude, latitude] (GeoJSON format)
    const body = {
      coordinates: [
        [start[1], start[0]],
        [end[1], end[0]]
      ]
    };

    const response = await axios.post(
      'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': ORS_API_KEY
        }
      }
    );

    const feature = response.data?.features?.[0];
    if (!feature) {
      throw new Error('No route found');
    }

    const orsCoords = feature.geometry.coordinates as [number, number][];
    
    // Convert [lng, lat] GeoJSON coordinates back to [lat, lng] for Leaflet
    const coordinates = orsCoords.map(coord => [coord[1], coord[0]] as [number, number]);
    
    const summary = feature.properties?.summary || { distance: 0, duration: 0 };

    return {
      coordinates,
      distance: summary.distance,
      duration: summary.duration
    };
  } catch (error: any) {
    console.error('Error fetching route from OpenRouteService:', error);
    throw new Error('Unable to calculate route.');
  }
}
