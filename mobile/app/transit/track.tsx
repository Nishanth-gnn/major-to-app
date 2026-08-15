import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '../../theme/colors';

let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Polyline = Maps.Polyline;
}

export default function LiveTrackingScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams();
  const isMetro = mode === 'metro';

  const [location, setLocation] = useState({
    latitude: 17.2403,
    longitude: 78.4294,
  });

  const [speed, setSpeed] = useState(isMetro ? 95 : 42);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.002,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.002,
      }));
      setSpeed(isMetro ? Math.floor(90 + Math.random() * 10) : Math.floor(40 + Math.random() * 8));
      setLastUpdated(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(timer);
  }, [isMetro]);

  const polylineCoords = [
    { latitude: 17.2403, longitude: 78.4294 },
    { latitude: 17.3000, longitude: 78.4000 },
    { latitude: 17.3850, longitude: 78.4867 },
    { latitude: 17.4401, longitude: 78.3489 },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Header Card */}
        <View style={styles.topCard}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>
              {isMetro ? 'HIGH-SPEED METRO GPS TELEMETRY' : 'PUSHPAK COACH TELEMETRY'}
            </Text>
            <Text style={styles.headerTitle}>
              {isMetro ? 'Airport Metro Express Line' : 'Pushpak AC Coach #04'}
            </Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveBadgeText}>ON TIME</Text>
          </View>
        </View>

        {/* Map View */}
        <View style={styles.mapContainer}>
          {Platform.OS === 'web' ? (
            <View style={[styles.map, styles.webMapFallback]}>
              <Ionicons name={isMetro ? 'subway' : 'bus'} size={48} color={Colors.accent} />
              <Text style={styles.webMapText}>
                Live GPS Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </Text>
              <Text style={styles.webMapSub}>
                Trajectory: Airport Terminal Hub ➔ City Centre Junction Line
              </Text>
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 17.2403,
                longitude: 78.4294,
                latitudeDelta: 0.15,
                longitudeDelta: 0.15,
              }}
            >
              <Polyline coordinates={polylineCoords} strokeColor={Colors.accent} strokeWidth={4} />
              <Marker coordinate={location} title={isMetro ? 'Express Metro Train' : 'Pushpak Coach'}>
                <View style={styles.markerCircle}>
                  <Ionicons name={isMetro ? 'subway' : 'bus'} size={16} color="#FFFFFF" />
                </View>
              </Marker>
            </MapView>
          )}
        </View>

        {/* Bottom Sheet Telemetry */}
        <View style={styles.bottomSheet}>
          <View style={styles.sheetHandle} />

          <View style={styles.sheetHeader}>
            <View>
              <Text style={styles.sheetTitle}>
                {isMetro ? 'Platform 2 • Next Departure: 3 Mins' : 'Pickup Bay 3 • Next Departure: 7 Mins'}
              </Text>
              <Text style={styles.sheetSub}>Destination: City Centre Junction</Text>
            </View>
            <Text style={styles.farePrice}>{isMetro ? '₹60' : '₹250'}</Text>
          </View>

          <View style={styles.telemetryGrid}>
            <View style={styles.telCell}>
              <Text style={styles.telKey}>CURRENT SPEED</Text>
              <Text style={styles.telVal}>{speed} km/h</Text>
            </View>
            <View style={styles.telCell}>
              <Text style={styles.telKey}>DISTANCE REMAINING</Text>
              <Text style={styles.telVal}>14.8 km</Text>
            </View>
            <View style={styles.telCell}>
              <Text style={styles.telKey}>LAST UPDATED</Text>
              <Text style={[styles.telVal, { color: Colors.accent }]}>{lastUpdated}</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
  },
  topCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  liveBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.success,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  webMapFallback: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 20,
  },
  webMapText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
  },
  webMapSub: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  markerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  sheetSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  farePrice: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.success,
  },
  telemetryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 16,
  },
  telCell: {
    flex: 1,
  },
  telKey: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  telVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
});
