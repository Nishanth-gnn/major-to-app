import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../theme/colors';
import { AIRPORTS, usePassengerStore } from '../../../store';

export default function TransitScreen() {
  const router = useRouter();
  const { selectedAirport, setSelectedAirport } = usePassengerStore();
  const [selectedMode, setSelectedMode] = useState<string>('metro');

  const modes = [
    {
      id: 'metro',
      title: 'Airport Metro Express',
      subtitle: 'Fastest high-speed rail line to City Center',
      icon: 'subway',
      eta: '3 min',
      fare: '₹60',
      time: '18 min',
      crowd: 'Low',
      platform: 'Platform 2',
      badge: 'RECOMMENDED',
      recommended: true,
      accentColor: Colors.primary,
    },
    {
      id: 'bus',
      title: 'Pushpak Electric Bus',
      subtitle: 'AC Express Coaches & Shuttles with live Telegram GPS',
      icon: 'bus',
      eta: '7 min',
      fare: '₹250',
      time: '35 min',
      crowd: 'Medium',
      platform: 'Bay 3',
      badge: 'LIVE GPS',
      recommended: false,
      accentColor: Colors.success,
    },
    {
      id: 'cab',
      title: 'Prepaid Cabs & Uber',
      subtitle: 'Instant designated airport pickup zone',
      icon: 'car',
      eta: '4 min',
      fare: '₹450-₹600',
      time: '25 min',
      crowd: 'Low Queue',
      platform: 'Level P3 Pillar 12',
      badge: 'PREPAID',
      recommended: false,
      accentColor: Colors.warning,
    },
    {
      id: 'walk',
      title: 'Terminal Walkway',
      subtitle: 'Elevator & travelator indoor accessible route',
      icon: 'walk',
      eta: 'Immediate',
      fare: 'Free',
      time: '4 min',
      crowd: 'Clear',
      platform: 'Terminal Walkway',
      badge: 'ACCESSIBLE',
      recommended: false,
      accentColor: Colors.accent,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>MULTIMODAL TRANSIT CONTROL</Text>
            <Text style={styles.headerTitle}>Airport Transport Options</Text>
          </View>
          <View style={styles.airportChip}>
            <Ionicons name="location" size={12} color={Colors.accent} />
            <Text style={styles.airportChipText}>{selectedAirport.code}</Text>
          </View>
        </View>

        {/* Airport Hub Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hubSelector}>
          {AIRPORTS.map((ap) => (
            <TouchableOpacity
              key={ap.id}
              style={[
                styles.hubChip,
                selectedAirport.id === ap.id && styles.activeHubChip,
              ]}
              onPress={() => setSelectedAirport(ap)}
            >
              <Text style={[styles.hubChipText, selectedAirport.id === ap.id && styles.activeHubText]}>
                {ap.code} — {ap.city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recommended Highlight Banner */}
        <View style={styles.recommendationBanner}>
          <View style={styles.recIconCircle}>
            <Ionicons name="star" size={18} color={Colors.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.recTitle}>AI Dispatch Recommendation</Text>
            <Text style={styles.recText}>
              Board Airport Metro Express at Platform 2. Saves 18 mins compared to road traffic.
            </Text>
          </View>
        </View>

        {/* Stacked Mobile Cards */}
        <View style={styles.cardStack}>
          {modes.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              activeOpacity={0.9}
              style={[
                styles.modeCard,
                mode.recommended && styles.recommendedCard,
                selectedMode === mode.id && { borderColor: mode.accentColor },
              ]}
              onPress={() => setSelectedMode(mode.id)}
            >
              {/* Badge row */}
              <View style={styles.modeCardHeader}>
                <View style={styles.badgeRow}>
                  {mode.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Ionicons name="sparkles" size={10} color={Colors.accent} />
                      <Text style={styles.recommendedBadgeText}>RECOMMENDED</Text>
                    </View>
                  )}
                  <View style={[styles.statusTag, { backgroundColor: mode.accentColor + '20', borderColor: mode.accentColor + '40' }]}>
                    <Text style={[styles.statusTagText, { color: mode.accentColor }]}>{mode.badge}</Text>
                  </View>
                </View>
                <Text style={styles.fareTag}>{mode.fare} • {mode.time}</Text>
              </View>

              {/* Title & Icon */}
              <View style={styles.modeTitleRow}>
                <View style={[styles.modeIconBox, { backgroundColor: mode.accentColor + '20' }]}>
                  <Ionicons name={mode.icon as any} size={22} color={mode.accentColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modeTitle}>{mode.title}</Text>
                  <Text style={styles.modeSubtitle}>{mode.subtitle}</Text>
                </View>
              </View>

              {/* Key Specs Grid */}
              <View style={styles.specsGrid}>
                <View style={styles.specCell}>
                  <Text style={styles.specKey}>NEXT DEPARTURE</Text>
                  <Text style={[styles.specVal, { color: Colors.accent }]}>{mode.eta}</Text>
                </View>
                <View style={styles.specCell}>
                  <Text style={styles.specKey}>PICKUP / PLATFORM</Text>
                  <Text style={styles.specVal}>{mode.platform}</Text>
                </View>
                <View style={styles.specCell}>
                  <Text style={styles.specKey}>CROWD LEVEL</Text>
                  <Text style={[styles.specVal, { color: Colors.success }]}>{mode.crowd}</Text>
                </View>
              </View>

              {/* Live Tracking Trigger */}
              {(mode.id === 'metro' || mode.id === 'bus') && (
                <TouchableOpacity
                  style={[styles.trackBtn, { backgroundColor: mode.accentColor }]}
                  onPress={() => router.push({ pathname: '/transit/track', params: { mode: mode.id } })}
                >
                  <Ionicons name="navigate-outline" size={16} color="#FFFFFF" />
                  <Text style={styles.trackBtnText}>Open Live Telemetry Map</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))}
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
    gap: 16,
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
  airportChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  airportChipText: {
    fontSize: 12,
    fontWeight: '900',
    color: Colors.accent,
  },
  hubSelector: {
    gap: 8,
  },
  hubChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  activeHubChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hubChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  activeHubText: {
    color: '#FFFFFF',
  },
  recommendationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(20,200,255,0.08)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  recIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(20,200,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.accent,
  },
  recText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  cardStack: {
    gap: 14,
  },
  modeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  recommendedCard: {
    backgroundColor: Colors.elevated,
    borderColor: Colors.borderAccent,
    borderWidth: 1.5,
  },
  modeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(20,200,255,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  recommendedBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.accent,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  statusTagText: {
    fontSize: 9,
    fontWeight: '800',
  },
  fareTag: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.success,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modeIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  modeSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  specsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  specCell: {
    flex: 1,
  },
  specKey: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  specVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 4,
  },
  trackBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
