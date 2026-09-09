import React from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { canViewPayroll } from '@/utils/permissions';
import { useAuthStore } from '@/store/authStore';

export default function ReportsHomeScreen() {
  const primary = useThemeColor({}, 'primary');
  const { user } = useAuthStore();

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <ReportTile
          icon="today-outline"
          title="Daily Report"
          description="Attendance for a specific day, filterable by employee or department."
          onPress={() => router.push('/(management)/reports/daily')}
          color={primary}
        />
        <ReportTile
          icon="calendar-outline"
          title="Monthly Report"
          description="Monthly attendance summary by employee or department."
          onPress={() => router.push('/(management)/reports/monthly')}
          color={primary}
        />
        {canViewPayroll(user?.role) ? (
          <ReportTile
            icon="cash-outline"
            title="Payroll Report"
            description="Monthly payroll summary based on attendance and salary."
            onPress={() => router.push('/(management)/reports/payroll')}
            color={primary}
          />
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

function ReportTile({
  icon,
  title,
  description,
  onPress,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card style={styles.tile}>
        <Ionicons name={icon} size={24} color={color} />
        <ThemedText variant="h3" style={{ marginTop: Spacing.sm }}>
          {title}
        </ThemedText>
        <ThemedText variant="caption" muted style={{ marginTop: Spacing.xs }}>
          {description}
        </ThemedText>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  tile: { marginBottom: Spacing.md },
});
