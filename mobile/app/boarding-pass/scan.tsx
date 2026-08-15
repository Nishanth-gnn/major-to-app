import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '../../theme/colors';
import { usePassengerStore } from '../../store';

export default function BoardingPassScanScreen() {
  const router = useRouter();
  const { setBoardingData } = usePassengerStore();
  const [scanned, setScanned] = useState(false);

  const handleSimulateScan = () => {
    setScanned(true);
    setBoardingData({
      passenger_name: 'Sai Venkat',
      ticket_id: '3409967503',
      flight_id: 'AI-102',
      from: 'HYD',
      to: 'DEL',
      terminal: 'Terminal 3',
      seat: '12A',
      gate: '14B',
      date: new Date().toLocaleDateString('en-IN'),
      airline: 'Air India',
      boarding_group: 'Group A',
      departure_time: '18:15',
      arrival_time: '20:30',
    });
    setTimeout(() => {
      router.replace('/(tabs)/flights');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerLabel}>PASSENGER TICKET SCANNER</Text>
            <Text style={styles.headerTitle}>Scan Boarding Pass QR</Text>
          </View>
        </View>

        {/* Viewfinder box */}
        <View style={styles.scannerContainer}>
          <View style={styles.viewfinder}>
            <Ionicons name="qr-code-outline" size={120} color={scanned ? Colors.success : Colors.accent} />
            <Text style={styles.viewfinderText}>
              {scanned ? 'Ticket Verified! Loading Boarding Pass...' : 'Align ticket QR code within frame'}
            </Text>
          </View>

          <TouchableOpacity style={styles.scanBtn} onPress={handleSimulateScan}>
            <Ionicons name="camera" size={20} color="#FFFFFF" />
            <Text style={styles.scanBtnText}>Simulate Ticket QR Scan</Text>
          </TouchableOpacity>
        </View>
      </View>
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
    padding: 20,
    gap: 20,
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
  scannerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  viewfinder: {
    width: 280,
    height: 280,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: Colors.accent,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 20,
  },
  viewfinderText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textAlign: 'center',
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
  },
  scanBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
