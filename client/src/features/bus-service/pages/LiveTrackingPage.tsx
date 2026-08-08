import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, RefreshCw, XCircle, AlertTriangle, Compass } from 'lucide-react';
import { BusInfo, TrackingLocation } from '../types';
import { getBusLocation } from '../services/telegramService';
import LeafletMap from '../../../components/maps/LeafletMap';
import RoutePolyline from '../../../components/maps/RoutePolyline';
import BusMarker from '../../../components/maps/BusMarker';
import DestinationMarker from '../../../components/maps/DestinationMarker';
import UserMarker from '../../../components/maps/UserMarker';
import { fetchRoute } from '../../../services/maps/openRouteService';
import { getDestinationCoords, AIRPORT_COORDS } from '../../../services/maps/mapUtils';

export default function LiveTrackingPage() {
  const navigate = useNavigate();

  const [bus, setBus] = useState<BusInfo | null>(null);
  const [driverId, setDriverId] = useState<string | null>(null);
  const [location, setLocation] = useState<TrackingLocation | null>(null);
  const [destination, setDestination] = useState<string>('');
  const [isReversed, setIsReversed] = useState<boolean>(false);

  // Tracking expiry state
  const [trackingExpired, setTrackingExpired] = useState(false);

  // Geolocation and Route states
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [routePath, setRoutePath] = useState<[number, number][] | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  // Local polling state
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load tracking details from sessionStorage on mount
  useEffect(() => {
    const trackingStr = sessionStorage.getItem('currentBusTracking');
    if (!trackingStr) {
      navigate('/bus-service');
      return;
    }

    try {
      const parsed = JSON.parse(trackingStr);
      setBus(parsed.bus);
      setDriverId(parsed.driverId || parsed.bus?.id || null);
      setLocation(parsed.location);
      setDestination(parsed.destination || 'Gachibowli');
      setIsReversed(!!parsed.isReversed);
    } catch (e) {
      console.error('Error parsing bus tracking cache:', e);
      navigate('/bus-service');
    }
  }, [navigate]);

  // Request Passenger Geolocation (GPS) on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn('GPS location request failed:', error);
          setGpsError('Unable to obtain current location.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setGpsError('Unable to obtain current location.');
    }
  }, []);

  // Fetch routing directions via OpenRouteService on mount
  useEffect(() => {
    if (!destination) return;

    const calculateRoutePath = async () => {
      try {
        const destCoords = getDestinationCoords(destination);
        // Start is Airport, End is Destination, or vice versa if reversed
        const start = isReversed ? destCoords : AIRPORT_COORDS;
        const end = isReversed ? AIRPORT_COORDS : destCoords;

        const routeData = await fetchRoute(start, end);
        setRoutePath(routeData.coordinates);
      } catch (err: any) {
        console.error('Error calculating route:', err);
        setRouteError('Unable to calculate route.');
      }
    };

    calculateRoutePath();
  }, [destination, isReversed]);

  // Poll GET /api/bus-service/location/:driverId every 4 seconds for location updates.
  // Stops automatically when trackingActive becomes false (session expired).
  useEffect(() => {
    if (!location || !driverId) return;

    pollingIntervalRef.current = setInterval(async () => {
      try {
        const locationData = await getBusLocation(driverId);

        if (!locationData || !locationData.trackingActive) {
          // Tracking has expired — stop polling and show expiry banner
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setTrackingExpired(true);
          return;
        }

        if (
          locationData.latitude !== undefined &&
          locationData.longitude !== undefined
        ) {
          const newTimestamp = locationData.lastUpdated
            ? new Date(locationData.lastUpdated).getTime()
            : Date.now();

          if (newTimestamp > location.timestamp) {
            const updatedLocation: TrackingLocation = {
              latitude: locationData.latitude,
              longitude: locationData.longitude,
              timestamp: newTimestamp,
            };
            setLocation(updatedLocation);

            // Sync sessionStorage
            const cached = sessionStorage.getItem('currentBusTracking');
            if (cached) {
              const parsed = JSON.parse(cached);
              parsed.location = updatedLocation;
              sessionStorage.setItem('currentBusTracking', JSON.stringify(parsed));
            }
          }
        }
      } catch (err) {
        console.error('[LiveTrackingPage] Error refreshing tracking location:', err);
      }
    }, 4000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [location, driverId]);

  const handleStopTracking = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    sessionStorage.removeItem('currentBusTracking');
    navigate('/bus-service');
  };

  if (!bus || !location) {
    return null;
  }

  const formatLastUpdatedTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const destCoords = getDestinationCoords(destination);

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-5 sm:px-6 lg:px-8 lg:py-8 transition-colors duration-300">
      <div className="relative mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="rounded-3xl bg-white/95 dark:bg-slate-800/95 p-5 border border-slate-150/60 dark:border-slate-700/50 shadow-sm backdrop-blur flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleStopTracking}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-400">
                Live bus tracking
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Live Bus Location
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30 border border-blue-100/50 dark:border-blue-900/30 rounded-2xl">
              <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 dark:text-blue-400 block">
                Tracking Coach
              </span>
              <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block">
                {bus.name} ({bus.departure})
              </span>
            </div>

            <button
              onClick={handleStopTracking}
              className="flex items-center gap-1.5 px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-98"
            >
              <XCircle size={16} />
              Stop Tracking
            </button>
          </div>
        </header>

        {/* Main Grid: Map container + Details panel */}
        <div className="grid gap-6 lg:grid-cols-[1.5fr_0.8fr]">
          {/* Tracking Expired Banner */}
          {trackingExpired && (
            <div className="lg:col-span-2 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-800 dark:text-amber-400">Tracking Session Expired</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  The driver's live location period has ended. Return to the bus list to request a new session.
                </p>
              </div>
              <button
                onClick={handleStopTracking}
                className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline px-3 py-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/20"
              >
                Go Back
              </button>
            </div>
          )}

          {/* Map canvas */}
          <div className="h-[400px] lg:h-[500px]">
            <LeafletMap center={[location.latitude, location.longitude]} zoom={13}>
              {/* Route Polyline path from OpenRouteService */}
              {routePath && <RoutePolyline positions={routePath} />}
              
              {/* Live Bus marker (centered at polled coordinates) */}
              <BusMarker position={[location.latitude, location.longitude]} busName={bus.name} />
              
              {/* Route Termini Markers */}
              <DestinationMarker position={AIRPORT_COORDS} name="Airport" isAirport={true} />
              <DestinationMarker position={destCoords} name={destination} isAirport={false} />
              
              {/* User location marker (if GPS active) */}
              {userCoords && <UserMarker position={userCoords} name="Your Location" />}
            </LeafletMap>
          </div>

          {/* Location details card */}
          <section className="rounded-3xl bg-white dark:bg-slate-800 p-6 border border-slate-150/60 dark:border-slate-700/50 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Telemetry Details
              </h3>

              {/* Status and Error banners */}
              <div className="space-y-3">
                {routeError && (
                  <div className="p-3 bg-red-50 dark:bg-rose-950/20 border border-red-200 dark:border-rose-900/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-600 dark:text-rose-450">
                    <AlertTriangle size={14} className="shrink-0" />
                    <span>{routeError}</span>
                  </div>
                )}
                {gpsError && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-450">
                    <Compass size={14} className="shrink-0" />
                    <span>{gpsError}</span>
                  </div>
                )}
              </div>

              {/* Coordinates */}
              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/20 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      Latitude
                    </span>
                    <code className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                      {location.latitude.toFixed(6)}
                    </code>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/20 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 mt-0.5">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      Longitude
                    </span>
                    <code className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                      {location.longitude.toFixed(6)}
                    </code>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-950/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                      Last Updated
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mt-0.5">
                      {formatLastUpdatedTime(location.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              {trackingExpired ? (
                <Clock className="w-5 h-5 text-amber-500 shrink-0" />
              ) : (
                <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin shrink-0" />
              )}
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-normal">
                {trackingExpired
                  ? 'Tracking expired. The driver has stopped sharing their live location.'
                  : 'Polling active. Map updates every 4 seconds from the backend.'}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
