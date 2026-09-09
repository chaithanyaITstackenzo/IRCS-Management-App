import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { useAuthStore } from '@/store/authStore';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { canManageOrganization } from '@/utils/permissions';

interface MenuItem {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Parameters<typeof router.push>[0];
}

export default function MoreScreen() {
  const { user, logout } = useAuthStore();
  const [logoutConfirm, setLogoutConfirm] = useState(false);
  const muted = useThemeColor({}, 'textMuted');

  const organizationItems: MenuItem[] = [
    { label: 'Departments', icon: 'business-outline', href: '/(management)/organization/departments' },
    { label: 'Designations', icon: 'ribbon-outline', href: '/(management)/organization/designations' },
    { label: 'Roles', icon: 'shield-checkmark-outline', href: '/(management)/organization/roles' },
    { label: 'Shifts', icon: 'time-outline', href: '/(management)/organization/shifts' },
  ];

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText variant="h1" style={styles.title}>
          More
        </ThemedText>

        <Card style={styles.profileCard}>
          <ThemedText variant="bodyStrong">{user?.role.replace('_', ' ')}</ThemedText>
          <ThemedText variant="caption" muted>
            Signed in
          </ThemedText>
        </Card>

        {canManageOrganization(user?.role) ? <MenuSection title="Organization" items={organizationItems} /> : null}

        <Pressable onPress={() => setLogoutConfirm(true)} style={styles.logoutRow}>
          <Ionicons name="log-out-outline" size={20} color={muted} />
          <ThemedText variant="bodyStrong" style={{ marginLeft: Spacing.sm }}>
            Log Out
          </ThemedText>
        </Pressable>
      </ScrollView>

      <ConfirmDialog
        visible={logoutConfirm}
        title="Log Out?"
        description="You'll need to sign in again to access the Management App."
        confirmLabel="Log Out"
        confirmingLabel="Logging out..."
        destructive
        onConfirm={() => logout()}
        onCancel={() => setLogoutConfirm(false)}
      />
    </ThemedView>
  );
}

function MenuSection({ title, items }: { title: string; items: MenuItem[] }) {
  const muted = useThemeColor({}, 'textMuted');
  return (
    <View style={styles.section}>
      <ThemedText variant="captionStrong" muted style={styles.sectionTitle}>
        {title.toUpperCase()}
      </ThemedText>
      <Card style={{ padding: 0 }}>
        {items.map((item, index) => (
          <Pressable
            key={item.label}
            onPress={() => router.push(item.href)}
            style={[styles.menuRow, index < items.length - 1 && styles.menuRowBorder]}
          >
            <Ionicons name={item.icon} size={20} color={muted} />
            <ThemedText variant="body" style={{ flex: 1, marginLeft: Spacing.md }}>
              {item.label}
            </ThemedText>
            <Ionicons name="chevron-forward" size={18} color={muted} />
          </Pressable>
        ))}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl },
  title: { marginBottom: Spacing.lg },
  profileCard: { marginBottom: Spacing.xl },
  section: { marginBottom: Spacing.xl },
  sectionTitle: { marginBottom: Spacing.sm, marginLeft: Spacing.xs },
  menuRow: { flexDirection: 'row', alignItems: 'center', padding: Spacing.lg },
  menuRowBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(128,128,128,0.2)' },
  logoutRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: Spacing.lg, marginTop: Spacing.md },
});
