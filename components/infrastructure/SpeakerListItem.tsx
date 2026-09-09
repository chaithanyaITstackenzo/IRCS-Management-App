import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { StatusBadge } from '../common/StatusBadge';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Radius, Spacing } from '@/constants/spacing';
import { CAMERA_SPEAKER_STATUS } from '@/constants/status';
import { Speaker } from '@/types/speaker';

export function SpeakerListItem({ speaker }: { speaker: Speaker }) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');

  return (
    <Pressable
      onPress={() => router.push(`/(management)/infrastructure/speaker/${speaker.id}`)}
      style={[styles.row, { backgroundColor: surface, borderColor: border }]}
    >
      <View style={[styles.iconWrap, { backgroundColor: `${primary}15` }]}>
        <Ionicons name="volume-high-outline" size={20} color={primary} />
      </View>
      <View style={styles.info}>
        <ThemedText variant="bodyStrong">{speaker.name}</ThemedText>
        <ThemedText variant="caption" muted>
          {speaker.speaker_code} · {speaker.camera?.name ?? 'Unassigned camera'}
        </ThemedText>
      </View>
      <StatusBadge meta={CAMERA_SPEAKER_STATUS[String(speaker.status) as 'true' | 'false']} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: Spacing.sm,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, gap: 2 },
});
