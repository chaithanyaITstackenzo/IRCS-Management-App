import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

const logo = require('@/assets/images/ircs-logo.png');

export function FullScreenLoader() {
  const primary = useThemeColor({}, 'primary');
  const background = useThemeColor({}, 'background');
  return (
    <View style={[styles.wrap, { backgroundColor: background }]}>
      <View style={styles.logoFrame}>
        <Image source={logo} style={styles.logo} resizeMode="contain" />
      </View>
      <ActivityIndicator size="large" color={primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoFrame: { width: 200, height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 16, marginBottom: 24 },
  logo: { width: 176, height: 176 },
});
