import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import {
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { uploadEmployeeNameAudio, SpeakerAudioUploadResponse } from '@/api/speakerAudio';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { getReadableErrorMessage } from '@/utils/errorMessages';

interface EmployeeNameAudioProps {
  employeeId?: string;
  required?: boolean;
  onUploadStateChange?: (uploaded: boolean) => void;
}

function formatDuration(milliseconds: number) {
  const seconds = Math.floor(milliseconds / 1000);
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export function EmployeeNameAudio({ employeeId, required = false, onUploadStateChange }: EmployeeNameAudioProps) {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(recorder);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploadResponse, setUploadResponse] = useState<SpeakerAudioUploadResponse | null>(null);
  const player = useAudioPlayer(recordingUri);
  const playerStatus = useAudioPlayerStatus(player);

  useEffect(() => {
    return () => {
      void setAudioModeAsync({ allowsRecording: false });
    };
  }, []);

  const startRecording = async () => {
    setMessage(null);
    setUploadResponse(null);
    onUploadStateChange?.(false);
    const permission = await requestRecordingPermissionsAsync();
    if (!permission.granted) {
      setMessage('Microphone permission is required to record the employee name.');
      return;
    }

    try {
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
      await recorder.prepareToRecordAsync();
      recorder.record();
    } catch (error) {
      setMessage(getReadableErrorMessage(error, 'Unable to start recording. Please try again.'));
    }
  };

  const stopRecording = async () => {
    try {
      await recorder.stop();
      setRecordingUri(recorder.uri);
      await setAudioModeAsync({ allowsRecording: false, playsInSilentMode: true });
      if (!recorder.uri) setMessage('The recording was not created. Please try again.');
    } catch (error) {
      setMessage(getReadableErrorMessage(error, 'Unable to stop recording. Please try again.'));
    }
  };

  const retake = () => {
    player.pause();
    setRecordingUri(null);
    setMessage(null);
    setUploadResponse(null);
    onUploadStateChange?.(false);
  };

  const upload = async () => {
    if (!employeeId) {
      setMessage('Save the employee first so an employee ID is available before uploading audio.');
      return;
    }
    if (!recordingUri) {
      setMessage('Record and preview an employee name before uploading.');
      return;
    }

    setUploading(true);
    setMessage(null);
    setUploadResponse(null);
    onUploadStateChange?.(false);
    try {
      const response = await uploadEmployeeNameAudio(employeeId, recordingUri);
      setUploadResponse(response);
      onUploadStateChange?.(response.success);
      if (!response.success) setMessage(response.message || 'Audio processing failed on the server.');
    } catch (error) {
      setMessage(getReadableErrorMessage(error, 'Audio upload failed. Please try again.'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText variant="captionStrong" muted style={styles.label}>
        EMPLOYEE NAME AUDIO{required ? ' *' : ''}
      </ThemedText>
      <ThemedText variant="body" muted>
        Record the name clearly. The server converts the recording to WAV and sends it to active speakers.
      </ThemedText>

      {recorderState.isRecording ? (
        <View style={styles.recordingStatus}>
          <ActivityIndicator color={Colors.light.error} size="small" />
          <ThemedText variant="bodyStrong">Recording {formatDuration(recorderState.durationMillis)}</ThemedText>
        </View>
      ) : null}

      {!recorderState.isRecording && !recordingUri ? (
        <Button label="Record Employee Name" onPress={() => void startRecording()} style={styles.button} />
      ) : null}

      {recorderState.isRecording ? (
        <Button label="Stop Recording" variant="secondary" onPress={() => void stopRecording()} style={styles.button} />
      ) : null}

      {!recorderState.isRecording && recordingUri ? (
        <View style={styles.actions}>
          <Button
            label={playerStatus.playing ? 'Pause Preview' : 'Play Preview'}
            variant="secondary"
            onPress={() => (playerStatus.playing ? player.pause() : player.play())}
            style={styles.actionButton}
          />
          <Button label="Retake" variant="secondary" onPress={retake} style={styles.actionButton} />
          <Button
            label="Upload Audio"
            loadingLabel="Uploading..."
            loading={uploading}
            disabled={!employeeId}
            onPress={() => void upload()}
            style={styles.button}
          />
        </View>
      ) : null}

      {message ? <ThemedText variant="body" style={styles.error}>{message}</ThemedText> : null}
      {uploadResponse?.success ? (
        <ThemedText variant="body" style={styles.success}>
          {uploadResponse.message} {uploadResponse.successfulUploads} speaker(s) updated, {uploadResponse.failedUploads} failed.
        </ThemedText>
      ) : null}
      {uploadResponse && !uploadResponse.success ? (
        <View>
          <ThemedText variant="body" style={styles.error}>
            Audio processing completed, but {uploadResponse.successfulUploads} speaker(s) updated and {uploadResponse.failedUploads} failed.
          </ThemedText>
          {uploadResponse.results
            .filter((result) => !result.success)
            .map((result) => (
              <ThemedText key={result.speakerId} variant="caption" style={styles.error}>
                {result.speakerCode} ({result.ipAddress ?? 'no IP'}): {result.message}
              </ThemedText>
            ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: Spacing.lg, marginBottom: Spacing.md, gap: Spacing.sm },
  label: { marginBottom: Spacing.xs },
  recordingStatus: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.sm },
  actions: { gap: Spacing.sm },
  button: { marginTop: Spacing.xs },
  actionButton: { flex: 1 },
  error: { color: Colors.light.error },
  success: { color: Colors.light.success },
});