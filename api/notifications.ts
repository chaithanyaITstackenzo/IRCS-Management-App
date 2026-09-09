import { notificationsApi } from './axios';
import { Notification } from '@/types/managementRequests';
import { MOCK_AUTH_ENABLED } from '@/constants/api';

export interface NotificationResponse { success: boolean; notifications: Notification[] }

export async function listNotifications(): Promise<Notification[]> {
  if (MOCK_AUTH_ENABLED) return [];
  const { data } = await notificationsApi.get<NotificationResponse>('/getNotifications');
  return data.notifications;
}
