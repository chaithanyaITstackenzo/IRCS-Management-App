import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ThemedText } from '@/components/ui/ThemedText';
import { useNotifications } from '@/hooks/useManagementRequests';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';

export function NotificationBellButton() {
  const { data = [] } = useNotifications();
  const text = useThemeColor({}, 'text');
  const primary = useThemeColor({}, 'primary');
  const unreadCount = data.filter((item) => !item.is_read).length;

  return (
    <Pressable onPress={() => router.push('/(management)/notifications')} style={styles.button}>
      <Ionicons name="notifications-outline" size={22} color={text} />
      {unreadCount > 0 ? (
        <View style={[styles.badge, { backgroundColor: primary }]}>
          <ThemedText variant="caption" style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </ThemedText>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 1,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  badgeText: {
    color: '#fff',
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
  },
});
