import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ManagementTabsLayout() {
  const active = useThemeColor({}, 'tabIconSelected');
  const inactive = useThemeColor({}, 'tabIconDefault');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: active,
          tabBarInactiveTintColor: inactive,
          tabBarStyle: { backgroundColor: surface, borderTopColor: border },
        }}
      >
      <Tabs.Screen
        name="dashboard/index"
        options={{ title: 'Dashboard', tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="employees/index"
        options={{ title: 'Employees', tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="attendance/today"
        options={{ title: 'Attendance', tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="requests/index"
        options={{ title: 'Requests', tabBarIcon: ({ color, size }) => <Ionicons name="document-text-outline" color={color} size={size} /> }}
      />
      <Tabs.Screen
        name="more/index"
        options={{ title: 'More', tabBarIcon: ({ color, size }) => <Ionicons name="ellipsis-horizontal-circle-outline" color={color} size={size} /> }}
      />
    </Tabs>
    </View>
  );
}
