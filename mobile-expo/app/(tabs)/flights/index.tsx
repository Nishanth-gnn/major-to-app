import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../../constants';
import Card from '../../../components/cards/Card';
import Button from '../../../components/buttons/Button';
import { useAppStore } from '../../../store';
import { flightService } from '../../../services/api';
import { Flight } from '../../../types';

export default function FlightsScreen() {
  const { passengerId, flights, setFlights } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFlights = async () => {
      const data = await flightService.getFlights(passengerId);
      setFlights(data);
      setLoading(false);
    };
    loadFlights();
  }, []);

  const renderBoardingPass = (flight: Flight) => (
    <Card key={flight.id} variant="elevated" style={styles.boardingPass}>
      {/* QR Code Area */}
      <View style={styles.qrArea}>
        <View style={styles.qrBox}>
          <Text style={styles.qrText}>█ ▄ █</Text>
          <Text style={styles.qrText}>▀ █ ▀</Text>
          <Text style={styles.qrText}>█ ▄ █</Text>
        </View>
      </View>

      {/* Flight Info Header */}
      <View style={styles.passHeader}>
        <Text style={styles.flightNum}>{flight.flightNumber}</Text>
        <Text style={styles.airlineName}>{flight.airline}</Text>
      </View>

      {/* Route */}
      <View style={styles.routeBox}>
        <View style={styles.routeStop}>
          <Text style={styles.stopCode}>{flight.route.from}</Text>
          <Text style={styles.stopTime}>Depart</Text>
        </View>
        <View style={styles.routeLine}>
          <View style={styles.line} />
        </View>
        <View style={styles.routeStop}>
          <Text style={styles.stopCode}>{flight.route.to}</Text>
          <Text style={styles.stopTime}>Arrive</Text>
        </View>
      </View>

      {/* Details Grid */}
      <View style={styles.detailsGrid}>
        <DetailBox label="Terminal" value={flight.terminal} />
        <DetailBox label="Gate" value={flight.gate} />
        <DetailBox label="Seat" value={flight.seat} />
        <DetailBox label="Group" value={flight.boardingGroup} />
      </View>

      {/* Status */}
      <View style={[styles.statusBadge, styles[`status-${flight.status}`]]}>
        <Text style={styles.statusText}>{flight.status.toUpperCase()}</Text>
      </View>

      {/* Action */}
      <Button label="View Full Booking Details" variant="primary" />
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Flights</Text>
        </View>

        {loading ? (
          <Text style={styles.loading}>Loading flights...</Text>
        ) : flights.length > 0 ? (
          flights.map(renderBoardingPass)
        ) : (
          <Text style={styles.emptyText}>No flights found</Text>
        )}

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailBox}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  boardingPass: {
    marginBottom: SPACING.lg,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  qrArea: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  qrBox: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: 'monospace',
  },
  passHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  flightNum: {
    ...TYPOGRAPHY.h2,
    color: COLORS.accent,
  },
  airlineName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  routeStop: {
    flex: 1,
    alignItems: 'center',
  },
  stopCode: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  stopTime: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  routeLine: {
    flex: 0.3,
    alignItems: 'center',
  },
  line: {
    height: 1,
    width: '100%',
    backgroundColor: COLORS.border,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailBox: {
    width: '48%',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  detailLabel: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
  },
  statusBadge: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.pill,
    alignSelf: 'center',
    marginBottom: SPACING.lg,
  },
  'status-boarding': {
    backgroundColor: COLORS.success,
  },
  'status-scheduled': {
    backgroundColor: COLORS.primary,
  },
  'status-departed': {
    backgroundColor: COLORS.textSecondary,
  },
  'status-delayed': {
    backgroundColor: COLORS.warning,
  },
  statusText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  loading: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xl,
  },
  spacing: {
    height: SPACING.xl,
  },
});
