/**
 * Centralized color tokens for the IRCS Management App.
 * Never hardcode hex values inside screens/components — import from here.
 */
import { Platform } from 'react-native';

const palette = {
  blue600: '#1D4ED8',
  blue700: '#1E40AF',
  blue50: '#EFF6FF',
  slate900: '#0F172A',
  slate700: '#334155',
  slate500: '#64748B',
  slate300: '#CBD5E1',
  slate200: '#E2E8F0',
  slate100: '#F1F5F9',
  slate50: '#F8FAFC',
  white: '#FFFFFF',
  green600: '#16A34A',
  green50: '#F0FDF4',
  amber600: '#D97706',
  amber50: '#FFFBEB',
  red600: '#DC2626',
  red50: '#FEF2F2',
  purple600: '#7C3AED',
  purple50: '#F5F3FF',
};

export const Colors = {
  light: {
    text: palette.slate900,
    textMuted: palette.slate500,
    background: palette.slate50,
    surface: palette.white,
    border: palette.slate200,
    primary: palette.blue600,
    primaryMuted: palette.blue50,
    tint: palette.blue600,
    icon: palette.slate500,
    tabIconDefault: palette.slate500,
    tabIconSelected: palette.blue600,
    success: palette.green600,
    successMuted: palette.green50,
    warning: palette.amber600,
    warningMuted: palette.amber50,
    error: palette.red600,
    errorMuted: palette.red50,
    info: palette.purple600,
    infoMuted: palette.purple50,
  },
  dark: {
    text: '#ECEDEE',
    textMuted: '#9BA1A6',
    background: '#0B1220',
    surface: '#151C2C',
    border: '#26314A',
    primary: '#3B82F6',
    primaryMuted: '#132038',
    tint: '#3B82F6',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#3B82F6',
    success: '#22C55E',
    successMuted: '#0F2416',
    warning: '#F59E0B',
    warningMuted: '#2A1F0B',
    error: '#EF4444',
    errorMuted: '#2A1212',
    info: '#A78BFA',
    infoMuted: '#221B36',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    rounded: "'SF Pro Rounded', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, monospace",
  },
});
