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
import { addNotificationResponseListener, getLastNotificationResponse, getNotificationData, registerForPushNotifications, storePushToken } from '@/services/pushNotifications';
import type * as Notifications from 'expo-notifications';

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
    if (!isAppReady || !token || !user?.id) return;

    registerForPushNotifications().then((expoPushToken) => {
      if (expoPushToken) void storePushToken(expoPushToken);
    });
  }, [isAppReady, token, user?.id]);

  useEffect(() => {
    if (!isAppReady || !token || !navigationState?.key) return;

    const openNotificationTarget = (response: Notifications.NotificationResponse) => {
      const data = getNotificationData(response);
      const requestId = data.requestId ?? data.request_id ?? data.attendance_request_id;
      const attendanceId = data.attendanceId ?? data.attendance_id;
      const screen = typeof data.screen === 'string' ? data.screen : '';
      const referenceId = data.referenceId ?? data.reference_id;

      if (requestId !== undefined && requestId !== null) {
        router.push(`/(management)/requests/${String(requestId)}`);
        return;
      }
      if (attendanceId !== undefined && attendanceId !== null) {
        router.push(`/(management)/attendance/${String(attendanceId)}`);
        return;
      }
      if (referenceId !== undefined && referenceId !== null && screen.includes('request')) {
        router.push(`/(management)/requests/${String(referenceId)}`);
        return;
      }
      if (referenceId !== undefined && referenceId !== null && screen.includes('attendance')) {
        router.push(`/(management)/attendance/${String(referenceId)}`);
        return;
      }
      if (referenceId !== undefined && referenceId !== null && screen.includes('speaker')) {
        router.push(`/(management)/infrastructure/speaker/${String(referenceId)}`);
        return;
      }
      if (screen === 'requests' || screen === 'attendance' || screen === 'attendance/history') {
        router.push(screen === 'requests' ? '/(management)/(tabs)/requests' : '/(management)/attendance/history');
        return;
      }
      if (screen === 'speakers' || screen === 'infrastructure/speakers') {
        router.push('/(management)/infrastructure/speakers');
        return;
      }
      if (screen === 'salary' || screen === 'salaries' || screen === 'payroll' || screen === 'reports/payroll') {
        router.push('/(management)/reports/payroll');
      }
    };

    const removeResponseListener = addNotificationResponseListener(openNotificationTarget);
    getLastNotificationResponse()
      .then((response) => {
        if (response) openNotificationTarget(response);
      })
      .catch((error) => console.warn('[notifications] Could not read the last notification response.', error));

    return removeResponseListener;
  }, [isAppReady, navigationState?.key, router, token]);

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
