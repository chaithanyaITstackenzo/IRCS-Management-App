import { notificationsApi } from './axios';
import { Notification } from '@/types/managementRequests';
import { MOCK_AUTH_ENABLED } from '@/constants/api';

export interface NotificationResponse { success: boolean; notifications: Notification[] }

export async function listNotifications(): Promise<Notification[]> {
  if (MOCK_AUTH_ENABLED) return [];
  const { data } = await notificationsApi.get<NotificationResponse>('/getNotifications');
  return data.notifications;
}

export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  if (!notificationId) return false;

  const attempts: Array<{ method: 'patch' | 'put'; url: string; data?: Record<string, string> }> = [
    { method: 'patch', url: `/read/${notificationId}` },
    { method: 'put', url: `/read/${notificationId}` },
    { method: 'patch', url: '/markRead', data: { notificationId, id: notificationId, notification_id: notificationId } },
    { method: 'put', url: '/markRead', data: { notificationId, id: notificationId, notification_id: notificationId } },
    { method: 'patch', url: '/read', data: { notificationId, id: notificationId, notification_id: notificationId } },
    { method: 'put', url: '/read', data: { notificationId, id: notificationId, notification_id: notificationId } },
  ];

  let lastError: unknown;

  for (const attempt of attempts) {
    try {
      await notificationsApi.request({
        method: attempt.method,
        url: attempt.url,
        ...(attempt.data ? { data: attempt.data } : {}),
      });
      return true;
    } catch (error) {
      lastError = error;
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status !== 404 && status !== 405) {
        throw error;
      }
    }
  }

  console.warn('[notifications] read-status route was not available; local state will still be updated when supported by backend.', lastError);
  return false;
}
