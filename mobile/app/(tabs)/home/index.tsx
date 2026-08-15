import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../theme/colors';
import { usePassengerStore, useAIStore } from '../../../store';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { boardingData, selectedAirport } = usePassengerStore();
  const { setOpen: openAI } = useAIStore();

  const [countdownMinutes, setCountdownMinutes] = useState(42);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownMinutes((prev) => (prev > 1 ? prev - 1 : 42));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    { id: 'bag', label: 'Track Bag', icon: 'briefcase', color: Colors.accent, action: () => router.push('/baggage') },
    { id: 'gate', label: 'Gate Route', icon: 'compass', color: Colors.primary, action: () => router.push('/transit') },
    { id: 'metro', label: 'Metro', icon: 'subway', color: Colors.success, action: () => router.push('/transit') },
    { id: 'food', label: 'Order Food', icon: 'fast-food', color: Colors.warning, action: () => router.push('/services/meal-delivery') },
    { id: 'emergency', label: 'Emergency', icon: 'warning', color: Colors.danger, action: () => router.push('/services/emergency') },
    { id: 'ai', label: 'AI Concierge', icon: 'sparkles', color: '#C084FC', action: () => openAI(true) },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>PASSENGER DASHBOARD</Text>
            <Text style={styles.headerTitle}>Welcome, Sai Venkat 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileBadge} onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle" size={38} color={Colors.accent} />
          </TouchableOpacity>
        </View>

        {/* Top Hero Card — Your Journey Today */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View style={styles.badgeRow}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE JOURNEY</Text>
              </View>
              <Text style={styles.flightDate}>{boardingData?.date || 'Today'}</Text>
            </View>
            <Text style={styles.heroTitle}>Your Journey Today</Text>
          </View>

          {/* Route details */}
          <View style={styles.routeContainer}>
            <View style={styles.cityBlock}>
              <Text style={styles.cityCode}>{boardingData?.from || 'HYD'}</Text>
              <Text style={styles.cityName}>Hyderabad</Text>
            </View>

            <View style={styles.flightVisual}>
              <View style={styles.flightLine} />
              <View style={styles.planeIconContainer}>
                <Ionicons name="airplane" size={20} color={Colors.accent} />
              </View>
              <Text style={styles.flightNumber}>{boardingData?.flight_id || '6E2412'}</Text>
            </View>

            <View style={[styles.cityBlock, { alignItems: 'flex-end' }]}>
              <Text style={styles.cityCode}>{boardingData?.to || 'DEL'}</Text>
              <Text style={styles.cityName}>New Delhi</Text>
            </View>
          </View>

          {/* Circular Countdown Ring & Flight Specs */}
          <View style={styles.specGrid}>
            <View style={styles.countdownBox}>
              <View style={styles.ringOuter}>
                <Text style={styles.countdownNumber}>{countdownMinutes}</Text>
                <Text style={styles.countdownUnit}>MINS</Text>
              </View>
              <Text style={styles.countdownLabel}>Boarding in</Text>
            </View>

            <View style={styles.specsColumn}>
              <View style={styles.specRow}>
                <View style={styles.specItem}>
                  <Text style={styles.specKey}>GATE</Text>
                  <Text style={[styles.specValue, { color: Colors.accent }]}>
                    {boardingData?.gate || '14B'}
                  </Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specKey}>SEAT</Text>
                  <Text style={styles.specValue}>{boardingData?.seat || '18A'}</Text>
                </View>
              </View>

              <View style={[styles.specRow, { marginTop: 10 }]}>
                <View style={styles.specItem}>
                  <Text style={styles.specKey}>TERMINAL</Text>
                  <Text style={styles.specValue}>{boardingData?.terminal || 'T2'}</Text>
                </View>
                <View style={styles.specItem}>
                  <Text style={styles.specKey}>STATUS</Text>
                  <Text style={[styles.specValue, { color: Colors.success }]}>On Time</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Timeline Stages Progress */}
          <View style={styles.timelineSection}>
            <Text style={styles.timelineTitle}>JOURNEY PROGRESS</Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '65%' }]} />
            </View>

            <View style={styles.timelineStages}>
              <View style={styles.stageItem}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.stageActiveText}>Check-in</Text>
              </View>
              <View style={styles.stageItem}>
                <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
                <Text style={styles.stageActiveText}>Security</Text>
              </View>
              <View style={styles.stageItem}>
                <Ionicons name="radio-button-on" size={14} color={Colors.accent} />
                <Text style={[styles.stageActiveText, { color: Colors.accent }]}>Gate 14B</Text>
              </View>
              <View style={styles.stageItem}>
                <Ionicons name="ellipse-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.stageMutedText}>Boarding</Text>
              </View>
            </View>
          </View>

          {/* Weather Widget */}
          <View style={styles.weatherWidget}>
            <Ionicons name="sunny-outline" size={20} color={Colors.warning} />
            <Text style={styles.weatherText}>
              Destination Delhi: <Text style={{ fontWeight: '800', color: Colors.text }}>31°C Clear</Text> • Wind 12 km/h
            </Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>QUICK PASSENGER ACTIONS</Text>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map((item) => (
            <TouchableOpacity key={item.id} style={styles.quickCard} activeOpacity={0.8} onPress={item.action}>
              <View style={[styles.iconCircle, { backgroundColor: item.color + '20' }]}>
                <Ionicons name={item.icon as any} size={22} color={item.color} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Secondary Modules Banner */}
        <View style={styles.servicesBanner}>
          <Text style={styles.bannerTitle}>PORTAL ASSISTANCE SERVICES</Text>
          <View style={styles.serviceButtonsRow}>
            <TouchableOpacity style={styles.serviceButton} onPress={() => router.push('/services/translation')}>
              <Ionicons name="language" size={18} color={Colors.accent} />
              <Text style={styles.serviceButtonText}>Translate</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceButton} onPress={() => router.push('/services/guardian')}>
              <Ionicons name="shield-checkmark" size={18} color={Colors.success} />
              <Text style={styles.serviceButtonText}>AI Guardian</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.serviceButton} onPress={() => router.push('/boarding-pass/scan')}>
              <Ionicons name="qr-code" size={18} color={Colors.warning} />
              <Text style={styles.serviceButtonText}>Scan Ticket</Text>
            </TouchableOpacity>
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
  profileBadge: {
    padding: 2,
  },
  heroCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  heroHeader: {
    gap: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  liveText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
  flightDate: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  cityBlock: {
    flex: 1,
  },
  cityCode: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.text,
    letterSpacing: 1,
  },
  cityName: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  flightVisual: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  flightLine: {
    width: 80,
    height: 2,
    backgroundColor: Colors.border,
    position: 'absolute',
  },
  planeIconContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
  },
  flightNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    marginTop: 4,
  },
  specGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  countdownBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(20,200,255,0.08)',
  },
  countdownNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
  },
  countdownUnit: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.accent,
  },
  countdownLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 4,
  },
  specsColumn: {
    flex: 1,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specItem: {
    flex: 1,
  },
  specKey: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  specValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  timelineSection: {
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  timelineTitle: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
  timelineStages: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stageActiveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
  stageMutedText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  weatherText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickCard: {
    width: (width - 52) / 3,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  servicesBanner: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  bannerTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  serviceButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  serviceButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.elevated,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  serviceButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.text,
  },
});
