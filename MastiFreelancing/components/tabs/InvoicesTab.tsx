import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { loadInvoices, saveInvoices, loadClients, loadProjects, loadSettings, generateId, formatCurrency, generateInvoiceNumber, Invoice, InvoiceItem, Client, Project, AppSettings } from '../../utils/storage';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import Icon from '../Icon';
import Button from '../Button';

export default function InvoicesTab() {
  const { theme, isDark } = useTheme();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);
  const [selectedInvoiceForStatus, setSelectedInvoiceForStatus] = useState<Invoice | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientId: '',
    projectId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'draft' as 'draft' | 'sent' | 'paid',
    currency: 'USD',
    items: [] as InvoiceItem[],
    discount: 0,
    discountType: 'flat' as 'flat' | 'percentage',
    tax: 0,
    taxType: 'percentage' as 'flat' | 'percentage',
    notes: '',
    termsAndConditions: '',
  });

  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    rate: 0,
  });

  useEffect(() => {
    loadInvoicesData();
  }, []);

  const loadInvoicesData = async () => {
    try {
      const [invoicesData, clientsData, projectsData, settingsData] = await Promise.all([
        loadInvoices(),
        loadClients(),
        loadProjects(),
        loadSettings(),
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
      setProjects(projectsData);
      setSettings(settingsData);
      setFormData(prev => ({ ...prev, currency: settingsData.currency }));
      console.log('Loaded invoices data:', invoicesData.length);
    } catch (error) {
      console.error('Error loading invoices data:', error);
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
    uploadButton: {
      backgroundColor: theme.success,
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    filterTabs: {
      flexDirection: 'row',
      marginBottom: 20,
      backgroundColor: theme.backgroundAlt,
      borderRadius: 8,
      padding: 4,
    },
    filterTab: {
      flex: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
      alignItems: 'center',
    },
    filterTabActive: {
      backgroundColor: theme.primary,
    },
    filterTabText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? theme.textSecondary : theme.text,
    },
    filterTabTextActive: {
      color: '#FFFFFF',
    },
    invoiceCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    invoiceHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    invoiceNumber: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    invoiceClient: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    invoiceAmount: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
    },
    invoiceDate: {
      fontSize: 12,
      color: theme.textMuted,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    statusActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
    },
    statusButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 6,
      backgroundColor: theme.primary,
    },
    statusButtonText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '500',
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
    summaryCard: {
      backgroundColor: theme.primary,
      borderRadius: 12,
      padding: 20,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: 12,
    },
    summaryGrid: {
      flexDirection: 'row',
      gap: 16,
    },
    summaryStat: {
      flex: 1,
    },
    summaryValue: {
      fontSize: 18,
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: 4,
    },
    summaryLabel: {
      fontSize: 12,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    // Modal styles
    modal: {
      flex: 1,
      backgroundColor: theme.background,
    },
    modalHeader: {
      padding: 20,
      paddingTop: 60,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.text,
    },
    closeButton: {
      backgroundColor: isDark ? theme.backgroundAlt : '#F3F4F6',
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    section: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.border,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 12,
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
    picker: {
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#D1D5DB',
      borderRadius: 8,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    flex1: {
      flex: 1,
    },
    clientCard: {
      backgroundColor: theme.backgroundAlt,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
    },
    clientName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    clientCompany: {
      fontSize: 14,
      color: theme.textSecondary,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    itemDescription: {
      flex: 2,
      fontSize: 14,
      color: theme.text,
    },
    itemQuantity: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      textAlign: 'center',
    },
    itemRate: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      textAlign: 'right',
    },
    itemAmount: {
      flex: 1,
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
      textAlign: 'right',
    },
    addItemButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: 'center',
      marginTop: 12,
    },
    addItemText: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 8,
    },
    totalLabel: {
      fontSize: 16,
      color: theme.text,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    grandTotal: {
      borderTopWidth: 2,
      borderTopColor: theme.primary,
      paddingTop: 8,
    },
    grandTotalLabel: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.text,
    },
    grandTotalValue: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.primary,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 12,
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    actionButtonModal: {
      flex: 1,
      borderRadius: 8,
      padding: 16,
      alignItems: 'center',
    },
    draftButton: {
      backgroundColor: theme.warning,
    },
    sendButton: {
      backgroundColor: theme.primary,
    },
    paidButton: {
      backgroundColor: theme.success,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
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
    statusPickerModal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    statusPickerContent: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 20,
      width: '80%',
    },
    statusOption: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      alignItems: 'center',
    },
    statusOptionText: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.text,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return theme.success;
      case 'sent':
        return theme.primary;
      case 'overdue':
        return theme.error;
      case 'draft':
        return theme.warning;
      default:
        return theme.textMuted;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'overdue') {
      return invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();
    }
    return invoice.status === activeFilter;
  });

  // Autofill suggestions for invoice items
  const getItemAutofillSuggestions = (field: string, value: string) => {
    if (!value || value.length < 2) return [];
    
    const suggestions = new Set<string>();
    invoices.forEach(invoice => {
      invoice.items.forEach(item => {
        const fieldValue = item[field as keyof InvoiceItem] as string;
        if (fieldValue && fieldValue.toString().toLowerCase().includes(value.toLowerCase()) && fieldValue !== value) {
          suggestions.add(fieldValue.toString());
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 3);
  };

  const resetForm = () => {
    setFormData({
      invoiceNumber: generateInvoiceNumber(settings?.invoicePrefix),
      clientId: '',
      projectId: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      status: 'draft',
      currency: settings?.currency || 'USD',
      items: [],
      discount: 0,
      discountType: 'flat',
      tax: settings?.taxRate || 0,
      taxType: 'percentage',
      notes: settings?.defaultInvoiceNotes || '',
      termsAndConditions: '',
    });
    setNewItem({ description: '', quantity: 1, rate: settings?.defaultHourlyRate || 0 });
    setEditingInvoice(null);
  };

  const handleUploadInvoice = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        Alert.alert(
          'Invoice Uploaded',
          `File "${file.name}" has been uploaded successfully. This feature will be fully implemented to process and store the invoice.`,
          [{ text: 'OK' }]
        );
        console.log('Uploaded file:', file);
      }
    } catch (error) {
      console.error('Error uploading invoice:', error);
      Alert.alert('Error', 'Failed to upload invoice');
    }
  };

  const addItem = () => {
    if (!newItem.description.trim()) {
      Alert.alert('Error', 'Item description is required');
      return;
    }

    const item: InvoiceItem = {
      id: generateId(),
      description: newItem.description,
      quantity: newItem.quantity,
      rate: newItem.rate,
      amount: newItem.quantity * newItem.rate,
    };

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item],
    }));

    setNewItem({ description: '', quantity: 1, rate: settings?.defaultHourlyRate || 0 });
  };

  const removeItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId),
    }));
  };

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0);
    
    let discountAmount = 0;
    if (formData.discountType === 'percentage') {
      discountAmount = (subtotal * formData.discount) / 100;
    } else {
      discountAmount = formData.discount;
    }

    const afterDiscount = subtotal - discountAmount;
    
    let taxAmount = 0;
    if (formData.taxType === 'percentage') {
      taxAmount = (afterDiscount * formData.tax) / 100;
    } else {
      taxAmount = formData.tax;
    }

    const total = afterDiscount + taxAmount;

    return { subtotal, discountAmount, taxAmount, total };
  };

  const handleSaveInvoice = async (status: 'draft' | 'sent' | 'paid') => {
    if (!formData.clientId) {
      Alert.alert('Error', 'Please select a client');
      return;
    }

    if (formData.items.length === 0) {
      Alert.alert('Error', 'Please add at least one item');
      return;
    }

    if (!formData.dueDate) {
      Alert.alert('Error', 'Please set a due date');
      return;
    }

    try {
      const { subtotal, discountAmount, taxAmount, total } = calculateTotals();

      let updatedInvoices;
      
      if (editingInvoice) {
        // Update existing invoice
        const updatedInvoice: Invoice = {
          ...editingInvoice,
          invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(settings?.invoicePrefix),
          clientId: formData.clientId,
          projectId: formData.projectId || undefined,
          items: formData.items,
          subtotal,
          discount: discountAmount,
          discountType: formData.discountType,
          tax: taxAmount,
          taxType: formData.taxType,
          total,
          status,
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          notes: formData.notes,
          termsAndConditions: formData.termsAndConditions,
          currency: formData.currency,
          ...(status === 'sent' && !editingInvoice.sentAt && { sentAt: new Date().toISOString() }),
          ...(status === 'paid' && !editingInvoice.paidAt && { paidAt: new Date().toISOString() }),
        };

        updatedInvoices = invoices.map(inv =>
          inv.id === editingInvoice.id ? updatedInvoice : inv
        );
        console.log('Updating invoice:', editingInvoice.id);
      } else {
        // Add new invoice
        const newInvoice: Invoice = {
          id: generateId(),
          invoiceNumber: formData.invoiceNumber || generateInvoiceNumber(settings?.invoicePrefix),
          clientId: formData.clientId,
          projectId: formData.projectId || undefined,
          items: formData.items,
          subtotal,
          discount: discountAmount,
          discountType: formData.discountType,
          tax: taxAmount,
          taxType: formData.taxType,
          total,
          status,
          issueDate: formData.issueDate,
          dueDate: formData.dueDate,
          notes: formData.notes,
          termsAndConditions: formData.termsAndConditions,
          currency: formData.currency,
          createdAt: new Date().toISOString(),
          ...(status === 'sent' && { sentAt: new Date().toISOString() }),
          ...(status === 'paid' && { paidAt: new Date().toISOString() }),
        };

        updatedInvoices = [...invoices, newInvoice];
        console.log('Adding new invoice:', newInvoice.id);
      }

      await saveInvoices(updatedInvoices);
      setInvoices(updatedInvoices);
      setShowCreateModal(false);
      setShowEditModal(false);
      resetForm();

      Alert.alert('Success', `Invoice ${editingInvoice ? 'updated' : status === 'draft' ? 'saved as draft' : status === 'sent' ? 'sent' : 'marked as paid'} successfully!`);
      console.log('Invoice saved:', status);
    } catch (error) {
      console.error('Error saving invoice:', error);
      Alert.alert('Error', 'Failed to save invoice');
    }
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setFormData({
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      projectId: invoice.projectId || '',
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      status: invoice.status,
      currency: invoice.currency,
      items: invoice.items,
      discount: invoice.discount || 0,
      discountType: invoice.discountType || 'flat',
      tax: invoice.tax || 0,
      taxType: invoice.taxType || 'percentage',
      notes: invoice.notes || '',
      termsAndConditions: invoice.termsAndConditions || '',
    });
    setEditingInvoice(invoice);
    setShowEditModal(true);
    console.log('Editing invoice:', invoice.id);
  };

  const handleDeleteInvoice = (invoice: Invoice) => {
    Alert.alert(
      'Delete Invoice',
      `Are you sure you want to delete invoice ${invoice.invoiceNumber}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting invoice:', invoice.id);
              const updatedInvoices = invoices.filter(inv => inv.id !== invoice.id);
              await saveInvoices(updatedInvoices);
              setInvoices(updatedInvoices);
              Alert.alert('Success', 'Invoice deleted successfully');
              console.log('Invoice deleted successfully');
            } catch (error) {
              console.error('Error deleting invoice:', error);
              Alert.alert('Error', 'Failed to delete invoice');
            }
          },
        },
      ]
    );
  };

  const handleChangeInvoiceStatus = async (invoice: Invoice, newStatus: 'draft' | 'sent' | 'paid') => {
    try {
      const updatedInvoices = invoices.map(inv =>
        inv.id === invoice.id
          ? { 
              ...inv, 
              status: newStatus,
              ...(newStatus === 'sent' && !inv.sentAt && { sentAt: new Date().toISOString() }),
              ...(newStatus === 'paid' && !inv.paidAt && { paidAt: new Date().toISOString() }),
            }
          : inv
      );
      await saveInvoices(updatedInvoices);
      setInvoices(updatedInvoices);
      setShowStatusPicker(false);
      setSelectedInvoiceForStatus(null);
      Alert.alert('Success', `Invoice status changed to ${newStatus}!`);
      console.log('Invoice status changed:', invoice.id, 'New status:', newStatus);
    } catch (error) {
      console.error('Error changing invoice status:', error);
      Alert.alert('Error', 'Failed to update invoice status');
    }
  };

  const selectClient = (client: Client) => {
    setFormData(prev => ({ 
      ...prev, 
      clientId: client.id,
      currency: client.currency || prev.currency,
    }));
    setShowClientPicker(false);
  };

  const renderAutofillSuggestions = (field: string, value: string) => {
    const suggestions = getItemAutofillSuggestions(field, value);
    if (suggestions.length === 0) return null;

    return (
      <View style={styles.autofillContainer}>
        <Text style={styles.autofillTitle}>Suggestions:</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.autofillOption}
            onPress={() => setNewItem({ ...newItem, [field]: suggestion })}
          >
            <Text style={styles.autofillText}>{suggestion}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Calculate summary stats
  const totalUnpaid = invoices
    .filter(inv => inv.status !== 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  const totalPaid = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);

  const overdueCount = invoices.filter(inv => 
    inv.status !== 'paid' && new Date(inv.dueDate) < new Date()
  ).length;

  const { subtotal, discountAmount, taxAmount, total } = calculateTotals();
  const selectedClient = clients.find(c => c.id === formData.clientId);

  if (!settings) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Loading...</Text>
        </View>
      </View>
    );
  }

  const renderInvoiceForm = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Invoice Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1️⃣ Invoice Details</Text>
        
        <Text style={styles.label}>Invoice Number</Text>
        <TextInput
          style={styles.input}
          value={formData.invoiceNumber}
          onChangeText={(text) => setFormData(prev => ({ ...prev, invoiceNumber: text }))}
          placeholder={generateInvoiceNumber(settings.invoicePrefix)}
          placeholderTextColor={theme.textMuted}
        />

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Issue Date</Text>
            <TextInput
              style={styles.input}
              value={formData.issueDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, issueDate: text }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Due Date *</Text>
            <TextInput
              style={styles.input}
              value={formData.dueDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, dueDate: text }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <Text style={styles.label}>Currency</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.currency}
            onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
            style={{ color: theme.text }}
          >
            <Picker.Item label="USD - US Dollar" value="USD" />
            <Picker.Item label="EUR - Euro" value="EUR" />
            <Picker.Item label="GBP - British Pound" value="GBP" />
            <Picker.Item label="CAD - Canadian Dollar" value="CAD" />
            <Picker.Item label="AUD - Australian Dollar" value="AUD" />
          </Picker>
        </View>
      </View>

      {/* Client Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2️⃣ Client Section</Text>
        
        {selectedClient ? (
          <View style={styles.clientCard}>
            <Text style={styles.clientName}>{selectedClient.name}</Text>
            {selectedClient.company && (
              <Text style={styles.clientCompany}>{selectedClient.company}</Text>
            )}
            <TouchableOpacity onPress={() => setShowClientPicker(true)}>
              <Text style={{ color: theme.primary, marginTop: 8 }}>Change Client</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.input, { justifyContent: 'center', alignItems: 'center' }]}
            onPress={() => setShowClientPicker(true)}
          >
            <Text style={{ color: theme.primary }}>Select Client</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Items Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3️⃣ Line Items</Text>
        
        {/* Add New Item */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          value={newItem.description}
          onChangeText={(text) => setNewItem(prev => ({ ...prev, description: text }))}
          placeholder="Item description"
          placeholderTextColor={theme.textMuted}
        />
        {renderAutofillSuggestions('description', newItem.description)}

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              value={newItem.quantity.toString()}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, quantity: parseFloat(text) || 1 }))}
              placeholder="1"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Rate</Text>
            <TextInput
              style={styles.input}
              value={newItem.rate.toString()}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, rate: parseFloat(text) || 0 }))}
              placeholder={settings.defaultHourlyRate.toString()}
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addItemButton} onPress={addItem}>
          <Text style={styles.addItemText}>Add Item</Text>
        </TouchableOpacity>

        {/* Items List */}
        {formData.items.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <View style={styles.itemRow}>
              <Text style={[styles.itemDescription, { fontWeight: '600' }]}>Description</Text>
              <Text style={[styles.itemQuantity, { fontWeight: '600' }]}>Qty</Text>
              <Text style={[styles.itemRate, { fontWeight: '600' }]}>Rate</Text>
              <Text style={[styles.itemAmount, { fontWeight: '600' }]}>Amount</Text>
            </View>
            {formData.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemRow}
                onLongPress={() => removeItem(item.id)}
              >
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                <Text style={styles.itemRate}>{formatCurrency(item.rate, formData.currency)}</Text>
                <Text style={styles.itemAmount}>{formatCurrency(item.amount, formData.currency)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Additional Fields */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4️⃣ Additional Fields</Text>
        
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Discount</Text>
            <TextInput
              style={styles.input}
              value={formData.discount.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, discount: parseFloat(text) || 0 }))}
              placeholder="0"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData.discountType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, discountType: value }))}
                style={{ color: theme.text }}
              >
                <Picker.Item label="Flat Amount" value="flat" />
                <Picker.Item label="Percentage" value="percentage" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Tax</Text>
            <TextInput
              style={styles.input}
              value={formData.tax.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, tax: parseFloat(text) || 0 }))}
              placeholder={settings.taxRate.toString()}
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={formData.taxType}
                onValueChange={(value) => setFormData(prev => ({ ...prev, taxType: value }))}
                style={{ color: theme.text }}
              >
                <Picker.Item label="Percentage" value="percentage" />
                <Picker.Item label="Flat Amount" value="flat" />
              </Picker>
            </View>
          </View>
        </View>

        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.notes}
          onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
          placeholder="Thank you for your business!"
          placeholderTextColor={theme.textMuted}
          multiline
        />

        <Text style={styles.label}>Terms & Conditions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.termsAndConditions}
          onChangeText={(text) => setFormData(prev => ({ ...prev, termsAndConditions: text }))}
          placeholder="Payment terms and conditions..."
          placeholderTextColor={theme.textMuted}
          multiline
        />
      </View>

      {/* Invoice Preview */}
      {formData.items.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5️⃣ Invoice Preview</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal, formData.currency)}</Text>
          </View>
          
          {discountAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Discount ({formData.discountType === 'percentage' ? `${formData.discount}%` : 'flat'}):
              </Text>
              <Text style={styles.totalValue}>-{formatCurrency(discountAmount, formData.currency)}</Text>
            </View>
          )}
          
          {taxAmount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                Tax ({formData.taxType === 'percentage' ? `${formData.tax}%` : 'flat'}):
              </Text>
              <Text style={styles.totalValue}>{formatCurrency(taxAmount, formData.currency)}</Text>
            </View>
          )}
          
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(total, formData.currency)}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadInvoice}
          >
            <Icon name="cloud-upload" size={24} style={{ color: '#FFFFFF' }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              resetForm();
              setShowCreateModal(true);
            }}
          >
            <Icon name="add" size={24} style={{ color: '#FFFFFF' }} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Invoice Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>{formatCurrency(totalUnpaid, settings.currency)}</Text>
              <Text style={styles.summaryLabel}>Unpaid</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>{formatCurrency(totalPaid, settings.currency)}</Text>
              <Text style={styles.summaryLabel}>Paid</Text>
            </View>
            <View style={styles.summaryStat}>
              <Text style={styles.summaryValue}>{overdueCount}</Text>
              <Text style={styles.summaryLabel}>Overdue</Text>
            </View>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, activeFilter === filter && styles.filterTabActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Invoices List */}
        {filteredInvoices.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="receipt" size={48} style={[styles.emptyIcon, { color: theme.textMuted }]} />
            <Text style={styles.emptyTitle}>
              {activeFilter === 'all' ? 'No invoices yet' : `No ${activeFilter} invoices`}
            </Text>
            <Text style={styles.emptyText}>
              {activeFilter === 'all'
                ? 'Create your first invoice to start getting paid'
                : `No invoices with ${activeFilter} status found`}
            </Text>
          </View>
        ) : (
          filteredInvoices.map((invoice) => {
            const client = clients.find(c => c.id === invoice.clientId);
            const isOverdue = invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date();

            return (
              <View key={invoice.id} style={styles.invoiceCard}>
                <View style={styles.invoiceHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
                    <Text style={styles.invoiceClient}>{client?.name || 'Unknown Client'}</Text>
                    <Text style={styles.invoiceDate}>
                      Due: {new Date(invoice.dueDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.invoiceAmount}>
                      {formatCurrency(invoice.total, invoice.currency)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(isOverdue ? 'overdue' : invoice.status) }]}>
                  <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
                    {isOverdue ? 'Overdue' : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </Text>
                </View>
                <View style={styles.statusActions}>
                  <TouchableOpacity
                    style={styles.statusButton}
                    onPress={() => {
                      setSelectedInvoiceForStatus(invoice);
                      setShowStatusPicker(true);
                    }}
                  >
                    <Text style={styles.statusButtonText}>Change Status</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditInvoice(invoice)}
                  >
                    <Icon name="pencil" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteInvoice(invoice)}
                  >
                    <Icon name="trash" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Create Invoice Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Invoice</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Icon name="close" size={24} style={{ color: isDark ? theme.text : '#374151' }} />
            </TouchableOpacity>
          </View>

          {renderInvoiceForm()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.draftButton]}
              onPress={() => handleSaveInvoice('draft')}
            >
              <Text style={styles.actionButtonText}>Save as Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.sendButton]}
              onPress={() => handleSaveInvoice('sent')}
            >
              <Text style={styles.actionButtonText}>Send Invoice</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.paidButton]}
              onPress={() => handleSaveInvoice('paid')}
            >
              <Text style={styles.actionButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Invoice Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Invoice</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
            >
              <Icon name="close" size={24} style={{ color: isDark ? theme.text : '#374151' }} />
            </TouchableOpacity>
          </View>

          {renderInvoiceForm()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.draftButton]}
              onPress={() => handleSaveInvoice('draft')}
            >
              <Text style={styles.actionButtonText}>Save as Draft</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.sendButton]}
              onPress={() => handleSaveInvoice('sent')}
            >
              <Text style={styles.actionButtonText}>Update & Send</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.paidButton]}
              onPress={() => handleSaveInvoice('paid')}
            >
              <Text style={styles.actionButtonText}>Mark as Paid</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Client Picker Modal */}
      <Modal
        visible={showClientPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowClientPicker(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.card, borderRadius: 12, padding: 20, width: '90%', maxHeight: '80%' }}>
            <Text style={styles.modalTitle}>Select Client</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {clients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: theme.border }}
                  onPress={() => selectClient(client)}
                >
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{client.name}</Text>
                  {client.company && (
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>{client.company}</Text>
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

      {/* Status Picker Modal */}
      <Modal
        visible={showStatusPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <View style={styles.statusPickerModal}>
          <View style={styles.statusPickerContent}>
            <Text style={styles.modalTitle}>Change Invoice Status</Text>
            {(['draft', 'sent', 'paid'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.statusOption}
                onPress={() => selectedInvoiceForStatus && handleChangeInvoiceStatus(selectedInvoiceForStatus, status)}
              >
                <Text style={styles.statusOptionText}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
            <Button
              text="Cancel"
              onPress={() => {
                setShowStatusPicker(false);
                setSelectedInvoiceForStatus(null);
              }}
              style={{ marginTop: 16, backgroundColor: theme.backgroundAlt }}
              textStyle={{ color: theme.text }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}