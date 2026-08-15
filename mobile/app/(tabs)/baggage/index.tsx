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
import { Colors } from '../../../theme/colors';

const TIMELINE_STAGES = [
  { id: 'checkin', title: 'Check-in Counter 12', time: '12:15 PM', completed: true, active: false, desc: 'Baggage tagged & weighed (18.4 kg)' },
  { id: 'tsa', title: 'Security Screening (TSA)', time: '12:30 PM', completed: true, active: false, desc: 'X-ray inspection clear' },
  { id: 'cargo', title: 'Loaded to Cargo Hold', time: '01:10 PM', completed: true, active: false, desc: 'Container #AKE-4902 loaded on 6E2412' },
  { id: 'arrival', title: 'In Transit to Belt 04', time: '04:50 PM', completed: false, active: true, desc: 'Unloaded at DEL T2 • Belt 04 active' },
  { id: 'claimed', title: 'Ready for Passenger Claim', time: 'Est. 05:05 PM', completed: false, active: false, desc: 'Arrival Carousel 04' },
];

export default function BaggageScreen() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'calculator' | 'rules'>('tracker');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>SHIPMENT-STYLE BAGGAGE TRACKER</Text>
            <Text style={styles.headerTitle}>Live Luggage Telemetry</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>GPS LIVE</Text>
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'tracker' && styles.activeTab]}
            onPress={() => setActiveTab('tracker')}
          >
            <Ionicons name="briefcase-outline" size={16} color={activeTab === 'tracker' ? Colors.accent : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'tracker' && styles.activeTabText]}>Tracker</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'calculator' && styles.activeTab]}
            onPress={() => setActiveTab('calculator')}
          >
            <Ionicons name="scale-outline" size={16} color={activeTab === 'calculator' ? Colors.accent : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'calculator' && styles.activeTabText]}>Weight Tool</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'rules' && styles.activeTab]}
            onPress={() => setActiveTab('rules')}
          >
            <Ionicons name="alert-circle-outline" size={16} color={activeTab === 'rules' ? Colors.accent : Colors.textMuted} />
            <Text style={[styles.tabText, activeTab === 'rules' && styles.activeTabText]}>Rules</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'tracker' && (
          <>
            {/* Bag Specs Card */}
            <View style={styles.bagCard}>
              <View style={styles.bagHeader}>
                <View style={styles.bagIconBox}>
                  <Ionicons name="briefcase" size={24} color={Colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bagName}>Samsonite Spinner (Blue)</Text>
                  <Text style={styles.bagTag}>TAG #IND-6E-9948012</Text>
                </View>
                <View style={styles.beltBox}>
                  <Text style={styles.beltLabel}>BELT</Text>
                  <Text style={styles.beltNumber}>04</Text>
                </View>
              </View>

              <View style={styles.bagMetricsGrid}>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>WEIGHT</Text>
                  <Text style={styles.metricValue}>18.4 kg</Text>
                </View>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>CURRENT STATUS</Text>
                  <Text style={[styles.metricValue, { color: Colors.accent }]}>Transferred to Belt</Text>
                </View>
                <View style={styles.metricCell}>
                  <Text style={styles.metricLabel}>ETA TO BELT</Text>
                  <Text style={[styles.metricValue, { color: Colors.success }]}>12 Mins</Text>
                </View>
              </View>
            </View>

            {/* Vertical Timeline */}
            <View style={styles.timelineCard}>
              <Text style={styles.timelineHeader}>BAGGAGE TELEMETRY TIMELINE</Text>
              <View style={styles.timelineList}>
                {TIMELINE_STAGES.map((stage, idx) => (
                  <View key={stage.id} style={styles.timelineRow}>
                    <View style={styles.timelineLeftColumn}>
                      <View
                        style={[
                          styles.timelineDot,
                          stage.completed && styles.dotCompleted,
                          stage.active && styles.dotActive,
                        ]}
                      >
                        {stage.completed && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                        {stage.active && <View style={styles.innerPulse} />}
                      </View>
                      {idx < TIMELINE_STAGES.length - 1 && (
                        <View
                          style={[
                            styles.timelineConnector,
                            stage.completed && styles.connectorCompleted,
                          ]}
                        />
                      )}
                    </View>

                    <View style={styles.timelineRightContent}>
                      <View style={styles.stageHeader}>
                        <Text style={[styles.stageTitle, stage.active && { color: Colors.accent }]}>
                          {stage.title}
                        </Text>
                        <Text style={styles.stageTime}>{stage.time}</Text>
                      </View>
                      <Text style={styles.stageDesc}>{stage.desc}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {activeTab === 'calculator' && (
          <View style={styles.contentCard}>
            <Text style={styles.cardTitle}>Baggage Weight Allowance Calculator</Text>
            <Text style={styles.cardSubtitle}>Check baggage limits based on your ticket class</Text>
            <View style={styles.allowanceBox}>
              <Text style={styles.allowanceLabel}>ECONOMY CABIN ALLOWANCE</Text>
              <Text style={styles.allowanceValue}>15 kg Check-in + 7 kg Cabin</Text>
            </View>
            <View style={styles.allowanceBox}>
              <Text style={styles.allowanceLabel}>YOUR CURRENT TOTAL</Text>
              <Text style={[styles.allowanceValue, { color: Colors.success }]}>18.4 kg / 22 kg (Within Limit)</Text>
            </View>
          </View>
        )}

        {activeTab === 'rules' && (
          <View style={styles.contentCard}>
            <Text style={styles.cardTitle}>Prohibited Items & Security Rules</Text>
            <View style={styles.ruleItem}>
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
              <Text style={styles.ruleText}>No power banks in check-in luggage (must be in cabin bag).</Text>
            </View>
            <View style={styles.ruleItem}>
              <Ionicons name="close-circle" size={20} color={Colors.danger} />
              <Text style={styles.ruleText}>Liquids in cabin bag must not exceed 100ml per container.</Text>
            </View>
            <View style={styles.ruleItem}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.ruleText}>Laptops and electronics must be placed in separate trays at TSA.</Text>
            </View>
          </View>
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
  liveBadge: {
    backgroundColor: 'rgba(20,200,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.accent,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.elevated,
    borderWidth: 1,
    borderColor: Colors.borderAccent,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.text,
  },
  bagCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  bagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bagIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(20,200,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bagName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  bagTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.accent,
    marginTop: 2,
  },
  beltBox: {
    alignItems: 'center',
    backgroundColor: Colors.elevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  beltLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  beltNumber: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.warning,
  },
  bagMetricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  metricCell: {
    flex: 1,
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  timelineHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
  },
  timelineList: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 14,
  },
  timelineLeftColumn: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.elevated,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  dotActive: {
    borderColor: Colors.accent,
    backgroundColor: 'rgba(20,200,255,0.2)',
  },
  innerPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
  timelineConnector: {
    width: 2,
    height: 36,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  connectorCompleted: {
    backgroundColor: Colors.success,
  },
  timelineRightContent: {
    flex: 1,
    paddingBottom: 16,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stageTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  stageTime: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  stageDesc: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  contentCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
  },
  cardSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  allowanceBox: {
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 16,
    gap: 4,
  },
  allowanceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  allowanceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 14,
  },
  ruleText: {
    fontSize: 12,
    color: Colors.text,
    flex: 1,
  },
});
