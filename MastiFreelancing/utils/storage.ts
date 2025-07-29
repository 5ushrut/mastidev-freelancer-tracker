import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  notes: string;
  currency: string;
  createdAt: string;
}

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description: string;
  hourlyRate: number;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  deadline?: string;
  projectType: 'hourly' | 'fixed';
  fixedBudget?: number;
  tags: string[];
  deliverables: string[];
  timeTrackingEnabled: boolean;
  attachments: string[];
  privateNotes: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export interface TimeLog {
  id: string;
  projectId: string;
  taskId?: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  hourlyRate: number;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  projectId?: string;
  invoiceNumber: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  discountType: 'flat' | 'percentage';
  tax: number;
  taxType: 'flat' | 'percentage';
  total: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  issueDate: string;
  dueDate: string;
  notes: string;
  termsAndConditions: string;
  currency: string;
  createdAt: string;
  paidAt?: string;
  sentAt?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface AppSettings {
  currency: string;
  defaultHourlyRate: number;
  taxRate: number;
  notifications: boolean;
  biometricLock: boolean;
  invoicePrefix: string;
  exchangeRates: { [key: string]: number };
  lastExchangeRateUpdate: string;
  defaultBillingType?: 'hourly' | 'fixed' | 'ask';
  invoiceDueDateWindow?: '7' | '15' | '30';
  defaultInvoiceNotes?: string;
  timeTrackingEnabled?: boolean;
  timeFormat?: '12h' | '24h';
  timeIncrement?: '15m' | '30m' | '1h';
  remindToLogTime?: boolean;
  remindTime?: 'Morning' | 'Evening' | 'Every 2 hours';
  autoStopTimer?: boolean;
  autoStopTimeHours?: number;
  themeMode?: 'light' | 'dark' | 'auto';
  upcomingInvoiceReminders?: boolean;
  timeLoggingReminders?: boolean;
  paymentConfirmations?: boolean;
  autoBackup?: boolean;
}

const STORAGE_KEYS = {
  CLIENTS: 'clients',
  PROJECTS: 'projects',
  TASKS: 'tasks',
  TIME_LOGS: 'timeLogs',
  INVOICES: 'invoices',
  SETTINGS: 'settings',
  ONBOARDING: 'onboardingCompleted',
};

// Generic storage functions
export const saveData = async <T>(key: string, data: T[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
    console.log(`Saved ${data.length} items to ${key}`);
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
    throw error;
  }
};

export const loadData = async <T>(key: string): Promise<T[]> => {
  try {
    const data = await AsyncStorage.getItem(key);
    const result = data ? JSON.parse(data) : [];
    console.log(`Loaded ${result.length} items from ${key}`);
    return result;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return [];
  }
};

// Client functions
export const saveClients = (clients: Client[]) => saveData(STORAGE_KEYS.CLIENTS, clients);
export const loadClients = () => loadData<Client>(STORAGE_KEYS.CLIENTS);

// Project functions
export const saveProjects = (projects: Project[]) => saveData(STORAGE_KEYS.PROJECTS, projects);
export const loadProjects = () => loadData<Project>(STORAGE_KEYS.PROJECTS);

// Task functions
export const saveTasks = (tasks: Task[]) => saveData(STORAGE_KEYS.TASKS, tasks);
export const loadTasks = () => loadData<Task>(STORAGE_KEYS.TASKS);

// Time log functions
export const saveTimeLogs = (timeLogs: TimeLog[]) => saveData(STORAGE_KEYS.TIME_LOGS, timeLogs);
export const loadTimeLogs = () => loadData<TimeLog>(STORAGE_KEYS.TIME_LOGS);

// Invoice functions
export const saveInvoices = (invoices: Invoice[]) => saveData(STORAGE_KEYS.INVOICES, invoices);
export const loadInvoices = () => loadData<Invoice>(STORAGE_KEYS.INVOICES);

// Settings functions
export const saveSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    console.log('Settings saved successfully');
  } catch (error) {
    console.error('Error saving settings:', error);
    throw error;
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
    const defaultSettings: AppSettings = {
      currency: 'USD',
      defaultHourlyRate: 50,
      taxRate: 0,
      notifications: true,
      biometricLock: false,
      invoicePrefix: 'INV',
      exchangeRates: {},
      lastExchangeRateUpdate: '',
      defaultBillingType: 'hourly',
      invoiceDueDateWindow: '30',
      defaultInvoiceNotes: 'Thank you for your business!',
      timeTrackingEnabled: true,
      timeFormat: '24h',
      timeIncrement: '15m',
      remindToLogTime: false,
      remindTime: 'Evening',
      autoStopTimer: false,
      autoStopTimeHours: 8,
      themeMode: 'auto',
      upcomingInvoiceReminders: true,
      timeLoggingReminders: false,
      paymentConfirmations: true,
      autoBackup: false,
    };
    
    const result = data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    console.log('Settings loaded successfully');
    return result;
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      currency: 'USD',
      defaultHourlyRate: 50,
      taxRate: 0,
      notifications: true,
      biometricLock: false,
      invoicePrefix: 'INV',
      exchangeRates: {},
      lastExchangeRateUpdate: '',
      defaultBillingType: 'hourly',
      invoiceDueDateWindow: '30',
      defaultInvoiceNotes: 'Thank you for your business!',
      timeTrackingEnabled: true,
      timeFormat: '24h',
      timeIncrement: '15m',
      remindToLogTime: false,
      remindTime: 'Evening',
      autoStopTimer: false,
      autoStopTimeHours: 8,
      themeMode: 'auto',
      upcomingInvoiceReminders: true,
      timeLoggingReminders: false,
      paymentConfirmations: true,
      autoBackup: false,
    };
  }
};

// Onboarding functions
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING, 'true');
    console.log('Onboarding completed');
  } catch (error) {
    console.error('Error saving onboarding status:', error);
  }
};

export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING);
    return completed === 'true';
  } catch (error) {
    console.error('Error loading onboarding status:', error);
    return false;
  }
};

// Utility functions
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Exchange rate functions
export const fetchExchangeRates = async (baseCurrency: string = 'USD'): Promise<{ [key: string]: number }> => {
  try {
    console.log('Fetching exchange rates for', baseCurrency);
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    const data = await response.json();
    console.log('Exchange rates fetched successfully');
    return data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {};
  }
};

export const updateExchangeRates = async (settings: AppSettings): Promise<AppSettings> => {
  try {
    const rates = await fetchExchangeRates(settings.currency);
    const updatedSettings = {
      ...settings,
      exchangeRates: rates,
      lastExchangeRateUpdate: new Date().toISOString(),
    };
    await saveSettings(updatedSettings);
    console.log('Exchange rates updated successfully');
    return updatedSettings;
  } catch (error) {
    console.error('Error updating exchange rates:', error);
    return settings;
  }
};

// Generate invoice number
export const generateInvoiceNumber = (prefix: string = 'INV'): string => {
  const timestamp = Date.now().toString().slice(-8);
  return `${prefix}-${timestamp}`;
};