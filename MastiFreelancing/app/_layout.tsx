import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import { setupErrorLogging } from '../utils/errorLogger';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  useEffect(() => {
    setupErrorLogging();
  }, []);

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'default',
          }}
        />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}