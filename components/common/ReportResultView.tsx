import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Spacing } from '@/constants/spacing';
import { ReportRequestResult } from '@/types/report';
import { shareDownloadedReport } from '@/services/reportDownload';

// Renders whatever the backend actually returned — file or JSON — instead of
// assuming a fixed format (spec §35/§97).
export function ReportResultView({ result }: { result: ReportRequestResult }) {
  if (result.localFileUri) {
    return (
      <Card style={styles.card}>
        <ThemedText variant="bodyStrong">Report ready</ThemedText>
        <ThemedText variant="caption" muted style={{ marginTop: Spacing.xs }}>
          {result.contentType}
        </ThemedText>
        <Button
          label="View / Share"
          style={{ marginTop: Spacing.md }}
          onPress={() => shareDownloadedReport(result.localFileUri!)}
        />
      </Card>
    );
  }

  if (result.json) {
    return (
      <Card style={styles.card}>
        <ThemedText variant="bodyStrong" style={{ marginBottom: Spacing.sm }}>
          Report Data
        </ThemedText>
        <ThemedText variant="caption" muted style={{ fontFamily: 'monospace' }}>
          {JSON.stringify(result.json, null, 2)}
        </ThemedText>
      </Card>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  card: { marginTop: Spacing.lg },
});
