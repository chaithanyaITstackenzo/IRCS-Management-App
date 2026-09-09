import React from 'react';
import { KeyboardAvoidingView, KeyboardAvoidingViewProps, Platform, ScrollView, ScrollViewProps, StyleSheet } from 'react-native';

type Props = ScrollViewProps & {
  avoidingViewProps?: Omit<KeyboardAvoidingViewProps, 'behavior' | 'style'>;
};

export function KeyboardAwareScrollView({ avoidingViewProps, style, ...scrollViewProps }: Props) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
      {...avoidingViewProps}
    >
      <ScrollView style={[styles.flex, style]} {...scrollViewProps} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});