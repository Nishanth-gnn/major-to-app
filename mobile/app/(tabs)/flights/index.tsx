import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../theme/colors';
import { usePassengerStore, useFlightStore } from '../../../store';

export default function FlightsScreen() {
  const { boardingData } = usePassengerStore();
  const { status } = useFlightStore();

  const handleOpenFlightRadar = () => {
    Linking.openURL('https://www.flightradar24.com');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>PASSENGER FLIGHT HUB</Text>
            <Text style={styles.headerTitle}>Boarding Pass & Live Status</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Boarding Soon</Text>
          </View>
        </View>

        {/* Boarding Pass Container */}
        <View style={styles.boardingPassCard}>
          {/* Airline Header */}
          <View style={styles.passHeader}>
            <View style={styles.airlineInfo}>
              <Ionicons name="airplane" size={24} color={Colors.accent} />
              <View>
                <Text style={styles.airlineName}>{boardingData?.airline || 'IndiGo Airlines'}</Text>
                <Text style={styles.aircraftType}>Airbus A320neo • Flight {boardingData?.flight_id || '6E2412'}</Text>
              </View>
            </View>
            <View style={styles.groupBadge}>
              <Text style={styles.groupLabel}>BOARDING GROUP</Text>
              <Text style={styles.groupValue}>{boardingData?.boarding_group || 'Group B'}</Text>
            </View>
          </View>

          {/* Route Section */}
          <View style={styles.routeSection}>
            <View style={styles.cityBlock}>
              <Text style={styles.cityCode}>{boardingData?.from || 'HYD'}</Text>
              <Text style={styles.cityName}>Hyderabad</Text>
              <Text style={styles.timeText}>{boardingData?.departure_time || '14:30'}</Text>
            </View>

            <View style={styles.durationBlock}>
              <Text style={styles.durationText}>2h 15m</Text>
              <View style={styles.flightLine}>
                <View style={styles.dotStart} />
                <Ionicons name="airplane" size={16} color={Colors.accent} />
                <View style={styles.dotEnd} />
              </View>
              <Text style={styles.directText}>Non-stop</Text>
            </View>

            <View style={[styles.cityBlock, { alignItems: 'flex-end' }]}>
              <Text style={styles.cityCode}>{boardingData?.to || 'DEL'}</Text>
              <Text style={styles.cityName}>New Delhi</Text>
              <Text style={styles.timeText}>{boardingData?.arrival_time || '16:45'}</Text>
            </View>
          </View>

          {/* Perforated Divider */}
          <View style={styles.perforationRow}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.cutoutRight} />
          </View>

          {/* Pass Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>PASSENGER</Text>
              <Text style={styles.detailValue}>{boardingData?.passenger_name || 'Sai Venkat'}</Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>TICKET ID</Text>
              <Text style={styles.detailValue}>{boardingData?.ticket_id || '3409967503'}</Text>
            </View>
          </View>

          <View style={[styles.detailsGrid, { marginTop: 14 }]}>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>TERMINAL</Text>
              <Text style={styles.detailValue}>{boardingData?.terminal || 'Terminal 2'}</Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>GATE</Text>
              <Text style={[styles.detailValue, { color: Colors.accent }]}>
                {boardingData?.gate || '14B'}
              </Text>
            </View>
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>SEAT</Text>
              <Text style={styles.detailValue}>{boardingData?.seat || '18A'}</Text>
            </View>
          </View>
        </View>

        {/* Live Flight Location Button */}
        <TouchableOpacity style={styles.radarButton} activeOpacity={0.85} onPress={handleOpenFlightRadar}>
          <View style={styles.radarIconBox}>
            <Ionicons name="compass-outline" size={24} color="#FFFFFF" />
          </View>
          <View style={styles.radarTextGroup}>
            <Text style={styles.radarTitle}>Live Flight Location Radar</Text>
            <Text style={styles.radarSubtitle}>Track 3D ADS-B satellite radar trajectory</Text>
          </View>
          <Ionicons name="open-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Destination Weather & Guidance */}
        <View style={styles.infoCard}>
          <Ionicons name="partly-sunny-outline" size={24} color={Colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>Destination Weather (New Delhi)</Text>
            <Text style={styles.infoText}>31°C Clear Sky • Optimal landing visibility on Runway 28/10.</Text>
          </View>
        </View>
      </ScrollView>
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
  content: {
    padding: 20,
    paddingBottom: 110,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.success,
  },
  boardingPassCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  airlineName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  aircraftType: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  groupBadge: {
    alignItems: 'flex-end',
  },
  groupLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 0.5,
  },
  groupValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  cityBlock: {
    flex: 1,
  },
  cityCode: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.text,
  },
  cityName: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.accent,
    marginTop: 4,
  },
  durationBlock: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  durationText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  flightLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dotStart: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  dotEnd: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
  },
  directText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
    marginTop: 4,
  },
  perforationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: -20,
    marginVertical: 10,
  },
  cutoutLeft: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    marginLeft: -8,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  cutoutRight: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.background,
    marginRight: -8,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCell: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  radarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 16,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  radarIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radarTextGroup: {
    flex: 1,
  },
  radarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  radarSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  infoText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
