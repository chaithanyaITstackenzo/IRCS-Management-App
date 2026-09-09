import { Colors } from '@/constants/colors';
import { useColorScheme } from './use-color-scheme';

export function useThemeColor(
  overrides: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) {
  const theme = useColorScheme() ?? 'light';
  const override = overrides[theme];
  return override ?? Colors[theme][colorName];
}
