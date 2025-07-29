import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { saveSettings, setOnboardingCompleted, AppSettings } from '../utils/storage';
import Button from '../components/Button';
import Icon from '../components/Icon';

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [settings, setSettings] = useState<AppSettings>({
    currency: 'USD',
    defaultHourlyRate: 50,
    taxRate: 0,
    notifications: true,
    biometricLock: false,
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 16,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    logoText: {
      fontSize: 24,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    form: {
      marginBottom: 40,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
      marginBottom: 16,
    },
    currencyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 16,
    },
    currencyOption: {
      flex: 1,
      minWidth: '45%',
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
    },
    currencyOptionSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    currencySymbol: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    currencySymbolSelected: {
      color: '#FFFFFF',
    },
    currencyCode: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    currencyCodeSelected: {
      color: '#FFFFFF',
    },
    currencyName: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    currencyNameSelected: {
      color: '#FFFFFF',
    },
    buttonContainer: {
      gap: 12,
    },
    stepIndicator: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 32,
      gap: 8,
    },
    stepDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: theme.border,
    },
    stepDotActive: {
      backgroundColor: theme.primary,
    },
  });

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      await saveSettings(settings);
      await setOnboardingCompleted();
      router.replace('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      Alert.alert('Error', 'Failed to save settings. Please try again.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <>
            <View style={styles.header}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>MF</Text>
              </View>
              <Text style={styles.title}>Welcome to MastiFreelance</Text>
              <Text style={styles.subtitle}>
                Track your clients, projects, and income with ease. Let&apos;s get you set up!
              </Text>
            </View>
          </>
        );

      case 1:
        return (
          <>
            <Text style={styles.title}>Choose Your Currency</Text>
            <Text style={styles.subtitle}>
              Select the currency you&apos;ll use for invoicing and tracking income.
            </Text>
            <View style={styles.form}>
              <View style={styles.currencyGrid}>
                {CURRENCIES.map((currency) => (
                  <Button
                    key={currency.code}
                    text=""
                    onPress={() => setSettings({ ...settings, currency: currency.code })}
                    style={[
                      styles.currencyOption,
                      settings.currency === currency.code && styles.currencyOptionSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.currencySymbol,
                        settings.currency === currency.code && styles.currencySymbolSelected,
                      ]}
                    >
                      {currency.symbol}
                    </Text>
                    <Text
                      style={[
                        styles.currencyCode,
                        settings.currency === currency.code && styles.currencyCodeSelected,
                      ]}
                    >
                      {currency.code}
                    </Text>
                    <Text
                      style={[
                        styles.currencyName,
                        settings.currency === currency.code && styles.currencyNameSelected,
                      ]}
                    >
                      {currency.name}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>
          </>
        );

      case 2:
        return (
          <>
            <Text style={styles.title}>Set Your Rates</Text>
            <Text style={styles.subtitle}>
              Configure your default hourly rate and tax rate for invoicing.
            </Text>
            <View style={styles.form}>
              <Text style={styles.label}>Default Hourly Rate</Text>
              <TextInput
                style={styles.input}
                value={settings.defaultHourlyRate.toString()}
                onChangeText={(text) =>
                  setSettings({ ...settings, defaultHourlyRate: parseFloat(text) || 0 })
                }
                keyboardType="numeric"
                placeholder="50"
                placeholderTextColor={theme.textMuted}
              />

              <Text style={styles.label}>Tax Rate (%)</Text>
              <TextInput
                style={styles.input}
                value={settings.taxRate.toString()}
                onChangeText={(text) =>
                  setSettings({ ...settings, taxRate: parseFloat(text) || 0 })
                }
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.textMuted}
              />
            </View>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.stepIndicator}>
          {[0, 1, 2].map((index) => (
            <View
              key={index}
              style={[styles.stepDot, index <= step && styles.stepDotActive]}
            />
          ))}
        </View>

        {renderStep()}

        <View style={styles.buttonContainer}>
          <Button
            text={step === 2 ? 'Complete Setup' : 'Next'}
            onPress={handleNext}
          />
          {step > 0 && (
            <Button
              text="Back"
              onPress={handleBack}
              style={{ backgroundColor: theme.backgroundAlt }}
              textStyle={{ color: theme.text }}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}