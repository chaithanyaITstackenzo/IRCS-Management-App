import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '@/store/authStore';
import { useManagementStore } from '@/store/managementStore';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { FullScreenLoader } from '@/components/common/FullScreenLoader';
import { canAccessManagementApp } from '@/utils/permissions';
import { useThemeColor } from '@/hooks/use-theme-color';

SplashScreen.preventAutoHideAsync();

const [queryClient] = [
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnReconnect: true,
        staleTime: 1000 * 30,
      },
      mutations: {
        retry: false,
      },
    },
  }),
];

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, 'background');
  const { checkAuth, isAppReady, token, user } = useAuthStore();
  const setOffline = useManagementStore((s) => s.setOffline);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [splashHidden, setSplashHidden] = useState(false);

  useEffect(() => {
    checkAuth();
    // Intentionally run once on mount only — checkAuth reads SecureStore and is stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(state.isConnected === false);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isAppReady || !navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const hasManagementAccess = canAccessManagementApp(user?.role);

    if (!token && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (token && inAuthGroup) {
      router.replace(hasManagementAccess ? '/(management)/(tabs)/dashboard' : '/(auth)/access-denied');
    }

    if (!splashHidden) {
      setSplashHidden(true);
      setTimeout(() => SplashScreen.hideAsync(), 100);
    }
    // router/splashHidden intentionally omitted: this guard should only re-run
    // when auth/segment state changes, not when the router identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAppReady, navigationState?.key, token, segments, user]);

  if (!isAppReady) return <FullScreenLoader />;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SafeAreaProvider>
            <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor }}>
              <Stack>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(management)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ title: 'Not Found' }} />
              </Stack>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} backgroundColor={backgroundColor} />
              <Toast />
            </SafeAreaView>
          </SafeAreaProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
