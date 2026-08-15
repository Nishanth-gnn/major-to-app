import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY, TOUCH_SIZE } from '../../constants';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const variantColors = {
  primary: COLORS.primary,
  secondary: COLORS.surface,
  danger: COLORS.danger,
  success: COLORS.success,
};

const sizeStyles = {
  sm: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
  md: { paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg },
  lg: { paddingVertical: SPACING.lg, paddingHorizontal: SPACING.xl },
};

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  full,
  disabled,
  style,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: variantColors[variant] },
        sizeStyles[size],
        full && styles.full,
        disabled && styles.disabled,
        style,
      ]}
      activeOpacity={0.7}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={[styles.text, { color: variant === 'secondary' ? COLORS.text : '#fff' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: TOUCH_SIZE.minHeight,
    minWidth: TOUCH_SIZE.minWidth,
  },
  full: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...TYPOGRAPHY.caption,
    fontWeight: '600',
  },
});
