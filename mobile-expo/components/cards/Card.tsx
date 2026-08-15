import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../constants';

interface CardProps {
  children: React.ReactNode;
  variant?: 'surface' | 'elevated';
  style?: ViewStyle;
  onPress?: () => void;
}

export default function Card({ children, variant = 'surface', style, onPress }: CardProps) {
  const containerStyle = variant === 'elevated' ? styles.elevated : styles.surface;

  return (
    <View style={[containerStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    borderColor: COLORS.border,
    borderWidth: 1,
  },
  elevated: {
    backgroundColor: COLORS.elevated,
    borderRadius: RADIUS.card,
    padding: SPACING.lg,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
