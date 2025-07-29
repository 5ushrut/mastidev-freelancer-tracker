import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Switch } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { loadProjects, saveProjects, loadClients, loadTasks, saveTasks, loadTimeLogs, saveTimeLogs, generateId, Project, Client, Task, TimeLog } from '../../utils/storage';
import { Picker } from '@react-native-picker/picker';
import * as DocumentPicker from 'expo-document-picker';
import Icon from '../Icon';
import Button from '../Button';

export default function ProjectsTab() {
  const { theme, isDark } = useTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showClientPicker, setShowClientPicker] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTimer, setActiveTimer] = useState<{ projectId: string; startTime: Date } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    status: 'active' as 'active' | 'completed' | 'paused',
    projectType: 'hourly' as 'hourly' | 'fixed',
    hourlyRate: 50,
    fixedBudget: 0,
    currency: 'USD',
    description: '',
    tags: [] as string[],
    deliverables: [] as string[],
    timeTrackingEnabled: true,
    attachments: [] as string[],
    privateNotes: '',
  });

  const [newTag, setNewTag] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');

  useEffect(() => {
    loadProjectsData();
  }, []);

  const loadProjectsData = async () => {
    try {
      const [projectsData, clientsData, tasksData, timeLogsData] = await Promise.all([
        loadProjects(),
        loadClients(),
        loadTasks(),
        loadTimeLogs(),
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setTasks(tasksData);
      setTimeLogs(timeLogsData);
      console.log('Loaded projects data:', projectsData.length);
    } catch (error) {
      console.error('Error loading projects data:', error);
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
      marginBottom: 16,
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
    projectCard: {
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    projectHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    projectName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.text,
    },
    projectClient: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 4,
    },
    projectDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    projectStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    projectStat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
    },
    statLabel: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    statusText: {
      fontSize: 12,
      fontWeight: '500',
    },
    timerButton: {
      backgroundColor: theme.success,
      borderRadius: 20,
      width: 40,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerButtonActive: {
      backgroundColor: theme.error,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.backgroundAlt,
      borderRadius: 2,
      marginTop: 8,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: 2,
    },
    projectActions: {
      flexDirection: 'row',
      gap: 8,
      marginTop: 8,
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
    statusButton: {
      backgroundColor: theme.warning,
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
    tagContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    tag: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    tagText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
    },
    addTagContainer: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'center',
    },
    addTagInput: {
      flex: 1,
      backgroundColor: theme.backgroundAlt,
      borderWidth: 1,
      borderColor: isDark ? theme.border : '#D1D5DB',
      borderRadius: 8,
      padding: 8,
      fontSize: 14,
      color: theme.text,
    },
    addTagButton: {
      backgroundColor: theme.primary,
      borderRadius: 6,
      padding: 8,
    },
    deliverableItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    deliverableText: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
    },
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    switchLabel: {
      fontSize: 16,
      color: theme.text,
      flex: 1,
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
    saveButton: {
      backgroundColor: theme.primary,
    },
    startButton: {
      backgroundColor: theme.success,
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontWeight: '600',
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
      case 'active':
        return theme.success;
      case 'completed':
        return theme.primary;
      case 'paused':
        return theme.warning;
      default:
        return theme.textMuted;
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      name: '',
      clientId: '',
      startDate: new Date().toISOString().split('T')[0],
      deadline: '',
      status: 'active',
      projectType: 'hourly',
      hourlyRate: 50,
      fixedBudget: 0,
      currency: 'USD',
      description: '',
      tags: [],
      deliverables: [],
      timeTrackingEnabled: true,
      attachments: [],
      privateNotes: '',
    });
    setNewTag('');
    setNewDeliverable('');
    setEditingProject(null);
  };

  const handleSaveProject = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }

    if (!formData.clientId) {
      Alert.alert('Error', 'Please select a client');
      return;
    }

    try {
      let updatedProjects;
      
      if (editingProject) {
        // Update existing project
        updatedProjects = projects.map(project =>
          project.id === editingProject.id
            ? { ...project, ...formData }
            : project
        );
        console.log('Updating project:', editingProject.id);
      } else {
        // Add new project
        const newProject: Project = {
          id: generateId(),
          ...formData,
          createdAt: new Date().toISOString(),
        };
        updatedProjects = [...projects, newProject];
        console.log('Adding new project:', newProject.id);
      }

      await saveProjects(updatedProjects);
      setProjects(updatedProjects);
      setShowCreateModal(false);
      setShowEditModal(false);
      resetForm();

      Alert.alert('Success', `✨ Project ${editingProject ? 'updated' : 'added'} successfully!`);
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'Failed to save project');
    }
  };

  const handleEditProject = (project: Project) => {
    setFormData({
      name: project.name,
      clientId: project.clientId,
      startDate: project.startDate,
      deadline: project.deadline || '',
      status: project.status,
      projectType: project.projectType,
      hourlyRate: project.hourlyRate,
      fixedBudget: project.fixedBudget || 0,
      currency: project.currency,
      description: project.description,
      tags: project.tags,
      deliverables: project.deliverables,
      timeTrackingEnabled: project.timeTrackingEnabled,
      attachments: project.attachments || [],
      privateNotes: project.privateNotes || '',
    });
    setEditingProject(project);
    setShowEditModal(true);
    console.log('Editing project:', project.id);
  };

  const handleDeleteProject = (project: Project) => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Deleting project:', project.id);
              const updatedProjects = projects.filter(p => p.id !== project.id);
              await saveProjects(updatedProjects);
              setProjects(updatedProjects);
              Alert.alert('Success', 'Project deleted successfully');
              console.log('Project deleted successfully');
            } catch (error) {
              console.error('Error deleting project:', error);
              Alert.alert('Error', 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  const handleChangeProjectStatus = async (project: Project, newStatus: 'active' | 'completed' | 'paused') => {
    try {
      const updatedProjects = projects.map(p =>
        p.id === project.id ? { ...p, status: newStatus } : p
      );
      await saveProjects(updatedProjects);
      setProjects(updatedProjects);
      Alert.alert('Success', `Project status changed to ${newStatus}!`);
      console.log('Project status changed:', project.id, 'New status:', newStatus);
    } catch (error) {
      console.error('Error changing project status:', error);
      Alert.alert('Error', 'Failed to update project status');
    }
  };

  const handleToggleTimer = async (project: Project) => {
    try {
      if (activeTimer && activeTimer.projectId === project.id) {
        // Stop timer
        const duration = Math.floor((Date.now() - activeTimer.startTime.getTime()) / 60000); // minutes
        const newTimeLog: TimeLog = {
          id: generateId(),
          projectId: project.id,
          description: 'Timer session',
          startTime: activeTimer.startTime.toISOString(),
          endTime: new Date().toISOString(),
          duration,
          hourlyRate: project.hourlyRate,
          createdAt: new Date().toISOString(),
        };

        const updatedTimeLogs = [...timeLogs, newTimeLog];
        await saveTimeLogs(updatedTimeLogs);
        setTimeLogs(updatedTimeLogs);
        setActiveTimer(null);
        Alert.alert('Success', `Timer stopped. Logged ${Math.floor(duration / 60)}h ${duration % 60}m`);
      } else {
        // Start timer
        setActiveTimer({ projectId: project.id, startTime: new Date() });
        Alert.alert('Timer Started', `Timer started for ${project.name}`);
      }
    } catch (error) {
      console.error('Error toggling timer:', error);
      Alert.alert('Error', 'Failed to toggle timer');
    }
  };

  const getProjectTasks = (projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  };

  const getProjectTimeLogs = (projectId: string) => {
    return timeLogs.filter(log => log.projectId === projectId);
  };

  const getTotalHours = (projectId: string) => {
    const projectTimeLogs = getProjectTimeLogs(projectId);
    return projectTimeLogs.reduce((total, log) => total + log.duration, 0);
  };

  const getProjectProgress = (project: Project) => {
    const projectTasks = getProjectTasks(project.id);
    if (projectTasks.length === 0) return 0;
    const completedTasks = projectTasks.filter(task => task.completed).length;
    return (completedTasks / projectTasks.length) * 100;
  };

  const selectClient = (client: Client) => {
    setFormData(prev => ({ ...prev, clientId: client.id }));
    setShowClientPicker(false);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const addDeliverable = () => {
    if (newDeliverable.trim() && !formData.deliverables.includes(newDeliverable.trim())) {
      setFormData(prev => ({
        ...prev,
        deliverables: [...prev.deliverables, newDeliverable.trim()],
      }));
      setNewDeliverable('');
    }
  };

  const removeDeliverable = (deliverableToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter(deliverable => deliverable !== deliverableToRemove),
    }));
  };

  const handleUploadAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, file.name],
        }));
        Alert.alert('Success', `File "${file.name}" uploaded successfully!`);
      }
    } catch (error) {
      console.error('Error uploading attachment:', error);
      Alert.alert('Error', 'Failed to upload attachment');
    }
  };

  const selectedClient = clients.find(c => c.id === formData.clientId);

  const renderProjectForm = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* Basic Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1️⃣ Basic Info</Text>
        
        <Text style={styles.label}>Project Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          placeholder="Project name"
          placeholderTextColor={theme.textMuted}
        />

        {/* Client Selection */}
        <Text style={styles.label}>Client *</Text>
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

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              value={formData.startDate}
              onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
            />
          </View>
          <View style={styles.flex1}>
            <Text style={styles.label}>Deadline</Text>
            <TextInput
              style={styles.input}
              value={formData.deadline}
              onChangeText={(text) => setFormData(prev => ({ ...prev, deadline: text }))}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textMuted}
            />
          </View>
        </View>

        <Text style={styles.label}>Project Status</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Active" value="active" />
            <Picker.Item label="Completed" value="completed" />
            <Picker.Item label="Paused" value="paused" />
          </Picker>
        </View>
      </View>

      {/* Billing & Pricing Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2️⃣ Billing & Pricing</Text>
        
        <Text style={styles.label}>Project Type</Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.projectType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, projectType: value }))}
            style={{ color: theme.text }}
          >
            <Picker.Item label="Hourly" value="hourly" />
            <Picker.Item label="Fixed Price" value="fixed" />
          </Picker>
        </View>

        {formData.projectType === 'hourly' ? (
          <View>
            <Text style={styles.label}>Hourly Rate</Text>
            <TextInput
              style={styles.input}
              value={formData.hourlyRate.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(text) || 0 }))}
              placeholder="50"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Fixed Budget</Text>
            <TextInput
              style={styles.input}
              value={formData.fixedBudget.toString()}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fixedBudget: parseFloat(text) || 0 }))}
              placeholder="5000"
              placeholderTextColor={theme.textMuted}
              keyboardType="numeric"
            />
          </View>
        )}

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

      {/* Scope & Description Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3️⃣ Scope & Description</Text>
        
        <Text style={styles.label}>Project Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
          placeholder="Describe the project scope and objectives..."
          placeholderTextColor={theme.textMuted}
          multiline
        />

        <Text style={styles.label}>Tags</Text>
        {formData.tags.length > 0 && (
          <View style={styles.tagContainer}>
            {formData.tags.map((tag, index) => (
              <TouchableOpacity
                key={index}
                style={styles.tag}
                onPress={() => removeTag(tag)}
              >
                <Text style={styles.tagText}>{tag} ×</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.addTagContainer}>
          <TextInput
            style={styles.addTagInput}
            value={newTag}
            onChangeText={setNewTag}
            placeholder="Add tag (e.g., Design, Frontend, Urgent)"
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={addTag}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
            <Icon name="add" size={16} style={{ color: '#FFFFFF' }} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Deliverables</Text>
        {formData.deliverables.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            {formData.deliverables.map((deliverable, index) => (
              <TouchableOpacity
                key={index}
                style={styles.deliverableItem}
                onPress={() => removeDeliverable(deliverable)}
              >
                <Text style={styles.deliverableText}>• {deliverable}</Text>
                <Icon name="close" size={16} style={{ color: theme.error }} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={styles.addTagContainer}>
          <TextInput
            style={styles.addTagInput}
            value={newDeliverable}
            onChangeText={setNewDeliverable}
            placeholder="Add deliverable (e.g., Logo Mockups, API Integration)"
            placeholderTextColor={theme.textMuted}
            onSubmitEditing={addDeliverable}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={addDeliverable}>
            <Icon name="add" size={16} style={{ color: '#FFFFFF' }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Tracking Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4️⃣ Time Tracking</Text>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable automatic time tracking integration</Text>
          <Switch
            value={formData.timeTrackingEnabled}
            onValueChange={(value) => setFormData(prev => ({ ...prev, timeTrackingEnabled: value }))}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor={formData.timeTrackingEnabled ? '#FFFFFF' : theme.textMuted}
          />
        </View>
        
        <Text style={styles.label}>Time Tracking Notes</Text>
        <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 12 }}>
          {formData.timeTrackingEnabled 
            ? 'Time tracking is enabled. You can start/stop timers and log manual time entries.'
            : 'Time tracking is disabled. You can still add manual time logs if needed.'}
        </Text>
      </View>

      {/* Attachments & Notes Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5️⃣ Attachments & Notes</Text>
        
        <Text style={styles.label}>Upload Documents</Text>
        <TouchableOpacity
          style={[styles.input, { justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8 }]}
          onPress={handleUploadAttachment}
        >
          <Icon name="cloud-upload" size={20} style={{ color: theme.primary }} />
          <Text style={{ color: theme.primary }}>Upload Files (Brief, Assets, etc.)</Text>
        </TouchableOpacity>
        
        {formData.attachments.length > 0 && (
          <View style={{ marginBottom: 12 }}>
            {formData.attachments.map((attachment, index) => (
              <View key={index} style={styles.deliverableItem}>
                <Icon name="document" size={16} style={{ color: theme.primary, marginRight: 8 }} />
                <Text style={styles.deliverableText}>{attachment}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.label}>Private Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.privateNotes}
          onChangeText={(text) => setFormData(prev => ({ ...prev, privateNotes: text }))}
          placeholder="Private notes (not sent to client)..."
          placeholderTextColor={theme.textMuted}
          multiline
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search projects..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          {(['all', 'active', 'completed', 'paused'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterTab, filterStatus === filter && styles.filterTabActive]}
              onPress={() => setFilterStatus(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filterStatus === filter && styles.filterTabTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="folder" size={48} style={[styles.emptyIcon, { color: theme.textMuted }]} />
            <Text style={styles.emptyTitle}>
              {searchQuery || filterStatus !== 'all' ? 'No projects found' : 'No projects yet'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterStatus !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Create your first project to start tracking time and tasks'}
            </Text>
          </View>
        ) : (
          filteredProjects.map((project) => {
            const client = clients.find(c => c.id === project.clientId);
            const projectTasks = getProjectTasks(project.id);
            const totalHours = getTotalHours(project.id);
            const progress = getProjectProgress(project);
            const isTimerActive = activeTimer?.projectId === project.id;

            return (
              <TouchableOpacity
                key={project.id}
                style={styles.projectCard}
                onPress={() => {
                  setSelectedProject(project);
                  setShowProjectDetail(true);
                }}
              >
                <View style={styles.projectHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectName}>{project.name}</Text>
                    <Text style={styles.projectClient}>{client?.name || 'Unknown Client'}</Text>
                    {project.description && (
                      <Text style={styles.projectDescription} numberOfLines={2}>
                        {project.description}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={[styles.timerButton, isTimerActive && styles.timerButtonActive]}
                    onPress={() => handleToggleTimer(project)}
                  >
                    <Icon
                      name={isTimerActive ? 'stop' : 'play'}
                      size={20}
                      style={{ color: '#FFFFFF' }}
                    />
                  </TouchableOpacity>
                </View>

                {/* Progress Bar */}
                {projectTasks.length > 0 && (
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${progress}%` }]} />
                  </View>
                )}

                <View style={styles.projectStats}>
                  <View style={styles.projectStat}>
                    <Text style={styles.statValue}>{projectTasks.length}</Text>
                    <Text style={styles.statLabel}>Tasks</Text>
                  </View>
                  <View style={styles.projectStat}>
                    <Text style={styles.statValue}>{Math.floor(totalHours / 60)}h {totalHours % 60}m</Text>
                    <Text style={styles.statLabel}>Logged</Text>
                  </View>
                  <View style={styles.projectStat}>
                    <Text style={styles.statValue}>{Math.round(progress)}%</Text>
                    <Text style={styles.statLabel}>Complete</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
                    <Text style={[styles.statusText, { color: '#FFFFFF' }]}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </Text>
                  </View>
                </View>

                {/* Project Actions */}
                <View style={styles.projectActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.statusButton]}
                    onPress={() => {
                      Alert.alert(
                        'Change Status',
                        'Select new project status:',
                        [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Active', onPress: () => handleChangeProjectStatus(project, 'active') },
                          { text: 'Completed', onPress: () => handleChangeProjectStatus(project, 'completed') },
                          { text: 'Paused', onPress: () => handleChangeProjectStatus(project, 'paused') },
                        ]
                      );
                    }}
                  >
                    <Icon name="swap-horizontal" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.editButton]}
                    onPress={() => handleEditProject(project)}
                  >
                    <Icon name="pencil" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.deleteButton]}
                    onPress={() => handleDeleteProject(project)}
                  >
                    <Icon name="trash" size={16} style={{ color: '#FFFFFF' }} />
                  </TouchableOpacity>
                </View>

                {/* Tags */}
                {project.tags.length > 0 && (
                  <View style={[styles.tagContainer, { marginTop: 8 }]}>
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={[styles.tag, { backgroundColor: theme.textMuted }]}>
                        <Text style={[styles.tagText, { fontSize: 10 }]}>{tag}</Text>
                      </View>
                    ))}
                    {project.tags.length > 3 && (
                      <View style={[styles.tag, { backgroundColor: theme.textMuted }]}>
                        <Text style={[styles.tagText, { fontSize: 10 }]}>+{project.tags.length - 3}</Text>
                      </View>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Create Project Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add New Project</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Icon name="close" size={24} style={{ color: isDark ? theme.text : '#374151' }} />
            </TouchableOpacity>
          </View>

          {renderProjectForm()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.saveButton]}
              onPress={handleSaveProject}
            >
              <Text style={styles.actionButtonText}>Save Project</Text>
            </TouchableOpacity>
            {formData.timeTrackingEnabled && (
              <TouchableOpacity
                style={[styles.actionButtonModal, styles.startButton]}
                onPress={() => {
                  handleSaveProject();
                  // Start timer logic would go here
                }}
              >
                <Text style={styles.actionButtonText}>Save & Start Timer</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Project</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowEditModal(false)}
            >
              <Icon name="close" size={24} style={{ color: isDark ? theme.text : '#374151' }} />
            </TouchableOpacity>
          </View>

          {renderProjectForm()}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.actionButtonModal, styles.saveButton]}
              onPress={handleSaveProject}
            >
              <Text style={styles.actionButtonText}>Update Project</Text>
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

      {/* Project Detail Modal */}
      <Modal
        visible={showProjectDetail}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedProject?.name}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowProjectDetail(false)}
            >
              <Icon name="close" size={24} style={{ color: isDark ? theme.text : '#374151' }} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.emptyTitle}>Project Details</Text>
            <Text style={styles.emptyText}>
              Detailed project view with tasks, time logs, and project management features will be implemented here.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}