import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Typography } from '@/constants/typography';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: keyof typeof Typography;
  muted?: boolean;
};

export function ThemedText({ style, lightColor, darkColor, variant = 'body', muted, ...rest }: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, muted ? 'textMuted' : 'text');
  return <Text style={[{ color }, Typography[variant], style]} {...rest} />;
}

export const styles = StyleSheet.create({});
