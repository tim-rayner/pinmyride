import React from 'react';
import { Stack } from 'expo-router';

export default function MainApp() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
