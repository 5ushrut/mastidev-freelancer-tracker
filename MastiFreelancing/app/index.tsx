import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { isOnboardingCompleted } from '../utils/storage';
import Button from '../components/Button';

export default function SplashScreen() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const completed = await isOnboardingCompleted();
      setTimeout(() => {
        setLoading(false);
        if (completed) {
          router.replace('/dashboard');
        } else {
          router.replace('/onboarding');
        }
      }, 2000); // Show splash for 2 seconds
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setLoading(false);
      router.replace('/onboarding');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 24,
      borderRadius: 24,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: 32,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: 32,
    },
    loadingContainer: {
      marginTop: 32,
    },
    loadingText: {
      fontSize: 14,
      color: theme.textMuted,
      textAlign: 'center',
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>MF</Text>
        </View>
        <Text style={styles.title}>MastiFreelance</Text>
        <Text style={styles.subtitle}>Professional freelance tracking</Text>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>MF</Text>
      </View>
      <Text style={styles.title}>MastiFreelance</Text>
      <Text style={styles.subtitle}>Professional freelance tracking</Text>
      <Button
        text="Get Started"
        onPress={() => router.replace('/onboarding')}
        style={{ marginTop: 32 }}
      />
    </View>
  );
}