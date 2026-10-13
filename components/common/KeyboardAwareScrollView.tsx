import React from 'react';
import { StyleSheet, ScrollViewProps } from 'react-native';
import { KeyboardAwareScrollView as ControllerKeyboardAwareScrollView } from 'react-native-keyboard-controller';

type Props = ScrollViewProps;

export function KeyboardAwareScrollView({ style, ...scrollViewProps }: Props) {
  return (
    <ControllerKeyboardAwareScrollView
      bottomOffset={24}
      keyboardShouldPersistTaps="handled"
      style={[styles.flex, style]}
      {...scrollViewProps}
    />
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});