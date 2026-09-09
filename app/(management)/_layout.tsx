import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

// All screens outside of (tabs) push over the tab bar with a native header +
// back button, which is the standard Expo Router pattern for a tabs+stack
// "management" navigation (spec §57): don't cram 15+ items into a tab bar.
export default function ManagementLayout() {
  const background = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const text = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: surface },
        headerTintColor: text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: background },
        headerBackTitle: '',
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      <Stack.Screen name="employees/add" options={{ title: 'Add Employee' }} />
      <Stack.Screen name="employees/verify" options={{ title: 'Verify Employee' }} />
      <Stack.Screen name="employees/[id]" options={{ title: 'Employee' }} />
      <Stack.Screen name="employees/edit/[id]" options={{ title: 'Edit Employee' }} />
      <Stack.Screen name="employees/enrollment/[id]" options={{ title: 'Face Enrollment' }} />

      <Stack.Screen name="attendance/history" options={{ title: 'Attendance History' }} />
      <Stack.Screen name="attendance/[id]" options={{ title: 'Attendance Details' }} />

      <Stack.Screen name="requests/[id]" options={{ title: 'Request Details' }} />

      <Stack.Screen name="organization/departments" options={{ title: 'Departments' }} />
      <Stack.Screen name="organization/designations" options={{ title: 'Designations' }} />
      <Stack.Screen name="organization/roles" options={{ title: 'Roles' }} />
      <Stack.Screen name="organization/shifts" options={{ title: 'Shifts' }} />

      <Stack.Screen name="infrastructure/cameras" options={{ title: 'Cameras' }} />
      <Stack.Screen name="infrastructure/camera/[id]" options={{ title: 'Camera' }} />
      <Stack.Screen name="infrastructure/speakers" options={{ title: 'Speakers' }} />
      <Stack.Screen name="infrastructure/speaker/[id]" options={{ title: 'Speaker' }} />

      <Stack.Screen name="reports/index" options={{ title: 'Reports' }} />
      <Stack.Screen name="reports/daily" options={{ title: 'Daily Report' }} />
      <Stack.Screen name="reports/monthly" options={{ title: 'Monthly Report' }} />
      <Stack.Screen name="reports/payroll" options={{ title: 'Payroll Report' }} />
    </Stack>
  );
}
