import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { useCamera, useCreateCamera, useSetCameraStatus, useTestCamera, useUpdateCamera } from '@/hooks/useCameras';
import { CAMERA_SPEAKER_STATUS } from '@/constants/status';
import { Spacing } from '@/constants/spacing';
import { KeyboardAwareScrollView } from '@/components/common/KeyboardAwareScrollView';
import { CameraPayload } from '@/types/camera';
import { getReadableErrorMessage } from '@/utils/errorMessages';

const EMPTY_FORM: CameraPayload = {
  name: '',
  camera_code: '',
  ip_address: '',
  rtsp_url: '',
  username: '',
  password: '',
  location: '',
};

export default function CameraDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isNew = id === 'new';

  const { data: camera, isLoading, isError, error, refetch } = useCamera(isNew ? '' : id);
  const createCamera = useCreateCamera();
  const updateCamera = useUpdateCamera(isNew ? '' : id);
  const setStatus = useSetCameraStatus();
  const testCamera = useTestCamera();

  const [editing, setEditing] = useState(isNew);
  const [form, setForm] = useState<CameraPayload>(EMPTY_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [statusConfirm, setStatusConfirm] = useState(false);

  useEffect(() => {
    if (camera) {
      setForm({
        name: camera.name,
        camera_code: camera.camera_code,
        ip_address: camera.ip_address,
        rtsp_url: camera.rtsp_url,
        username: camera.username,
        password: '',
        location: camera.location,
      });
    }
  }, [camera]);

  if (!isNew && isLoading) return <LoadingSkeleton rows={6} />;
  if (!isNew && (isError || !camera)) return <ErrorState error={error} onRetry={refetch} />;

  const isSubmitting = createCamera.isPending || updateCamera.isPending;

  const handleSave = () => {
    if (!form.name.trim() || !form.camera_code.trim() || !form.ip_address.trim()) {
      Toast.show({ type: 'error', text1: 'Please fill in the required camera details.' });
      return;
    }

    const onSuccess = (result: { id: string }) => {
      Toast.show({ type: 'success', text1: `Camera ${isNew ? 'created' : 'updated'} successfully` });
      setEditing(false);
      if (isNew) router.replace(`/(management)/infrastructure/camera/${result.id}`);
    };
    const onError = (err: unknown) =>
      Toast.show({ type: 'error', text1: 'Unable to save camera', text2: getReadableErrorMessage(err) });

    if (isNew) {
      createCamera.mutate(form, { onSuccess, onError });
    } else {
      updateCamera.mutate(form, { onSuccess: () => onSuccess({ id }), onError });
    }
  };

  const handleTest = () => {
    if (isNew) return;
    testCamera.mutate(id, {
      onSuccess: (result) => {
        Toast.show({
          type: result.success ? 'success' : 'error',
          text1: result.success ? 'Camera test successful' : 'Camera test failed',
          text2: result.message,
        });
      },
      onError: (err) => Toast.show({ type: 'error', text1: 'Unable to test camera', text2: getReadableErrorMessage(err) }),
    });
  };

  const handleToggleStatus = () => {
    if (isNew || !camera) return;
    setStatus.mutate(
      { id: camera.id, status: !camera.status },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: `Camera ${!camera.status ? 'enabled' : 'disabled'}` });
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
        {!isNew && camera ? (
          <View style={styles.statusRow}>
            <StatusBadge meta={CAMERA_SPEAKER_STATUS[String(camera.status) as 'true' | 'false']} />
            <Button
              label={camera.status ? 'Disable' : 'Enable'}
              variant="secondary"
              onPress={() => setStatusConfirm(true)}
            />
          </View>
        ) : null}

        {editing ? (
          <>
            <Input label="Camera Name" required value={form.name} onChangeText={(t) => setForm((f) => ({ ...f, name: t }))} />
            <Input
              label="Camera Code"
              required
              autoCapitalize="characters"
              placeholder="CAM007"
              value={form.camera_code}
              onChangeText={(t) => setForm((f) => ({ ...f, camera_code: t }))}
            />
            <Input
              label="IP Address"
              required
              placeholder="192.168.1.50"
              value={form.ip_address}
              onChangeText={(t) => setForm((f) => ({ ...f, ip_address: t }))}
            />
            <Input
              label="RTSP URL"
              placeholder="rtsp://..."
              autoCapitalize="none"
              value={form.rtsp_url}
              onChangeText={(t) => setForm((f) => ({ ...f, rtsp_url: t }))}
            />
            <Input label="Username" value={form.username} onChangeText={(t) => setForm((f) => ({ ...f, username: t }))} />
            <Input
              label="Password"
              secureTextEntry={!showPassword}
              value={form.password}
              onChangeText={(t) => setForm((f) => ({ ...f, password: t }))}
              placeholder={isNew ? undefined : 'Leave blank to keep current password'}
            />
            <Button
              label={showPassword ? 'Hide password' : 'Show password'}
              variant="ghost"
              onPress={() => setShowPassword((v) => !v)}
              style={styles.showPasswordBtn}
            />
            <Input label="Location" value={form.location} onChangeText={(t) => setForm((f) => ({ ...f, location: t }))} />

            <Button
              label={isNew ? 'Create Camera' : 'Save Changes'}
              loadingLabel="Saving..."
              loading={isSubmitting}
              onPress={handleSave}
              style={styles.action}
            />
            {!isNew ? (
              <Button
                label="Cancel"
                variant="secondary"
                onPress={() => setEditing(false)}
                style={styles.action}
                disabled={isSubmitting}
              />
            ) : null}
          </>
        ) : (
          camera && (
            <>
              <ThemedText variant="h2">{camera.name}</ThemedText>
              <Row label="Code" value={camera.camera_code} />
              <Row label="IP Address" value={camera.ip_address} />
              <Row label="Location" value={camera.location || '—'} />
              <Row label="Username" value={camera.username || '—'} />
              <Row label="Password" value="•••••••• (hidden)" />

              <Button
                label="Test Connection"
                loadingLabel="Testing..."
                loading={testCamera.isPending}
                variant="secondary"
                onPress={handleTest}
                style={styles.action}
              />
              <Button label="Edit Camera" onPress={() => setEditing(true)} style={styles.action} />
            </>
          )
        )}
      </KeyboardAwareScrollView>

      <ConfirmDialog
        visible={statusConfirm}
        title={camera?.status ? 'Disable Camera?' : 'Enable Camera?'}
        confirmLabel={camera?.status ? 'Disable' : 'Enable'}
        confirmingLabel="Saving..."
        destructive={!!camera?.status}
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
  showPasswordBtn: { alignSelf: 'flex-start', minHeight: 32, paddingHorizontal: 0, marginTop: -Spacing.md, marginBottom: Spacing.sm },
  action: { marginTop: Spacing.sm },
});
