import { Platform, TextStyle } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const Typography: Record<string, TextStyle> = {
  displayXL: {
    fontFamily,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 42,
  },
  displayLG: {
    fontFamily,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
  },
  h1: {
    fontFamily,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 30,
  },
  h2: {
    fontFamily,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 26,
  },
  h3: {
    fontFamily,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.1,
    lineHeight: 22,
  },
  body: {
    fontFamily,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySM: {
    fontFamily,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  label: {
    fontFamily,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
};
