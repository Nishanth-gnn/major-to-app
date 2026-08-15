import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../theme/colors';
import FloatingAIConcierge from '../components/common/FloatingAIConcierge';
import AIConciergeModal from '../components/modals/AIConciergeModal';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <StatusBar style="light" />
          <Stack
            initialRouteName="index"
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="services/emergency/index" options={{ headerShown: false }} />
            <Stack.Screen name="services/meal-delivery/index" options={{ headerShown: false }} />
            <Stack.Screen name="services/translation/index" options={{ headerShown: false }} />
            <Stack.Screen name="services/guardian/index" options={{ headerShown: false }} />
            <Stack.Screen name="transit/track" options={{ headerShown: false }} />
            <Stack.Screen name="boarding-pass/scan" options={{ headerShown: false }} />
          </Stack>
          <FloatingAIConcierge />
          <AIConciergeModal />
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
