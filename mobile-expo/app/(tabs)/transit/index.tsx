import React, { useState } from 'react';
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

const TRANSIT_OPTIONS = [
  {
    id: '1',
    type: 'Airport Metro',
    line: 'Blue Line',
    eta: 8,
    fare: 60,
    crowdLevel: 'medium',
    platform: '2A',
    isRecommended: true,
  },
  {
    id: '2',
    type: 'Airport Express',
    line: 'Express',
    eta: 5,
    fare: 150,
    crowdLevel: 'low',
    platform: '3B',
    isRecommended: false,
  },
  {
    id: '3',
    type: 'Pushpak Bus',
    line: 'AC Bus',
    eta: 15,
    fare: 100,
    crowdLevel: 'high',
    platform: 'Bay 5',
    isRecommended: false,
  },
  {
    id: '4',
    type: 'Local Bus',
    line: '161',
    eta: 20,
    fare: 40,
    crowdLevel: 'high',
    platform: 'Bay 7',
    isRecommended: false,
  },
  {
    id: '5',
    type: 'Cab/Uber',
    line: 'Pickup Zone A',
    eta: 10,
    fare: 250,
    crowdLevel: 'low',
    platform: 'Zone A',
    isRecommended: false,
  },
];

export default function TransitScreen() {
  const [selectedTransit, setSelectedTransit] = useState<string | null>(null);

  const getCrowdColor = (level: string) => {
    switch (level) {
      case 'low':
        return COLORS.success;
      case 'medium':
        return COLORS.warning;
      case 'high':
        return COLORS.danger;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Transit Options</Text>
          <Text style={styles.subtitle}>Terminal 1 → City Center</Text>
        </View>

        {TRANSIT_OPTIONS.map((option) => {
          const cardStyle: any = [styles.transitCard];
          if (option.isRecommended) cardStyle.push(styles.recommended);
          if (selectedTransit === option.id) cardStyle.push(styles.selected);

          return (
          <TouchableOpacity
            key={option.id}
            onPress={() => setSelectedTransit(option.id)}
            activeOpacity={0.7}
          >
            <Card
              variant={selectedTransit === option.id ? 'elevated' : 'surface'}
              style={cardStyle}
            >
              {option.isRecommended && (
                <View style={styles.recommendedBadge}>
                  <Text style={styles.recommendedText}>RECOMMENDED</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <View style={styles.leftContent}>
                  <Text style={styles.transitType}>{option.type}</Text>
                  <Text style={styles.transitLine}>{option.line}</Text>
                </View>

                <View style={styles.rightContent}>
                  <View style={styles.etaBox}>
                    <Text style={styles.eta}>{option.eta}m</Text>
                    <Text style={styles.etaLabel}>ETA</Text>
                  </View>
                </View>
              </View>

              {/* Details Row */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Fare</Text>
                  <Text style={styles.detailValue}>₹{option.fare}</Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Crowd</Text>
                  <Text style={[styles.detailValue, { color: getCrowdColor(option.crowdLevel) }]}>
                    {option.crowdLevel.charAt(0).toUpperCase() + option.crowdLevel.slice(1)}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Platform</Text>
                  <Text style={styles.detailValue}>{option.platform}</Text>
                </View>
              </View>

              {selectedTransit === option.id && (
                <View style={styles.expandedContent}>
                  <Button label="View Live Tracking" variant="primary" />
                  {option.line !== 'Pickup Zone A' && (
                    <Button
                      label="View Route Map"
                      variant="secondary"
                      style={{ marginTop: SPACING.md }}
                    />
                  )}
                </View>
              )}
            </Card>
          </TouchableOpacity>
          );
        })}

        {/* Map Placeholder */}
        <Card style={styles.mapCard}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubtext}>Tap "View Live Tracking" to see route & tracking</Text>
          </View>
        </Card>

        <View style={styles.spacing} />
      </ScrollView>
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
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.text,
  },
  subtitle: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  transitCard: {
    marginBottom: SPACING.md,
    position: 'relative',
  },
  recommended: {
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  selected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: SPACING.lg,
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    zIndex: 10,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  leftContent: {
    flex: 1,
  },
  transitType: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  transitLine: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  rightContent: {
    alignItems: 'center',
  },
  etaBox: {
    alignItems: 'center',
  },
  eta: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
  },
  etaLabel: {
    ...TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontSize: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    ...TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontSize: 10,
    marginBottom: SPACING.xs,
  },
  detailValue: {
    ...TYPOGRAPHY.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  mapCard: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  mapPlaceholder: {
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textSecondary,
  },
  mapSubtext: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  spacing: {
    height: SPACING.xl,
  },
});
