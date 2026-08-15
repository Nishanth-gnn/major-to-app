export const Colors = {
  background: '#06121F',
  surface: '#0E1B2D',
  elevated: '#13243B',
  surfaceDeep: '#071326',

  primary: '#2F80FF',
  primaryDark: '#1E6DFF',
  accent: '#14C8FF',
  accentDark: '#00B4E8',

  success: '#22C55E',
  successMuted: 'rgba(34,197,94,0.2)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245,158,11,0.2)',
  danger: '#EF4444',
  dangerMuted: 'rgba(239,68,68,0.2)',
  info: '#3B82F6',

  text: '#F8FAFC',
  textMuted: '#94A3B8',
  textSubtle: '#64748B',

  border: 'rgba(255,255,255,0.10)',
  borderLight: 'rgba(255,255,255,0.05)',
  borderPrimary: 'rgba(47,128,255,0.40)',
  borderAccent: 'rgba(20,200,255,0.30)',

  glass: 'rgba(255,255,255,0.04)',
  glassHover: 'rgba(255,255,255,0.08)',

  gradientPrimary: ['#2F80FF', '#14C8FF'] as [string, string],
  gradientSurface: ['#0E1B2D', '#13243B'] as [string, string],
  gradientDanger: ['#EF4444', '#DC2626'] as [string, string],
  gradientSuccess: ['#22C55E', '#16A34A'] as [string, string],
  gradientDark: ['#06121F', '#071326'] as [string, string],
  gradientCard: ['#13243B', '#0E1B2D'] as [string, string],

  metro: '#2F80FF',
  bus: '#22C55E',
  cab: '#F59E0B',
  walk: '#14C8FF',
  emerald: '#10B981',
  purple: '#8B5CF6',
  rose: '#F43F5E',
} as const;

export type ColorKey = keyof typeof Colors;
