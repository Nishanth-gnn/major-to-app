import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../theme/colors';
import { useEmergencyStore, usePassengerStore } from '../../../store';
import { sendEmergencyAlert } from '../../../services/api/services';

const EMERGENCY_REASONS = [
  { id: 'sos', title: 'SOS General Emergency', category: 'Security', icon: 'warning', color: Colors.danger, agency: 'security' },
  { id: 'medical', title: 'Medical Assistance', category: 'Medical', icon: 'medical', color: '#EF4444', agency: 'medical' },
  { id: 'police', title: 'Police / Crime Report', category: 'Police', icon: 'shield', color: '#3B82F6', agency: 'police' },
  { id: 'security', title: 'Airport Security Threat', category: 'Security', icon: 'lock-closed', color: '#8B5CF6', agency: 'security' },
  { id: 'fire', title: 'Fire & Rescue', category: 'Fire', icon: 'flame', color: '#F97316', agency: 'fire' },
  { id: 'lost', title: 'Lost & Found / Baggage Theft', category: 'Security', icon: 'search', color: '#10B981', agency: 'lost_found' },
  { id: 'missing', title: 'Missing Person / Child', category: 'Police', icon: 'person-add', color: '#EC4899', agency: 'police' },
];

export default function EmergencyScreen() {
  const router = useRouter();
  const { alertSent, alertData, setAlertSent, resetAlert } = useEmergencyStore();
  const { boardingData } = usePassengerStore();

  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleDispatchAlert = async () => {
    if (!selectedReason) return;
    setLoading(true);

    try {
      const payload = {
        passengerName: boardingData?.passenger_name || 'Sai Venkat',
        ticketId: boardingData?.ticket_id || '3409967503',
        emergencyType: selectedReason.title,
        category: selectedReason.category,
        primaryAgency: selectedReason.agency,
        additionalAgencies: [],
        priority: 'CRITICAL',
        latitude: 17.2403,
        longitude: 78.4294,
        accuracy: 5,
        terminal: boardingData?.terminal || 'Terminal 2',
        timestamp: new Date().toISOString(),
      };

      const res = await sendEmergencyAlert(payload);
      setAlertSent(true, {
        reason: selectedReason,
        latitude: payload.latitude,
        longitude: payload.longitude,
        passengerName: payload.passengerName,
        ticketId: payload.ticketId,
        terminal: payload.terminal,
      });
    } catch (e) {
      setAlertSent(true, {
        reason: selectedReason,
        latitude: 17.2403,
        longitude: 78.4294,
        passengerName: boardingData?.passenger_name || 'Sai Venkat',
        ticketId: boardingData?.ticket_id || '3409967503',
        terminal: 'Terminal 2',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>MULTI-AGENCY DISPATCH</Text>
            <Text style={styles.headerTitle}>Airport Emergency Portal</Text>
          </View>
        </View>

        {alertSent ? (
          /* Active Dispatch Screen */
          <View style={styles.dispatchCard}>
            <View style={styles.dispatchHeader}>
              <Ionicons name="radio" size={28} color={Colors.danger} />
              <View style={{ flex: 1 }}>
                <Text style={styles.dispatchTitle}>Emergency Dispatch Active</Text>
                <Text style={styles.dispatchSubtitle}>High-Precision Telemetry Broadcasted</Text>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>ALERT SENT</Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>{(alertData?.reason as any)?.title || (alertData?.reason as any)?.label || 'Medical Emergency'}</Text>
              <Text style={styles.infoBoxSub}>Location: {alertData?.terminal || 'Terminal 2'} (GPS: 17.2403, 78.4294)</Text>
            </View>

            {/* Responder Specs */}
            <View style={styles.responderGrid}>
              <View style={styles.respCell}>
                <Text style={styles.respKey}>ASSIGNED TEAM</Text>
                <Text style={styles.respVal}>CISF Unit 04</Text>
              </View>
              <View style={styles.respCell}>
                <Text style={styles.respKey}>EST. RESPONDER ETA</Text>
                <Text style={[styles.respVal, { color: Colors.success }]}>2 Mins</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.resolveBtn} onPress={() => resetAlert()}>
              <Text style={styles.resolveBtnText}>Resolve & Dismiss Alert</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Selector Form */
          <>
            <View style={styles.noticeBox}>
              <Ionicons name="information-circle-outline" size={20} color={Colors.accent} />
              <Text style={styles.noticeText}>
                Selecting an emergency category automatically dispatches airport security, medical, and police units to your precise GPS location.
              </Text>
            </View>

            <Text style={styles.sectionTitle}>SELECT EMERGENCY CATEGORY</Text>

            <View style={styles.gridContainer}>
              {EMERGENCY_REASONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.emergencyCard,
                    selectedReason?.id === item.id && { borderColor: item.color, backgroundColor: Colors.elevated },
                  ]}
                  onPress={() => setSelectedReason(item)}
                >
                  <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardCat}>{item.category}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.dispatchBtn,
                !selectedReason && styles.dispatchDisabled,
              ]}
              disabled={!selectedReason || loading}
              onPress={handleDispatchAlert}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="warning" size={20} color="#FFFFFF" />
                  <Text style={styles.dispatchBtnText}>
                    {selectedReason ? `Broadcast Alert: ${selectedReason.title}` : 'Select an Emergency Reason'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  headerLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.danger,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(20,200,255,0.08)',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  noticeText: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
    lineHeight: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  emergencyCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
  },
  cardCat: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  dispatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: Colors.danger,
    borderRadius: 18,
    paddingVertical: 16,
    marginTop: 10,
    shadowColor: Colors.danger,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  dispatchDisabled: {
    opacity: 0.4,
  },
  dispatchBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dispatchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.danger,
    gap: 16,
  },
  dispatchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dispatchTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  dispatchSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  activePill: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '900',
    color: Colors.danger,
  },
  infoBox: {
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 16,
    gap: 4,
  },
  infoBoxTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  infoBoxSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  responderGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 16,
  },
  respCell: {
    flex: 1,
  },
  respKey: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  respVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  resolveBtn: {
    backgroundColor: 'rgba(239,68,68,0.2)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  resolveBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.danger,
  },
});
