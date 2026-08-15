import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../../constants';
import Card from '../../../components/cards/Card';
import FAB from '../../../components/common/FAB';
import Button from '../../../components/buttons/Button';
import { useAppStore } from '../../../store';
import { flightService } from '../../../services/api';

export default function HomeScreen() {
  const router = useRouter();
  const [showAI, setShowAI] = useState(false);
  const { currentFlight, setCurrentFlight, setShowAIAssistant, passengerId } = useAppStore();
  const [flightData, setFlightData] = React.useState<any>(null);

  React.useEffect(() => {
    const loadFlight = async () => {
      const flights = await flightService.getFlights(passengerId);
      if (flights.length > 0) {
        setCurrentFlight(flights[0]);
        setFlightData(flights[0]);
      }
    };
    loadFlight();
  }, []);

  const quickActions = [
    { id: '1', label: 'Track Bag', action: () => router.push('/(tabs)/baggage') },
    { id: '2', label: 'Gate Route', action: () => router.push('/(tabs)/transit') },
    { id: '3', label: 'Metro', action: () => router.push('/(tabs)/transit') },
    { id: '4', label: 'Order Food', action: () => {} },
    { id: '5', label: 'Emergency', action: () => {} },
    { id: '6', label: 'AI Help', action: () => setShowAI(!showAI) },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Your Journey Today</Text>
        </View>

        {/* Hero Card */}
        {flightData && (
          <Card variant="elevated" style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={styles.routeRow}>
                <Text style={styles.routeFrom}>{flightData.route.from}</Text>
                <Text style={styles.routeArrow}>→</Text>
                <Text style={styles.routeTo}>{flightData.route.to}</Text>
              </View>
              <Text style={styles.flightNumber}>{flightData.flightNumber}</Text>
              <Text style={styles.airline}>{flightData.airline}</Text>

              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Gate</Text>
                  <Text style={styles.detailValue}>{flightData.gate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Seat</Text>
                  <Text style={styles.detailValue}>{flightData.seat}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Boarding in</Text>
                  <Text style={styles.detailValue}>{flightData.boardingStartsIn}m</Text>
                </View>
              </View>

              <Button label="View Boarding Pass" onPress={() => router.push('/(tabs)/flights')} />
            </View>
          </Card>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionButton}
                onPress={action.action}
                accessibilityLabel={action.label}
              >
                <View style={styles.actionIcon}>
                  <Text style={styles.actionIconText}>{action.label.charAt(0)}</Text>
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weather Widget */}
        <Card style={styles.weatherCard}>
          <Text style={styles.weatherTemp}>24°C</Text>
          <Text style={styles.weatherDesc}>Partly Cloudy at HYD</Text>
        </Card>
      </ScrollView>

      {/* FAB */}
      <FAB onPress={() => setShowAI(!showAI)} />
    </SafeAreaView>
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
  greeting: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  heroCard: {
    marginBottom: SPACING.xl,
  },
  heroContent: {
    gap: SPACING.md,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  routeFrom: {
    ...TYPOGRAPHY.h3,
    color: COLORS.accent,
  },
  routeArrow: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
  },
  routeTo: {
    ...TYPOGRAPHY.h3,
    color: COLORS.accent,
  },
  flightNumber: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
    textAlign: 'center',
  },
  airline: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.md,
  },
  detailItem: {
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
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionButton: {
    width: '48%',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  actionLabel: {
    ...TYPOGRAPHY.sm,
    color: COLORS.text,
    textAlign: 'center',
  },
  weatherCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  weatherTemp: {
    ...TYPOGRAPHY.h2,
    color: COLORS.accent,
  },
  weatherDesc: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
});

