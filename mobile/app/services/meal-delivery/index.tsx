import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../../theme/colors';
import { usePassengerStore } from '../../../store';

const RESTAURANTS = [
  {
    id: 'rest-1',
    name: 'Bikanervala Express',
    cuisine: 'North Indian • Pure Veg',
    rating: 4.8,
    prepTime: 12,
    seatDelivery: true,
    price: '₹250',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500',
  },
  {
    id: 'rest-2',
    name: 'Subway Airport Terminal',
    cuisine: 'Healthy Subs & Salads',
    rating: 4.6,
    prepTime: 8,
    seatDelivery: true,
    price: '₹350',
    image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500',
  },
  {
    id: 'rest-3',
    name: 'Starbucks Coffee & Snacks',
    cuisine: 'Beverages & Pastries',
    rating: 4.9,
    prepTime: 5,
    seatDelivery: true,
    price: '₹400',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500',
  },
];

const DELIVERY_STAGES = [
  { id: '1', label: 'Order Received', done: true },
  { id: '2', label: 'Preparing', done: true },
  { id: '3', label: 'Packed', done: true },
  { id: '4', label: 'Transferred to Airport Catering', done: false, active: true },
  { id: '5', label: 'Loaded onto Aircraft', done: false },
  { id: '6', label: 'Delivered to Seat 18A', done: false },
];

export default function MealDeliveryScreen() {
  const router = useRouter();
  const { boardingData } = usePassengerStore();
  const [selectedRest, setSelectedRest] = useState<any>(RESTAURANTS[0]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>GATE & SEAT MEAL DELIVERY</Text>
            <Text style={styles.headerTitle}>Airport Food Ordering</Text>
          </View>
        </View>

        {/* Order Delivery Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>CURRENT ACTIVE MEAL ORDER</Text>

          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <Text style={styles.gridKey}>FLIGHT</Text>
              <Text style={styles.gridVal}>{boardingData?.flight_id || '6E2412'}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.gridKey}>GATE</Text>
              <Text style={[styles.gridVal, { color: Colors.accent }]}>{boardingData?.gate || '14B'}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.gridKey}>SEAT</Text>
              <Text style={styles.gridVal}>{boardingData?.seat || '18A'}</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.gridKey}>DELIVERY METHOD</Text>
              <Text style={[styles.gridVal, { color: Colors.success }]}>In-Seat Delivery</Text>
            </View>
          </View>

          {/* Delivery Timeline */}
          <View style={styles.timelineBox}>
            <Text style={styles.timelineHeader}>DELIVERY TIMELINE PROGRESS</Text>
            {DELIVERY_STAGES.map((stg) => (
              <View key={stg.id} style={styles.stageRow}>
                <Ionicons
                  name={stg.done ? 'checkmark-circle' : stg.active ? 'radio-button-on' : 'ellipse-outline'}
                  size={16}
                  color={stg.done ? Colors.success : stg.active ? Colors.accent : Colors.textMuted}
                />
                <Text style={[styles.stageLabel, stg.active && { color: Colors.accent, fontWeight: '800' }]}>
                  {stg.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Restaurant List */}
        <Text style={styles.sectionTitle}>PREMIUM AIRPORT RESTAURANTS</Text>

        <View style={styles.restList}>
          {RESTAURANTS.map((rest) => (
            <TouchableOpacity
              key={rest.id}
              style={[
                styles.restCard,
                selectedRest.id === rest.id && { borderColor: Colors.accent, borderWidth: 1.5 },
              ]}
              onPress={() => setSelectedRest(rest)}
            >
              <Image source={{ uri: rest.image }} style={styles.restImage} />
              <View style={styles.restInfo}>
                <View style={styles.restHeader}>
                  <Text style={styles.restName}>{rest.name}</Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={10} color={Colors.warning} />
                    <Text style={styles.ratingText}>{rest.rating}</Text>
                  </View>
                </View>

                <Text style={styles.restCuisine}>{rest.cuisine}</Text>

                <View style={styles.restFooter}>
                  <Text style={styles.prepTime}>⏱️ {rest.prepTime} Mins Prep</Text>
                  {rest.seatDelivery && (
                    <View style={styles.seatBadge}>
                      <Ionicons name="airplane" size={10} color={Colors.success} />
                      <Text style={styles.seatBadgeText}>Seat Delivery</Text>
                    </View>
                  )}
                </View>
              </View>
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
    color: Colors.accent,
    letterSpacing: 1.2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.text,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  summaryTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridCell: {
    width: '46%',
    backgroundColor: Colors.elevated,
    padding: 10,
    borderRadius: 12,
  },
  gridKey: {
    fontSize: 8,
    fontWeight: '800',
    color: Colors.textMuted,
  },
  gridVal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.text,
    marginTop: 2,
  },
  timelineBox: {
    backgroundColor: Colors.elevated,
    padding: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 4,
  },
  timelineHeader: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accent,
    letterSpacing: 1.2,
    marginTop: 4,
  },
  restList: {
    gap: 12,
  },
  restCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: Colors.elevated,
  },
  restInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  restHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.warning,
  },
  restCuisine: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  restFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  prepTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  seatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34,197,94,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  seatBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.success,
  },
});
