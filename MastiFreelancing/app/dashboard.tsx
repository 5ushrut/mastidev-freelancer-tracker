import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Icon from '../components/Icon';
import DashboardTab from '../components/tabs/DashboardTab';
import ClientsTab from '../components/tabs/ClientsTab';
import ProjectsTab from '../components/tabs/ProjectsTab';
import InvoicesTab from '../components/tabs/InvoicesTab';
import SettingsTab from '../components/tabs/SettingsTab';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'analytics' as const },
  { id: 'clients', label: 'Clients', icon: 'people' as const },
  { id: 'projects', label: 'Projects', icon: 'folder' as const },
  { id: 'invoices', label: 'Invoices', icon: 'receipt' as const },
  { id: 'settings', label: 'Settings', icon: 'settings' as const },
];

export default function DashboardScreen() {
  const { theme, isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      backgroundColor: isDark ? theme.surface : '#FFFFFF',
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingBottom: 8,
      paddingTop: 8,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 8,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '500',
      marginTop: 4,
    },
    tabLabelActive: {
      color: theme.primary,
    },
    tabLabelInactive: {
      color: isDark ? theme.textMuted : '#6B7280',
    },
  });

  const getTabIconColor = (tabId: string) => {
    if (activeTab === tabId) {
      return theme.primary;
    }
    return isDark ? theme.textMuted : '#6B7280';
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'clients':
        return <ClientsTab />;
      case 'projects':
        return <ProjectsTab />;
      case 'invoices':
        return <InvoicesTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {renderTabContent()}
      </View>
      
      <View style={styles.tabBar}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <Icon
              name={tab.icon}
              size={24}
              style={{
                color: getTabIconColor(tab.id),
              }}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === tab.id ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}