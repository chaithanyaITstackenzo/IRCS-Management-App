import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import {
  useCreateSpeaker,
  useSetSpeakerStatus,
  useSpeaker,
  useTestSpeaker,
  useUpdateSpeaker,
} from '@/hooks/useSpeakers';
import { useCameras } from '@/hooks/useCameras';
import { CAMERA_SPEAKER_STATUS } from '@/constants/status';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';
import { SpeakerPayload } from '@/types/speaker';
import { getReadableErrorMessage } from '@/utils/errorMessages';

const EMPTY_FORM: SpeakerPayload = { name: '', speaker_code: '', camera_id: '', ip_address: '', location: '' };

// Camera options always come from the cameras API — never hardcoded (spec §32).
export default function SpeakerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const { data: speaker, isLoading, isError, error, refetch } = useSpeaker(isNew ? '' : id);
  const cameras = useCameras();
  const createSpeaker = useCreateSpeaker();
  const updateSpeaker = useUpdateSpeaker(isNew ? '' : id);
  const setStatus = useSetSpeakerStatus();
  const testSpeaker = useTestSpeaker();

  const [editing, setEditing] = useState(isNew);
  const [form, setForm] = useState<SpeakerPayload>(EMPTY_FORM);
  const [statusConfirm, setStatusConfirm] = useState(false);

  useEffect(() => {
    if (speaker) {
      setForm({
        name: speaker.name,
        speaker_code: speaker.speaker_code,
        camera_id: speaker.camera_id,
        ip_address: speaker.ip_address,
        location: speaker.location,
      });
    }
  }, [speaker]);

  if (!isNew && isLoading) return <LoadingSkeleton rows={6} />;
  if (!isNew && (isError || !speaker)) return <ErrorState error={error} onRetry={refetch} />;

  const isSubmitting = createSpeaker.isPending || updateSpeaker.isPending;

  const handleSave = () => {
    if (!form.name.trim() || !form.speaker_code.trim() || !form.camera_id) {
      Toast.show({ type: 'error', text1: 'Please fill in the required speaker details, including a camera.' });
      return;
    }

    const onSuccess = (result: { id: string }) => {
      Toast.show({ type: 'success', text1: `Speaker ${isNew ? 'created' : 'updated'} successfully` });
      setEditing(false);
      if (isNew) router.replace(`/(management)/infrastructure/speaker/${result.id}`);
    };
    const onError = (err: unknown) =>
      Toast.show({ type: 'error', text1: 'Unable to save speaker', text2: getReadableErrorMessage(err) });

    if (isNew) {
      createSpeaker.mutate(form, { onSuccess, onError });
    } else {
      updateSpeaker.mutate(form, { onSuccess: () => onSuccess({ id }), onError });
    }
  };

  const handleTest = () => {
    if (isNew) return;
    testSpeaker.mutate(id, {
      onSuccess: (result) => {
        Toast.show({
          type: result.success ? 'success' : 'error',
          text1: result.success ? 'Speaker test successful' : 'Speaker test failed',
          text2: result.message,
        });
      },
      onError: (err) => Toast.show({ type: 'error', text1: 'Unable to test speaker', text2: getReadableErrorMessage(err) }),
    });
  };

  const handleToggleStatus = () => {
    if (isNew || !speaker) return;
    setStatus.mutate(
      { id: speaker.id, status: !speaker.status },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: `Speaker ${!speaker.status ? 'enabled' : 'disabled'}` });
          setStatusConfirm(false);
        },
        onError: (err) => {
          Toast.show({ type: 'error', text1: 'Unable to update status', text2: getReadableErrorMessage(err) });
          setStatusConfirm(false);
        },
      }
    );
  };

  return (
    <ThemedView style={styles.flex}>
      <KeyboardAwareScrollView contentContainerStyle={styles.content}>
        {!isNew && speaker ? (
          <View style={styles.statusRow}>
            <StatusBadge meta={CAMERA_SPEAKER_STATUS[String(speaker.status) as 'true' | 'false']} />
            <Button
              label={speaker.status ? 'Disable' : 'Enable'}
              variant="secondary"
              onPress={() => setStatusConfirm(true)}
            />
          </View>
        ) : null}

        {editing ? (
          <>
            <Input label="Speaker Name" required value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} />
            <Input
              label="Speaker Code"
              required
              autoCapitalize="characters"
              placeholder="SPK007"
              value={form.speaker_code}
              onChangeText={(t) => setForm((f) => ({ ...f, speaker_code: t }))}
            />
            <Select
              label="Camera"
              required
              loading={cameras.isLoading}
              options={(cameras.data ?? []).map((c) => ({ label: `${c.name} (${c.camera_code})`, value: c.id }))}
              value={form.camera_id}
              onChange={(v) => setForm((f) => ({ ...f, camera_id: v }))}
            />
            <Input
              label="IP Address"
              placeholder="192.168.1.60"
              value={form.ip_address}
              onChangeText={(t) => setForm((f) => ({ ...f, ip_address: t }))}
            />
            <Input label="Location" value={form.location} onChangeText={(t) => setForm((f) => ({ ...f, location: t }))} />

            <Button
              label={isNew ? 'Create Speaker' : 'Save Changes'}
              loadingLabel="Saving..."
              loading={isSubmitting}
              onPress={handleSave}
              style={styles.action}
            />
            {!isNew ? (
              <Button label="Cancel" variant="secondary" onPress={() => setEditing(false)} style={styles.action} disabled={isSubmitting} />
            ) : null}
          </>
        ) : (
          speaker && (
            <>
              <ThemedText variant="h2">{speaker.name}</ThemedText>
              <Row label="Code" value={speaker.speaker_code} />
              <Row label="Camera" value={speaker.camera?.name ?? '—'} />
              <Row label="IP Address" value={speaker.ip_address || '—'} />
              <Row label="Location" value={speaker.location || '—'} />

              <Button
                label="Test Speaker"
                loadingLabel="Testing..."
                loading={testSpeaker.isPending}
                variant="secondary"
                onPress={handleTest}
                style={styles.action}
              />
              <Button label="Edit Speaker" onPress={() => setEditing(true)} style={styles.action} />
            </>
          )
        )}
      </KeyboardAwareScrollView>

      <ConfirmDialog
        visible={statusConfirm}
        title={speaker?.status ? 'Disable Speaker?' : 'Enable Speaker?'}
        confirmLabel={speaker?.status ? 'Disable' : 'Enable'}
        confirmingLabel="Saving..."
        destructive={!!speaker?.status}
        loading={setStatus.isPending}
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusConfirm(false)}
      />
    </ThemedView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText variant="body" muted>
        {label}
      </ThemedText>
      <ThemedText variant="bodyStrong">{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.xs },
  action: { marginTop: Spacing.sm },
});
