import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Spacing } from '@/constants/spacing';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <ThemedView style={styles.wrap}>
        <ThemedText variant="h2">This screen doesn&apos;t exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText variant="bodyStrong">Go to home screen</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  link: { marginTop: Spacing.md },
});
