import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../../../constants';
import Card from '../../../components/cards/Card';
import Button from '../../../components/buttons/Button';

export default function ProfileScreen() {
  const [preferences, setPreferences] = useState({
    notifications: true,
    screenReader: false,
    highContrast: false,
    reducedMotion: false,
  });

  const handleToggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
        </View>

        {/* Passenger Info */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.email}>john.doe@example.com</Text>
            </View>
          </View>
        </Card>

        {/* Frequent Flyer */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Frequent Flyer</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Program</Text>
            <Text style={styles.infoValue}>Frequent Flyer Gold</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Miles</Text>
            <Text style={styles.infoValue}>2,450 miles</Text>
          </View>
        </Card>

        {/* Preferences */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Dietary Preferences</Text>
          <View style={styles.tagContainer}>
            {['Vegetarian', 'Gluten-free', 'Nut-free'].map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Medical Profile */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Medical Profile</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Allergies</Text>
            <Text style={styles.infoValue}>Peanuts, Shellfish</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Conditions</Text>
            <Text style={styles.infoValue}>Asthma</Text>
          </View>
        </Card>

        {/* Emergency Contacts */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <View style={styles.contactBox}>
            <View>
              <Text style={styles.contactName}>Jane Doe (Spouse)</Text>
              <Text style={styles.contactPhone}>+91 98765 43210</Text>
            </View>
          </View>
        </Card>

        {/* Settings */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <PreferenceToggle
            label="Notifications"
            value={preferences.notifications}
            onToggle={() => handleToggle('notifications')}
          />
          <PreferenceToggle
            label="Language"
            sublabel="English"
            value={false}
            disabled
          />
        </Card>

        {/* Accessibility */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>

          <PreferenceToggle
            label="Screen Reader"
            value={preferences.screenReader}
            onToggle={() => handleToggle('screenReader')}
          />
          <PreferenceToggle
            label="High Contrast"
            value={preferences.highContrast}
            onToggle={() => handleToggle('highContrast')}
          />
          <PreferenceToggle
            label="Reduced Motion"
            value={preferences.reducedMotion}
            onToggle={() => handleToggle('reducedMotion')}
          />
        </Card>

        {/* Travel History */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Travel History</Text>
          <View style={styles.flightHistoryBox}>
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>Aug 12, 2024</Text>
              <Text style={styles.historyRoute}>HYD → DEL • 6E2412</Text>
            </View>
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>Aug 05, 2024</Text>
              <Text style={styles.historyRoute}>DEL → BLR • 6E502</Text>
            </View>
          </View>
        </Card>

        {/* Actions */}
        <View style={styles.actions}>
          <Button label="Edit Profile" variant="primary" />
          <Button label="Logout" variant="danger" style={{ marginTop: SPACING.md }} />
        </View>

        <View style={styles.spacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PreferenceToggle({
  label,
  sublabel,
  value,
  onToggle,
  disabled,
}: {
  label: string;
  sublabel?: string;
  value: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLabel}>
        <Text style={styles.toggleLabelText}>{label}</Text>
        {sublabel && <Text style={styles.toggleSubtitle}>{sublabel}</Text>}
      </View>
      <Switch value={value} onValueChange={onToggle} disabled={disabled} />
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
  profileCard: {
    marginBottom: SPACING.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  name: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
  },
  email: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: {
    ...TYPOGRAPHY.sm,
    color: COLORS.textSecondary,
  },
  infoValue: {
    ...TYPOGRAPHY.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tag: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contactBox: {
    paddingVertical: SPACING.md,
  },
  contactName: {
    ...TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  contactPhone: {
    ...TYPOGRAPHY.sm,
    color: COLORS.accent,
    marginTop: SPACING.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  toggleLabel: {
    flex: 1,
  },
  toggleLabelText: {
    ...TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  toggleSubtitle: {
    ...TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontSize: 11,
    marginTop: SPACING.xs,
  },
  flightHistoryBox: {
    gap: SPACING.md,
  },
  historyItem: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
  },
  historyDate: {
    ...TYPOGRAPHY.xs,
    color: COLORS.textSecondary,
    fontSize: 11,
    marginBottom: SPACING.xs,
  },
  historyRoute: {
    ...TYPOGRAPHY.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  actions: {
    marginTop: SPACING.xl,
  },
  spacing: {
    height: SPACING.xl,
  },
});
