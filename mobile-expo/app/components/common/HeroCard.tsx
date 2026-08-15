import React from 'react';
import { View, Text } from 'react-native';

export default function HeroCard() {
  return (
    <View style={{
      backgroundColor: '#0E1B2D',
      borderRadius: 24,
      padding: 18,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 10
    }}>
      <Text style={{ color: '#F8FAFC', fontSize: 18, fontWeight: '700' }}>Your Journey Today</Text>
      <Text style={{ color: '#14C8FF', marginTop: 8 }}>HYD → DEL • Flight 6E2412 • Gate 14B</Text>
    </View>
  );
}
