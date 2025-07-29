import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { loadClients, saveClients, generateId, Client } from '../../utils/storage';
import Icon from '../Icon';
import Button from '../Button';

export default function ClientsTab() {
  const { theme, isDark } = useTheme();
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [onClientSelect, setOnClientSelect] = useState<((client: Client) => void) | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
    currency: 'USD',
  });

  useEffect(() => {
    loadClientsData();
  }, []);

  const loadClientsData = async () => {
    try {
      const clientsData = await loadClients();
      setClients(clientsData);
      console.log('Loaded clients:', clientsData.length);
    } catch (error) {
      console.error('Error loading clients:', error);
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
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.text,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      padding: 20,
    },
    searchContainer: {
      marginBottom: 20,
    },
    searchInput: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#D1D5DB',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    },
    clientCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    clientHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    clientName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    clientCompany: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    clientEmail: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    clientPhone: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    clientActions: {
      flexDirection: 'row',
      gap: 8,
    },
    actionButton: {
      backgroundColor: theme.backgroundAlt,
      borderRadius: 6,
      padding: 8,
    },
    editButton: {
      backgroundColor: theme.primary,
    },
    deleteButton: {
      backgroundColor: theme.error,
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
    formContainer: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    formTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 6,
    },
    input: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#D1D5DB',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
      marginBottom: 12,
    },
    textArea: {
      height: 80,
      textAlignVertical: 'top',
    },
    formActions: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.backgroundAlt,
    },
    saveButton: {
      flex: 1,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    clientPickerItem: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    clientPickerName: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
    clientPickerCompany: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    autofillContainer: {
      backgroundColor: theme.backgroundAlt,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    autofillTitle: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.text,
      marginBottom: 8,
    },
    autofillOption: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: theme.card,
      borderRadius: 6,
      marginBottom: 4,
    },
    autofillText: {
      fontSize: 14,
      color: theme.primary,
    },
  });

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Autofill suggestions based on existing clients
  const getAutofillSuggestions = (field: string, value: string) => {
    if (!value || value.length < 2) return [];
    
    const suggestions = new Set<string>();
    clients.forEach(client => {
      const fieldValue = client[field as keyof Client] as string;
      if (fieldValue && fieldValue.toLowerCase().includes(value.toLowerCase()) && fieldValue !== value) {
        suggestions.add(fieldValue);
      }
    });
    
    return Array.from(suggestions).slice(0, 3);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      email: '',
      phone: '',
      notes: '',
      currency: 'USD',
    });
    setEditingClient(null);
    setShowAddForm(false);
  };

  const handleSaveClient = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Client name is required');
      return;
    }

    try {
      let updatedClients;
      
      if (editingClient) {
        // Update existing client
        updatedClients = clients.map(client =>
          client.id === editingClient.id
            ? { ...client, ...formData }
            : client
        );
        console.log('Updating client:', editingClient.id);
      } else {
        // Add new client
        const newClient: Client = {
          id: generateId(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        updatedClients = [...clients, newClient];
        console.log('Adding new client:', newClient.id);
      }

      await saveClients(updatedClients);
      setClients(updatedClients);
      resetForm();
      
      // Show success feedback
      Alert.alert('Success', `Client ${editingClient ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving client:', error);
      Alert.alert('Error', 'Failed to save client');
    }
  };

  const handleEditClient = (client: Client) => {
    setFormData({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone || '',
      notes: client.notes,
      currency: client.currency,
    });
    setEditingClient(client);
    setShowAddForm(true);
    console.log('Editing client:', client.id);
  };

  const handleDeleteClient = (client: Client) => {
    Alert.alert(
      'Delete Client',
      `Are you sure you want to delete ${client.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting client:', client.id);
              const updatedClients = clients.filter(c => c.id !== client.id);
              await saveClients(updatedClients);
              setClients(updatedClients);
              Alert.alert('Success', 'Client deleted successfully');
              console.log('Client deleted successfully');
            } catch (error) {
              console.error('Error deleting client:', error);
              Alert.alert('Error', 'Failed to delete client');
            }
          },
        },
      ]
    );
  };

  // Function to show client picker modal
  const showClientPickerModal = (callback: (client: Client) => void) => {
    setOnClientSelect(() => callback);
    setShowClientPicker(true);
  };

  const handleClientSelect = (client: Client) => {
    if (onClientSelect) {
      onClientSelect(client);
    }
    setShowClientPicker(false);
    setOnClientSelect(null);
  };

  // Export this function for use in other components
  React.useEffect(() => {
    // Make the client picker function available globally
    (global as any).showClientPicker = showClientPickerModal;
  }, []);

  const renderAutofillSuggestions = (field: string, value: string) => {
    const suggestions = getAutofillSuggestions(field, value);
    if (suggestions.length === 0) return null;

    return (
      <View style={styles.autofillContainer}>
        <Text style={styles.autofillTitle}>Suggestions:</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.autofillOption}
            onPress={() => setFormData({ ...formData, [field]: suggestion })}
          >
            <Text style={styles.autofillText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Clients</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddForm(true)}
        >
          <Icon name="add" size={24} style={{ color: '#FFFFFF' }} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search clients..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Add/Edit Form */}
        {showAddForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editingClient ? 'Edit Client' : 'Add New Client'}
            </Text>

            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Client name"
              placeholderTextColor={theme.textMuted}
            />
            {renderAutofillSuggestions('name', formData.name)}

            <Text style={styles.label}>Company</Text>
            <TextInput
              style={styles.input}
              value={formData.company}
              onChangeText={(text) => setFormData({ ...formData, company: text })}
              placeholder="Company name"
              placeholderTextColor={theme.textMuted}
            />
            {renderAutofillSuggestions('company', formData.company)}

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              placeholder="email@example.com"
              placeholderTextColor={theme.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {renderAutofillSuggestions('email', formData.email)}

            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={theme.textMuted}
              keyboardType="phone-pad"
            />
            {renderAutofillSuggestions('phone', formData.phone)}

            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              placeholder="Additional notes..."
              placeholderTextColor={theme.textMuted}
              multiline
            />

            <View style={styles.formActions}>
              <Button
                text="Cancel"
                onPress={resetForm}
                style={styles.cancelButton}
                textStyle={{ color: theme.text }}
              />
              <Button
                text={editingClient ? 'Update' : 'Save'}
                onPress={handleSaveClient}
                style={styles.saveButton}
              />
            </View>
          </View>
        )}

        {/* Clients List */}
        {filteredClients.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="people" size={48} style={[styles.emptyIcon, { color: theme.textMuted }]} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No clients found' : 'No clients yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Add your first client to get started with project tracking'}
            </Text>
          </View>
        ) : (
          filteredClients.map((client) => (
            <View key={client.id} style={styles.clientCard}>
              <View style={styles.clientHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.clientName}>{client.name}</Text>
                  {client.company && (
                    <Text style={styles.clientCompany}>{client.company}</Text>
                  )}
                  {client.email && (
                    <Text style={styles.clientEmail}>{client.email}</Text>
                  )}
                  {client.phone && (
                    <Text style={styles.clientPhone}>{client.phone}</Text>
                  )}
                </View>
                <View style={styles.clientActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditClient(client)}
                  >
                    <Icon name="pencil" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteClient(client)}
                  >
                    <Icon name="trash" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                </View>
              </View>
              {client.notes && (
                <Text style={styles.clientEmail}>{client.notes}</Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Client Picker Modal */}
      <Modal
        visible={showClientPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClientPicker(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Client</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {clients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.clientPickerItem}
                  onPress={() => handleClientSelect(client)}
                >
                  <Text style={styles.clientPickerName}>{client.name}</Text>
                  {client.company && (
                    <Text style={styles.clientPickerCompany}>{client.company}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button
              text="Cancel"
              onPress={() => setShowClientPicker(false)}
              style={{ marginTop: 16, backgroundColor: theme.backgroundAlt }}
              textStyle={{ color: theme.text }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}