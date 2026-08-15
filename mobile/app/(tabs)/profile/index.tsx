import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../theme/colors';
import { useHealthStore } from '../../../store';

export default function ProfileScreen() {
  const { profile, medications, toggleReminder } = useHealthStore();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>SV</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{profile.passengerName}</Text>
            <Text style={styles.userSub}>Gold Frequent Flyer • Air India Flying Returns</Text>
            <Text style={styles.userRef}>PASSENGER ID #IND-8840-2026</Text>
          </View>
        </View>

        {/* Frequent Flyer & Travel Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statCell}>
            <Text style={styles.statNumber}>48,200</Text>
            <Text style={styles.statLabel}>TIER MILES</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>FLIGHTS 2026</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCell}>
            <Text style={[styles.statNumber, { color: Colors.accent }]}>GOLD</Text>
            <Text style={styles.statLabel}>TIER STATUS</Text>
          </View>
        </View>

        {/* Medical & Dietary Preferences */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical-outline" size={20} color={Colors.danger} />
            <Text style={styles.sectionTitle}>Medical & Dietary Profile</Text>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridBox}>
              <Text style={styles.boxKey}>BLOOD TYPE</Text>
              <Text style={[styles.boxVal, { color: Colors.danger }]}>{profile.bloodGroup}</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.boxKey}>AGE</Text>
              <Text style={styles.boxVal}>{profile.age} Yrs</Text>
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoKey}>MEDICAL CONDITIONS</Text>
            <View style={styles.tagWrap}>
              {profile.medicalConditions.map((cond, i) => (
                <View key={i} style={styles.conditionTag}>
                  <Text style={styles.conditionTagText}>{cond}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.infoKey}>DIETARY PREFERENCES & ALLERGIES</Text>
            <View style={styles.tagWrap}>
              {profile.allergies.map((alg, i) => (
                <View key={i} style={styles.allergyTag}>
                  <Text style={styles.allergyTagText}>⚠️ {alg}</Text>
                </View>
              ))}
              {profile.dietaryPreferences.map((pref, i) => (
                <View key={i} style={styles.dietTag}>
                  <Text style={styles.dietTagText}>{pref}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Active Medication Schedule */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="bandage-outline" size={20} color={Colors.accent} />
            <Text style={styles.sectionTitle}>Medication Schedule</Text>
          </View>

          {medications.map((med) => (
            <View key={med.id} style={styles.medCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.medName}>{med.name} ({med.dosage})</Text>
                <Text style={styles.medTime}>{med.time} • {med.instruction} • {med.frequency}</Text>
              </View>
              <TouchableOpacity
                style={[styles.remBtn, med.reminderEnabled && styles.remBtnActive]}
                onPress={() => toggleReminder(med.id)}
              >
                <Ionicons
                  name={med.reminderEnabled ? 'notifications' : 'notifications-off-outline'}
                  size={16}
                  color={med.reminderEnabled ? Colors.accent : Colors.textMuted}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Emergency Contacts */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={20} color={Colors.warning} />
            <Text style={styles.sectionTitle}>Emergency Contact</Text>
          </View>
          <View style={styles.contactRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactName}>{profile.emergencyContact}</Text>
              <Text style={styles.contactPhone}>{profile.emergencyContactPhone}</Text>
            </View>
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          </View>
        </View>

        {/* Settings & Accessibility */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="settings-outline" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Settings & Accessibility</Text>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Flight & Gate Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Haptic Feedback</Text>
            <Switch
              value={hapticsEnabled}
              onValueChange={setHapticsEnabled}
              trackColor={{ false: Colors.surface, true: Colors.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>High Contrast Mode (WCAG)</Text>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: Colors.surface, true: Colors.accent }}
            />
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
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: 10,
  },
  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
  },
  userSub: {
    fontSize: 11,
    color: Colors.accent,
    marginTop: 2,
  },
  userRef: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    marginTop: 4,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridBox: {
    flex: 1,
    backgroundColor: Colors.elevated,
    padding: 12,
    borderRadius: 14,
  },
  boxKey: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  boxVal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  infoBlock: {
    gap: 6,
  },
  infoKey: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  conditionTag: {
    backgroundColor: 'rgba(47,128,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderPrimary,
  },
  conditionTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  allergyTag: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  allergyTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.danger,
  },
  dietTag: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.3)',
  },
  dietTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  medCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.elevated,
    padding: 12,
    borderRadius: 14,
  },
  medName: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  medTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  remBtn: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
  },
  remBtnActive: {
    backgroundColor: 'rgba(20,200,255,0.15)',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 16,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  contactPhone: {
    fontSize: 12,
    color: Colors.accent,
    marginTop: 2,
  },
  primaryBadge: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  primaryBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.warning,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
  },
});
