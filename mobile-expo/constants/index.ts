export const COLORS = {
  background: '#06121F',
  surface: '#0E1B2D',
  elevated: '#13243B',
  primary: '#2F80FF',
  accent: '#14C8FF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#1E293B',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 18,
  card: 24,
  pill: 999,
};

export const TYPOGRAPHY = {
  h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h2: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h3: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 14, fontWeight: '500' as const, lineHeight: 20 },
  sm: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  xs: { fontSize: 10, fontWeight: '400' as const, lineHeight: 14 },
};

export const TOUCH_SIZE = {
  minHeight: 48,
  minWidth: 48,
};

export const ANIMATIONS = {
  duration: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
};
