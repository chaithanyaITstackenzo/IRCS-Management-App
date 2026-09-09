import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { canAccessManagementApp } from '@/utils/permissions';

export default function Index() {
  const { token, user } = useAuthStore();

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  if (!canAccessManagementApp(user?.role)) {
    return <Redirect href="/(auth)/access-denied" />;
  }

  return <Redirect href="/(management)/(tabs)/dashboard" />;
}
