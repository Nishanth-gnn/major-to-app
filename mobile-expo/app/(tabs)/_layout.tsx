import { Tabs } from 'expo-router';
import { View, Text } from 'react-native';
import { COLORS } from '../../constants';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: -4,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="flights"
        options={{
          title: 'Flights',
          tabBarLabel: 'Flights',
        }}
      />
      <Tabs.Screen
        name="baggage"
        options={{
          title: 'Baggage',
          tabBarLabel: 'Baggage',
        }}
      />
      <Tabs.Screen
        name="transit"
        options={{
          title: 'Transit',
          tabBarLabel: 'Transit',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
