import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Button } from '../ui/Button';
import { Spacing } from '@/constants/spacing';

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
}

// App-level error boundary (spec §67): never leave the user on a blank screen
// or expose a stack trace.
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    if (__DEV__) {
      console.error('Unhandled render error:', error);
    }
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.wrap}>
          <ThemedText variant="h3">Something went wrong.</ThemedText>
          <Button label="Try Again" onPress={this.reset} style={styles.action} />
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl },
  action: { marginTop: Spacing.lg, minWidth: 160 },
});
