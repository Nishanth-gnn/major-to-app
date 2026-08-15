import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function FAB({ onPress }: { onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} accessibilityLabel="AI Concierge">
      <Text style={styles.text}>AI</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2F80FF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6
  },
  text: {
    color: '#fff',
    fontWeight: '700'
  }
});
