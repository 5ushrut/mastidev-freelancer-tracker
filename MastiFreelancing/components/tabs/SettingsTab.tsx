import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { loadSettings, saveSettings, AppSettings } from '../../utils/storage';
import { Picker } from '@react-native-picker/picker';
import * as LocalAuthentication from 'expo-local-authentication';
import Icon from '../Icon';
import Button from '../Button';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
];

export default function SettingsTab() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [tempSettings, setTempSettings] = useState<AppSettings | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    loadSettingsData();
    checkBiometricSupport();
  }, []);

  const loadSettingsData = async () => {
    try {
      const settingsData = await loadSettings();
      setSettings(settingsData);
      setTempSettings(settingsData);
      console.log('Loaded settings:', settingsData);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const checkBiometricSupport = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      if (hasHardware && supportedTypes.length > 0) {
        if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID');
        } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Fingerprint');
        } else {
          setBiometricType('Biometric');
        }
      }
      console.log('Biometric support:', biometricType);
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: 20,
      paddingTop: 60,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
    },
    content: {
      flex: 1,
    },
    section: {
      marginBottom: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionIcon: {
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    settingCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      overflow: 'hidden',
    },
    settingItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingItemLast: {
      borderBottomWidth: 0,
    },
    settingHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    settingContent: {
      flex: 1,
      marginRight: 12,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 4,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    settingValue: {
      fontSize: 14,
      color: theme.primary,
      marginTop: 4,
    },
    input: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#D1D5DB',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
      marginTop: 8,
    },
    picker: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#D1D5DB',
      borderRadius: 8,
      marginTop: 8,
    },
    themeToggle: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundAlt,
      borderRadius: 8,
      padding: 4,
      marginTop: 8,
    },
    themeOption: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    themeOptionActive: {
      backgroundColor: theme.primary,
    },
    themeOptionText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? theme.textSecondary : theme.text,
    },
    themeOptionTextActive: {
      color: '#FFFFFF',
    },
    reminderOptions: {
      marginTop: 8,
    },
    reminderOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
    },
    reminderRadio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.primary,
      marginRight: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    reminderRadioSelected: {
      backgroundColor: theme.primary,
    },
    reminderRadioDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#FFFFFF',
    },
    reminderText: {
      fontSize: 14,
      color: theme.text,
    },
    saveButton: {
      backgroundColor: theme.success,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      margin: 20,
      marginTop: 0,
    },
    saveButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    saveButtonDisabled: {
      backgroundColor: theme.textMuted,
    },
    dangerZone: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingTop: 24,
      marginTop: 24,
    },
    dangerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.error,
      marginBottom: 16,
      paddingHorizontal: 20,
    },
    dangerButton: {
      backgroundColor: theme.error,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
      marginHorizontal: 20,
      marginBottom: 12,
    },
    dangerButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    versionInfo: {
      alignItems: 'center',
      padding: 20,
      marginTop: 20,
    },
    versionText: {
      fontSize: 14,
      color: theme.textMuted,
      textAlign: 'center',
    },
    brandText: {
      fontSize: 12,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: 8,
    },
  });

  const handleSettingChange = (key: keyof AppSettings, value: any) => {
    if (!tempSettings) return;
    
    const newSettings = { ...tempSettings, [key]: value };
    setTempSettings(newSettings);
    setHasChanges(JSON.stringify(newSettings) !== JSON.stringify(settings));
    console.log('Setting changed:', key, value);
  };

  const handleSaveSettings = async () => {
    if (!tempSettings) return;

    try {
      await saveSettings(tempSettings);
      setSettings(tempSettings);
      setHasChanges(false);
      Alert.alert('Success', 'Settings saved successfully');
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const handleToggleBiometricLock = async (enabled: boolean) => {
    if (enabled) {
      try {
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (!isEnrolled) {
          Alert.alert(
            'Biometric Not Set Up',
            `Please set up ${biometricType} in your device settings first.`,
            [{ text: 'OK' }]
          );
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: `Enable ${biometricType} for MastiFreelance`,
          fallbackLabel: 'Use Passcode',
        });

        if (result.success) {
          handleSettingChange('biometricLock', true);
          Alert.alert('Success', `${biometricType} lock enabled successfully`);
          console.log('Biometric lock enabled');
        } else {
          Alert.alert('Authentication Failed', 'Please try again');
        }
      } catch (error) {
        console.error('Error enabling biometric lock:', error);
        Alert.alert('Error', 'Failed to enable biometric lock');
      }
    } else {
      handleSettingChange('biometricLock', false);
      console.log('Biometric lock disabled');
    }
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'This feature will export all your data to a JSON file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Export data functionality would be implemented here') },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your clients, projects, invoices, and time logs. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Are you absolutely sure?',
              'This will delete everything. Type "DELETE" to confirm.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'DELETE',
                  style: 'destructive',
                  onPress: () => console.log('Clear data functionality would be implemented here'),
                },
              ]
            );
          },
        },
      ]
    );
  };

  if (!settings || !tempSettings) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        <View style={[styles.content, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={styles.settingDescription}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  const selectedCurrency = CURRENCIES.find(c => c.code === tempSettings.currency);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Billing & Payments Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="card" size={24} style={[styles.sectionIcon, { color: theme.primary }]} />
            <Text style={styles.sectionTitle}>Billing & Payments</Text>
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Default Currency</Text>
                <Text style={styles.settingDescription}>
                  Currency used for new invoices and financial calculations
                </Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={tempSettings.currency}
                    onValueChange={(value) => handleSettingChange('currency', value)}
                    style={{ color: theme.text }}
                  >
                    {CURRENCIES.map((currency) => (
                      <Picker.Item
                        key={currency.code}
                        label={`${currency.symbol} ${currency.code} - ${currency.name}`}
                        value={currency.code}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Default Billing Type</Text>
                <Text style={styles.settingDescription}>
                  How you prefer to bill clients by default
                </Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={tempSettings.defaultBillingType || 'hourly'}
                    onValueChange={(value) => handleSettingChange('defaultBillingType', value)}
                    style={{ color: theme.text }}
                  >
                    <Picker.Item label="Hourly" value="hourly" />
                    <Picker.Item label="Fixed Price" value="fixed" />
                    <Picker.Item label="Ask Every Time" value="ask" />
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Default Hourly Rate</Text>
                <Text style={styles.settingDescription}>
                  Default rate for new projects and time tracking ({selectedCurrency?.symbol})
                </Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.defaultHourlyRate.toString()}
                  onChangeText={(text) => handleSettingChange('defaultHourlyRate', parseFloat(text) || 0)}
                  placeholder="50"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Invoice Settings</Text>
                <Text style={styles.settingDescription}>
                  Default settings for new invoices
                </Text>
                
                <Text style={[styles.settingTitle, { marginTop: 12, fontSize: 14 }]}>Due Date Window</Text>
                <View style={styles.picker}>
                  <Picker
                    selectedValue={tempSettings.invoiceDueDateWindow || '30'}
                    onValueChange={(value) => handleSettingChange('invoiceDueDateWindow', value)}
                    style={{ color: theme.text }}
                  >
                    <Picker.Item label="7 days" value="7" />
                    <Picker.Item label="15 days" value="15" />
                    <Picker.Item label="30 days" value="30" />
                  </Picker>
                </View>

                <Text style={[styles.settingTitle, { marginTop: 12, fontSize: 14 }]}>Default Invoice Notes</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.defaultInvoiceNotes || ''}
                  onChangeText={(text) => handleSettingChange('defaultInvoiceNotes', text)}
                  placeholder="Thank you for your business!"
                  placeholderTextColor={theme.textMuted}
                  multiline
                />

                <Text style={[styles.settingTitle, { marginTop: 12, fontSize: 14 }]}>Tax Rate (%)</Text>
                <TextInput
                  style={styles.input}
                  value={tempSettings.taxRate.toString()}
                  onChangeText={(text) => handleSettingChange('taxRate', parseFloat(text) || 0)}
                  placeholder="0"
                  placeholderTextColor={theme.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>
        </View>

        {/* Time Tracking Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="time" size={24} style={[styles.sectionIcon, { color: theme.primary }]} />
            <Text style={styles.sectionTitle}>Time Tracking</Text>
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Enable Time Tracking</Text>
                  <Text style={styles.settingDescription}>
                    Track time spent on projects and tasks
                  </Text>
                </View>
                <Switch
                  value={tempSettings.timeTrackingEnabled || false}
                  onValueChange={(value) => handleSettingChange('timeTrackingEnabled', value)}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={tempSettings.timeTrackingEnabled ? '#FFFFFF' : theme.textMuted}
                />
              </View>
            </View>

            {tempSettings.timeTrackingEnabled && (
              <>
                <View style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Time Format</Text>
                    <Text style={styles.settingDescription}>
                      How time is displayed throughout the app
                    </Text>
                    <View style={styles.picker}>
                      <Picker
                        selectedValue={tempSettings.timeFormat || '24h'}
                        onValueChange={(value) => handleSettingChange('timeFormat', value)}
                        style={{ color: theme.text }}
                      >
                        <Picker.Item label="12-hour (AM/PM)" value="12h" />
                        <Picker.Item label="24-hour" value="24h" />
                      </Picker>
                    </View>
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingContent}>
                    <Text style={styles.settingTitle}>Default Time Increment</Text>
                    <Text style={styles.settingDescription}>
                      Minimum time unit for manual time entry
                    </Text>
                    <View style={styles.picker}>
                      <Picker
                        selectedValue={tempSettings.timeIncrement || '15m'}
                        onValueChange={(value) => handleSettingChange('timeIncrement', value)}
                        style={{ color: theme.text }}
                      >
                        <Picker.Item label="15 minutes" value="15m" />
                        <Picker.Item label="30 minutes" value="30m" />
                        <Picker.Item label="1 hour" value="1h" />
                      </Picker>
                    </View>
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingHeader}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Remind Me to Log Time</Text>
                      <Text style={styles.settingDescription}>
                        Get notifications to track your time
                      </Text>
                      {tempSettings.remindToLogTime && (
                        <View style={styles.reminderOptions}>
                          {['Morning', 'Evening', 'Every 2 hours'].map((option) => (
                            <TouchableOpacity
                              key={option}
                              style={styles.reminderOption}
                              onPress={() => handleSettingChange('remindTime', option)}
                            >
                              <View style={[
                                styles.reminderRadio,
                                tempSettings.remindTime === option && styles.reminderRadioSelected
                              ]}>
                                {tempSettings.remindTime === option && (
                                  <View style={styles.reminderRadioDot} />
                                )}
                              </View>
                              <Text style={styles.reminderText}>{option}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                    <Switch
                      value={tempSettings.remindToLogTime || false}
                      onValueChange={(value) => handleSettingChange('remindToLogTime', value)}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor={tempSettings.remindToLogTime ? '#FFFFFF' : theme.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingHeader}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Auto Stop Timer</Text>
                      <Text style={styles.settingDescription}>
                        Automatically stop timer after specified hours
                      </Text>
                      {tempSettings.autoStopTimer && (
                        <TextInput
                          style={[styles.input, { marginTop: 8 }]}
                          value={tempSettings.autoStopTimeHours?.toString() || '8'}
                          onChangeText={(text) => handleSettingChange('autoStopTimeHours', parseInt(text) || 8)}
                          placeholder="8"
                          placeholderTextColor={theme.textMuted}
                          keyboardType="numeric"
                        />
                      )}
                    </View>
                    <Switch
                      value={tempSettings.autoStopTimer || false}
                      onValueChange={(value) => handleSettingChange('autoStopTimer', value)}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor={tempSettings.autoStopTimer ? '#FFFFFF' : theme.textMuted}
                    />
                  </View>
                </View>
              </>
            )}
          </View>
        </View>

        {/* App Experience Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="phone-portrait" size={24} style={[styles.sectionIcon, { color: theme.primary }]} />
            <Text style={styles.sectionTitle}>App Experience</Text>
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Theme Mode</Text>
                <Text style={styles.settingDescription}>
                  Choose your preferred app appearance
                </Text>
                <View style={styles.themeToggle}>
                  {['Light', 'Dark', 'Auto'].map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={[
                        styles.themeOption,
                        (mode === 'Light' && !isDark) ||
                        (mode === 'Dark' && isDark) ||
                        (mode === 'Auto' && tempSettings.themeMode === 'auto') ? styles.themeOptionActive : null
                      ]}
                      onPress={() => {
                        if (mode === 'Light' && isDark) toggleTheme();
                        if (mode === 'Dark' && !isDark) toggleTheme();
                        handleSettingChange('themeMode', mode.toLowerCase());
                      }}
                    >
                      <Text style={[
                        styles.themeOptionText,
                        (mode === 'Light' && !isDark) ||
                        (mode === 'Dark' && isDark) ||
                        (mode === 'Auto' && tempSettings.themeMode === 'auto') ? styles.themeOptionTextActive : null
                      ]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Notifications</Text>
                  <Text style={styles.settingDescription}>
                    Receive notifications for important events
                  </Text>
                </View>
                <Switch
                  value={tempSettings.notifications}
                  onValueChange={(value) => handleSettingChange('notifications', value)}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={tempSettings.notifications ? '#FFFFFF' : theme.textMuted}
                />
              </View>
            </View>

            {tempSettings.notifications && (
              <>
                <View style={styles.settingItem}>
                  <View style={styles.settingHeader}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Upcoming Invoice Reminders</Text>
                      <Text style={styles.settingDescription}>
                        Get notified about invoices due soon
                      </Text>
                    </View>
                    <Switch
                      value={tempSettings.upcomingInvoiceReminders || false}
                      onValueChange={(value) => handleSettingChange('upcomingInvoiceReminders', value)}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor={tempSettings.upcomingInvoiceReminders ? '#FFFFFF' : theme.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingHeader}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Time Logging Reminders</Text>
                      <Text style={styles.settingDescription}>
                        Get reminded to log your work time
                      </Text>
                    </View>
                    <Switch
                      value={tempSettings.timeLoggingReminders || false}
                      onValueChange={(value) => handleSettingChange('timeLoggingReminders', value)}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor={tempSettings.timeLoggingReminders ? '#FFFFFF' : theme.textMuted}
                    />
                  </View>
                </View>

                <View style={styles.settingItem}>
                  <View style={styles.settingHeader}>
                    <View style={styles.settingContent}>
                      <Text style={styles.settingTitle}>Payment Confirmations</Text>
                      <Text style={styles.settingDescription}>
                        Get notified when payments are received
                      </Text>
                    </View>
                    <Switch
                      value={tempSettings.paymentConfirmations || false}
                      onValueChange={(value) => handleSettingChange('paymentConfirmations', value)}
                      trackColor={{ false: theme.border, true: theme.primary }}
                      thumbColor={tempSettings.paymentConfirmations ? '#FFFFFF' : theme.textMuted}
                    />
                  </View>
                </View>
              </>
            )}

            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Data Backup</Text>
                  <Text style={styles.settingDescription}>
                    Automatically backup your data
                  </Text>
                </View>
                <Switch
                  value={tempSettings.autoBackup || false}
                  onValueChange={(value) => handleSettingChange('autoBackup', value)}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={tempSettings.autoBackup ? '#FFFFFF' : theme.textMuted}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="shield-checkmark" size={24} style={[styles.sectionIcon, { color: theme.primary }]} />
            <Text style={styles.sectionTitle}>Security</Text>
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>
                    App Lock {biometricType && `(${biometricType})`}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {biometricType 
                      ? `Require ${biometricType} or passcode to open the app`
                      : 'Biometric authentication not available on this device'}
                  </Text>
                </View>
                <Switch
                  value={tempSettings.biometricLock}
                  onValueChange={handleToggleBiometricLock}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={tempSettings.biometricLock ? '#FFFFFF' : theme.textMuted}
                  disabled={!biometricType}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="help-circle" size={24} style={[styles.sectionIcon, { color: theme.primary }]} />
            <Text style={styles.sectionTitle}>Support</Text>
          </View>
          
          <View style={styles.settingCard}>
            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Help & FAQs</Text>
                  <Text style={styles.settingDescription}>
                    Get answers to common questions
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} style={{ color: theme.textMuted }} />
              </View>
            </TouchableOpacity>

            <View style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Contact Support</Text>
                  <Text style={styles.settingDescription}>
                    Get help from our support team
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} style={{ color: theme.textMuted }} />
              </View>
            </View>

            <TouchableOpacity style={styles.settingItem}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Privacy Policy</Text>
                  <Text style={styles.settingDescription}>
                    Learn how we protect your data
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} style={{ color: theme.textMuted }} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.settingItemLast]}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Terms of Use</Text>
                  <Text style={styles.settingDescription}>
                    Read our terms and conditions
                  </Text>
                </View>
                <Icon name="chevron-forward" size={20} style={{ color: theme.textMuted }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="download" size={24} style={[styles.sectionIcon, { color: theme.primary }]} />
            <Text style={styles.sectionTitle}>Data Management</Text>
          </View>
          
          <View style={styles.settingCard}>
            <TouchableOpacity style={styles.settingItem} onPress={handleExportData}>
              <View style={styles.settingHeader}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Export Data</Text>
                  <Text style={styles.settingDescription}>
                    Export all your data as JSON/CSV
                  </Text>
                </View>
                <Icon name="download" size={20} style={{ color: theme.primary }} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Changes */}
        {hasChanges && (
          <TouchableOpacity
            style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
            onPress={handleSaveSettings}
            disabled={!hasChanges}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        )}

        {/* Danger Zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          
          <TouchableOpacity style={styles.dangerButton} onPress={() => Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Log Out', style: 'destructive', onPress: () => console.log('Log out functionality') }
          ])}>
            <Text style={styles.dangerButtonText}>Log Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        {/* Version Info */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>MastiFreelance v1.0.0</Text>
          <Text style={styles.brandText}>Made with ❤️ by mastidev</Text>
        </View>
      </ScrollView>
    </View>
  );
}