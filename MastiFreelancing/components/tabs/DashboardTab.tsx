import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { loadClients, loadProjects, loadTimeLogs, loadInvoices, loadSettings, formatCurrency, formatDuration, Client, Project, TimeLog, Invoice, AppSettings } from '../../utils/storage';
import Icon from '../Icon';

export default function DashboardTab() {
  const { theme } = useTheme();
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [clientsData, projectsData, timeLogsData, invoicesData, settingsData] = await Promise.all([
        loadClients(),
        loadProjects(),
        loadTimeLogs(),
        loadInvoices(),
        loadSettings(),
      ]);

      setClients(clientsData);
      setProjects(projectsData);
      setTimeLogs(timeLogsData);
      setInvoices(invoicesData);
      setSettings(settingsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
    greeting: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: theme.textSecondary,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    cardSubtitle: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    emptyState: {
      alignItems: 'center',
      padding: 32,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    invoiceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    invoiceClient: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
    },
    invoiceAmount: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.error,
    },
    todayStats: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
    },
    todayTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 16,
    },
    todayGrid: {
      flexDirection: 'row',
      gap: 16,
    },
    todayStat: {
      flex: 1,
    },
    todayValue: {
      fontSize: 20,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    todayLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
    },
  });

  // Calculate today's stats
  const today = new Date().toDateString();
  const todayTimeLogs = timeLogs.filter(log => new Date(log.createdAt).toDateString() === today);
  const todayHours = todayTimeLogs.reduce((total, log) => total + log.duration, 0);
  const todayEarnings = todayTimeLogs.reduce((total, log) => total + (log.duration / 60) * log.hourlyRate, 0);

  // Calculate overall stats
  const totalClients = clients.length;
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const unpaidInvoices = invoices.filter(i => i.status !== 'paid');
  const totalUnpaid = unpaidInvoices.reduce((total, invoice) => total + invoice.total, 0);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! ☀️';
    if (hour < 18) return 'Good afternoon! 🌤️';
    return 'Good evening! 🌙';
  };

  if (!settings) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.subtitle}>Here&apos;s your freelance overview</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Stats */}
        <View style={styles.todayStats}>
          <Text style={styles.todayTitle}>Today&apos;s Progress</Text>
          <View style={styles.todayGrid}>
            <View style={styles.todayStat}>
              <Text style={styles.todayValue}>{formatDuration(todayHours)}</Text>
              <Text style={styles.todayLabel}>Hours Logged</Text>
            </View>
            <View style={styles.todayStat}>
              <Text style={styles.todayValue}>{formatCurrency(todayEarnings, settings.currency)}</Text>
              <Text style={styles.todayLabel}>Earnings</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalClients}</Text>
            <Text style={styles.statLabel}>Clients</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeProjects}</Text>
            <Text style={styles.statLabel}>Active Projects</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(totalUnpaid, settings.currency)}</Text>
            <Text style={styles.statLabel}>Unpaid</Text>
          </View>
        </View>

        {/* Unpaid Invoices */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Unpaid Invoices</Text>
          <View style={styles.card}>
            {unpaidInvoices.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="checkmark-circle" size={48} style={[styles.emptyIcon, { color: theme.success }]} />
                <Text style={styles.emptyTitle}>All caught up! 🎉</Text>
                <Text style={styles.emptyText}>No unpaid invoices at the moment</Text>
              </View>
            ) : (
              unpaidInvoices.slice(0, 5).map((invoice) => {
                const client = clients.find(c => c.id === invoice.clientId);
                return (
                  <View key={invoice.id} style={styles.invoiceItem}>
                    <View>
                      <Text style={styles.invoiceClient}>{client?.name || 'Unknown Client'}</Text>
                      <Text style={styles.cardSubtitle}>Due: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
                    </View>
                    <Text style={styles.invoiceAmount}>{formatCurrency(invoice.total, settings.currency)}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.card}>
            {timeLogs.length === 0 ? (
              <View style={styles.emptyState}>
                <Icon name="time" size={48} style={[styles.emptyIcon, { color: theme.textMuted }]} />
                <Text style={styles.emptyTitle}>No time logged yet</Text>
                <Text style={styles.emptyText}>Start tracking your work hours to see activity here</Text>
              </View>
            ) : (
              timeLogs.slice(0, 3).map((log) => {
                const project = projects.find(p => p.id === log.projectId);
                return (
                  <View key={log.id} style={styles.invoiceItem}>
                    <View>
                      <Text style={styles.invoiceClient}>{project?.name || 'Unknown Project'}</Text>
                      <Text style={styles.cardSubtitle}>{log.description}</Text>
                    </View>
                    <Text style={styles.cardSubtitle}>{formatDuration(log.duration)}</Text>
                  </View>
                );
              })
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}