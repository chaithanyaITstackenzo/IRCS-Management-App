import React, { useState } from 'react';
import { FlatList, Linking, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { ThemedView } from '@/components/ui/ThemedView';
import { ThemedText } from '@/components/ui/ThemedText';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ErrorState } from '@/components/common/ErrorState';
import { useEmployee } from '@/hooks/useEmployees';
import { useSubmitEnrollment } from '@/hooks/useEnrollment';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing, Radius } from '@/constants/spacing';
import { ENROLLMENT_STATUS } from '@/constants/status';
import { ENROLLMENT_REQUIRED_IMAGE_COUNT } from '@/constants/api';
import { EnrollmentCaptureImage } from '@/types/enrollment';
import { formatEmployeeName } from '@/utils/formatters';
import { getReadableErrorMessage } from '@/utils/errorMessages';

type PermissionState = 'unknown' | 'granted' | 'denied' | 'blocked';

// Full capture → review → submit UI, built and ready to connect the moment
// Thoufiq confirms the enrollment API contract (spec §16/§17/§96). Submission
// currently surfaces a clear "not yet connected" message instead of crashing.
export default function EnrollmentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: employee, isLoading, isError, error, refetch } = useEmployee(id);
  const submitEnrollment = useSubmitEnrollment(id);

  const [images, setImages] = useState<EnrollmentCaptureImage[]>([]);
  const [permission, setPermission] = useState<PermissionState>('unknown');

  const errorColor = useThemeColor({}, 'error');

  const requestPermission = async () => {
    const { status, canAskAgain } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      setPermission('granted');
    } else if (canAskAgain) {
      setPermission('denied');
    } else {
      setPermission('blocked');
    }
  };

  const captureImage = async () => {
    if (permission !== 'granted') {
      await requestPermission();
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });
    if (result.canceled || !result.assets?.[0]) return;

    // Compress/resize before adding to the buffer, without over-degrading recognition quality (spec §16).
    const manipulated = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 960 } }],
      { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
    );

    setImages((prev) =>
      prev.length >= ENROLLMENT_REQUIRED_IMAGE_COUNT
        ? prev
        : [...prev, { localUri: manipulated.uri, width: manipulated.width, height: manipulated.height }]
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    submitEnrollment.mutate(images, {
      onSuccess: () => {
        Toast.show({ type: 'success', text1: 'Enrollment submitted for processing' });
        setImages([]);
      },
      onError: (err) => {
        // Never crash on a failed/partial enrollment (spec §88) — surface a clear message instead.
        Toast.show({
          type: 'error',
          text1: 'Enrollment not submitted',
          text2: getReadableErrorMessage(err, 'Face enrollment is not connected to the backend yet.'),
        });
      },
    });
  };

  if (isLoading) return null;
  if (isError || !employee) return <ErrorState error={error} onRetry={refetch} />;

  const name = formatEmployeeName(employee);
  const enrollmentStatus = employee.enrollment_status ?? 'NOT_STARTED';

  return (
    <ThemedView style={styles.flex}>
      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.summaryCard}>
          <ThemedText variant="h3">{name}</ThemedText>
          <ThemedText variant="caption" muted>
            {employee.employee_code}
          </ThemedText>
          <View style={styles.summaryRow}>
            <ThemedText variant="body" muted>
              Current status
            </ThemedText>
            <StatusBadge meta={ENROLLMENT_STATUS[enrollmentStatus]} />
          </View>
        </Card>

        <Card style={styles.section}>
          <ThemedText variant="h3" style={{ marginBottom: Spacing.sm }}>
            Enrollment Instructions
          </ThemedText>
          <ThemedText variant="body" muted>
            Capture {ENROLLMENT_REQUIRED_IMAGE_COUNT} clear photos of the employee&apos;s face from slightly different
            angles and lighting. Avoid glasses glare and heavy shadows where possible.
          </ThemedText>
        </Card>

        <Card style={styles.section}>
          <View style={styles.summaryRow}>
            <ThemedText variant="h3">Capture Images</ThemedText>
            <ThemedText variant="bodyStrong">
              {images.length} / {ENROLLMENT_REQUIRED_IMAGE_COUNT}
            </ThemedText>
          </View>

          {permission === 'blocked' ? (
            <View style={styles.permissionBox}>
              <ThemedText variant="body" muted style={{ marginBottom: Spacing.sm }}>
                Camera access is blocked. Enable it in system settings to continue enrollment.
              </ThemedText>
              <Button
                label="Open Settings"
                variant="secondary"
                onPress={() => (Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings())}
              />
            </View>
          ) : (
            <Button
              label={images.length >= ENROLLMENT_REQUIRED_IMAGE_COUNT ? 'All images captured' : 'Capture Image'}
              onPress={captureImage}
              disabled={images.length >= ENROLLMENT_REQUIRED_IMAGE_COUNT}
              style={{ marginTop: Spacing.md }}
            />
          )}

          {images.length > 0 ? (
            <FlatList
              data={images}
              keyExtractor={(_, i) => String(i)}
              numColumns={4}
              scrollEnabled={false}
              style={{ marginTop: Spacing.lg }}
              renderItem={({ item, index }) => (
                <View style={styles.thumbWrap}>
                  <Image source={{ uri: item.localUri }} style={styles.thumb} />
                  <Pressable style={styles.thumbDelete} onPress={() => removeImage(index)} hitSlop={6}>
                    <Ionicons name="close-circle" size={18} color={errorColor} />
                  </Pressable>
                </View>
              )}
            />
          ) : null}
        </Card>

        <Button
          label={`Submit ${images.length} / ${ENROLLMENT_REQUIRED_IMAGE_COUNT} Images`}
          loadingLabel="Submitting..."
          loading={submitEnrollment.isPending}
          disabled={images.length < ENROLLMENT_REQUIRED_IMAGE_COUNT}
          onPress={handleSubmit}
          style={styles.submit}
        />
        {images.length < ENROLLMENT_REQUIRED_IMAGE_COUNT ? (
          <ThemedText variant="caption" muted style={styles.submitHint}>
            Capture all {ENROLLMENT_REQUIRED_IMAGE_COUNT} images before submitting — partial sets are not accepted.
          </ThemedText>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: Spacing.xl, paddingBottom: Spacing.xxxl, gap: Spacing.lg },
  summaryCard: { gap: Spacing.xs },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: Spacing.sm },
  section: {},
  permissionBox: { marginTop: Spacing.md },
  thumbWrap: { width: '25%', padding: 4 },
  thumb: { width: '100%', aspectRatio: 1, borderRadius: Radius.sm },
  thumbDelete: { position: 'absolute', top: 0, right: 0, backgroundColor: '#fff', borderRadius: 10 },
  submit: { marginTop: Spacing.md },
  submitHint: { textAlign: 'center', marginTop: Spacing.sm },
});
