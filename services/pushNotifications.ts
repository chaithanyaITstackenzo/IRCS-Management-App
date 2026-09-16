import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { hrApi } from '@/api/axios';
import { useAuthStore } from '@/store/authStore';
import type * as Notifications from 'expo-notifications';

const EXPO_PUSH_TOKEN_KEY = 'ircs_mgmt_expo_push_token';
const ANDROID_CHANNEL_ID = 'ircs-management-default';

let notificationsModulePromise: Promise<typeof Notifications | null> | null = null;

async function getNotificationsModule(): Promise<typeof Notifications | null> {
  if (Platform.OS === 'web' || (Platform.OS === 'android' && Constants.appOwnership === 'expo')) return null;
  if (!notificationsModulePromise) {
    notificationsModulePromise = import('expo-notifications').then((notifications) => {
      notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });
      return notifications;
    }).catch((error) => {
      console.warn('[notifications] Could not load the native notification module.', error);
      return null;
    });
  }
  return notificationsModulePromise;
}

function getProjectId(): string | undefined {
  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  return typeof projectId === 'string' && projectId.length > 0 ? projectId : undefined;
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web' || !Device.isDevice) return null;

  try {
    const notifications = await getNotificationsModule();
    if (!notifications) return null;

    if (Platform.OS === 'android') {
      await notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
        name: 'IRCS Management',
        importance: notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
      });
    }

    const currentPermissions = await notifications.getPermissionsAsync();
    let finalStatus = currentPermissions.status;
    if (finalStatus !== notifications.PermissionStatus.GRANTED) {
      const requestedPermissions = await notifications.requestPermissionsAsync();
      finalStatus = requestedPermissions.status;
    }

    if (finalStatus !== notifications.PermissionStatus.GRANTED) {
      console.warn('[notifications] Permission was not granted.');
      return null;
    }

    const projectId = getProjectId();
    if (!projectId) {
      console.warn('[notifications] Expo EAS project ID is missing.');
      return null;
    }

    const tokenResponse = await notifications.getExpoPushTokenAsync({ projectId });
    const expoPushToken = tokenResponse.data;
    if (!expoPushToken) {
      console.warn('[notifications] Expo returned an empty push token.');
      return null;
    }

    await storePushToken(expoPushToken);

    const userId = useAuthStore.getState().user?.id;
    if (!userId) {
      console.warn('[notifications] Cannot register a token without an authenticated user.');
      return null;
    }

    await hrApi.put('/expoToken', { userId, expoToken: expoPushToken });
    return expoPushToken;
  } catch (error) {
    console.warn('[notifications] Push notification setup failed.', error);
    return null;
  }
}

export function addNotificationResponseListener(
  handler: (response: Notifications.NotificationResponse) => void,
): () => void {
  let active = true;
  let removeListener: () => void = () => undefined;

  void getNotificationsModule().then((notifications) => {
    if (!active || !notifications) return;
    const subscription = notifications.addNotificationResponseReceivedListener(handler);
    removeListener = () => subscription.remove();
  });

  return () => {
    active = false;
    removeListener();
  };
}

export async function getLastNotificationResponse(): Promise<Notifications.NotificationResponse | null> {
  const notifications = await getNotificationsModule();
  if (!notifications) return null;
  return notifications.getLastNotificationResponseAsync();
}

export async function storePushToken(expoPushToken: string): Promise<void> {
  try {
    await SecureStore.setItemAsync(EXPO_PUSH_TOKEN_KEY, expoPushToken);
  } catch (error) {
    console.warn('[notifications] Could not persist the push token.', error);
  }
}

export function getNotificationData(response: Notifications.NotificationResponse): Record<string, unknown> {
  const data = response.notification.request.content.data;
  return data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
}
