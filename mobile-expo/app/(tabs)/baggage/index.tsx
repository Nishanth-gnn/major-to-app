import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../../constants';
import Card from '../../../components/cards/Card';
import Button from '../../../components/buttons/Button';
import { useAppStore } from '../../../store';
import { baggageService } from '../../../services/api';
import { Baggage } from '../../../types';

export default function BaggageScreen() {
  const { passengerId, baggage, setBaggage } = useAppStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBaggage = async () => {
      const data = await baggageService.getBaggage(passengerId);
      setBaggage(data);
      setLoading(false);
    };
    loadBaggage();
  }, []);

  const timelineSteps = ['Checked-in', 'Loaded', 'In Transit', 'Delivered'];
  const statusMap: { [key: string]: number } = {
    'checked-in': 0,
    'loaded': 1,
    'in-transit': 2,
    'delivered': 3,
  };

  const renderBaggageCard = (item: Baggage) => {
    const currentStep = statusMap[item.status] ?? 0;

    return (
      <Card key={item.id} variant="elevated" style={styles.baggageCard}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.bagNumber}>{item.bagNumber}</Text>
            <Text style={styles.tagNumber}>{item.tagNumber}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusLabel}>{item.status.replace('-', ' ').toUpperCase()}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {timelineSteps.map((step, index) => (
            <View key={step} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDot,
                  index <= currentStep && styles.timelineDotActive,
                ]}
              />
              {index < timelineSteps.length - 1 && (
                <View
                  style={[
                    styles.timelineLine,
                    index < currentStep && styles.timelineLineActive,
                  ]}
                />
              )}
            </View>
          ))}
          <View style={styles.timelineLabels}>
            {timelineSteps.map((step) => (
              <Text key={step} style={styles.timelineLabel}>
                {step}
              </Text>
            ))}
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsBox}>
          <DetailRow label="Current Location" value={item.currentLocation} />
          {item.beltNumber && <DetailRow label="Belt Number" value={item.beltNumber} />}
          <DetailRow label="ETA" value={new Date(item.eta).toLocaleTimeString()} />
          <DetailRow
            label="Last Updated"
            value={new Date(item.lastUpdated).toLocaleTimeString()}
          />
        </View>

        <Button label="Live Tracking" variant="primary" />
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Baggage</Text>
        </View>

        {loading ? (
          <Text style={styles.loading}>Loading baggage...</Text>
        ) : baggage.length > 0 ? (
          baggage.map(renderBaggageCard)
        ) : (
          <Text style={styles.emptyText}>No baggage to track</Text>
        )}

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
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
  baggageCard: {
    marginBottom: SPACING.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bagNumber: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  tagNumber: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  statusBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  statusLabel: {
    ...TYPOGRAPHY.sm,
    color: '#fff',
    fontWeight: '600',
  },
  timeline: {
    marginBottom: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    marginRight: SPACING.md,
  },
  timelineDotActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  timelineLine: {
    position: 'absolute',
    left: 6,
    top: 20,
    width: 2,
    height: 32,
    backgroundColor: COLORS.border,
  },
  timelineLineActive: {
    backgroundColor: COLORS.success,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -SPACING.lg,
  },
  timelineLabel: {
    ...TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontSize: 11,
    flex: 1,
    marginLeft: 24,
  },
  detailsBox: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  detailValue: {
    ...TYPOGRAPHY.sm,
    color: COLORS.accent,
    fontWeight: '600',
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
