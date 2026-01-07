import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import api from '../services/api';
import { authService } from '../services/authService';
import { n8nService } from '../services/n8nService';

export default function AnalysisScreen({ route }) {
  const { patientData: initialPatientData, patientId } = route.params || {};
  const [patientData, setPatientData] = useState(initialPatientData || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [workflowId, setWorkflowId] = useState(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    // If we have a workflow ID, check its status periodically
    if (workflowId) {
      const interval = setInterval(checkAnalysisStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [workflowId]);

  const handleAnalyze = async () => {
    if (!patientData.trim()) {
      Alert.alert('Error', 'Please enter patient data');
      return;
    }

    setLoading(true);
    try {
      const facility = await authService.getSelectedFacility();

      // Try n8n first, fallback to backend
      const n8nResult = await n8nService.triggerAnalysis(
        JSON.parse(patientData),
        facility
      );

      if (n8nResult.success) {
        setWorkflowId(n8nResult.workflowId);
        Alert.alert('Success', 'Analysis started. Checking status...');
      } else {
        // Fallback to direct backend analysis
        const response = await api.post('/analyze', {
          facilityId: facility,
          patientData: patientData,
        });

        setResult(response.data);
        Alert.alert('Success', 'Analysis completed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const checkAnalysisStatus = async () => {
    if (!workflowId) return;

    setChecking(true);
    try {
      const status = await n8nService.checkAnalysisStatus(workflowId);

      if (status.status === 'success' && status.data) {
        setResult(status.data);
        setWorkflowId(null);
        Alert.alert('Success', 'Analysis completed');
      } else if (status.status === 'error') {
        setWorkflowId(null);
        Alert.alert('Error', status.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Status check error:', error);
    } finally {
      setChecking(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>AI Patient Analysis</Text>
        <Text style={styles.subtitle}>
          Enter patient data for AI-powered analysis using n8n
        </Text>

        <View style={styles.form}>
          <Text style={styles.label}>Patient Data</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter patient symptoms, history, or test results..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={8}
            value={patientData}
            onChangeText={setPatientData}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.analyzeButton, (loading || checking) && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={loading || checking}
          >
            {loading || checking ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.analyzeButtonText}>
                {workflowId ? 'Checking Status...' : 'Analyze with AI'}
              </Text>
            )}
          </TouchableOpacity>

          {workflowId && (
            <View style={styles.statusSection}>
              <Text style={styles.statusLabel}>Analysis in Progress...</Text>
              <Text style={styles.statusText}>Workflow ID: {workflowId}</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setWorkflowId(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {result && (
          <View style={styles.resultSection}>
            <Text style={styles.resultTitle}>Analysis Result</Text>
            <View style={styles.resultCard}>
              <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setResult(null);
                setPatientData('');
              }}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    minHeight: 120,
    color: '#2c3e50',
    textAlignVertical: 'top',
    marginBottom: 16,
    fontSize: 14,
  },
  analyzeButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  analyzeButtonDisabled: {
    opacity: 0.6,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  resultCard: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  resultText: {
    fontSize: 12,
    color: '#2c3e50',
    lineHeight: 18,
  },
  clearButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statusSection: {
    backgroundColor: '#e8f4f8',
    borderWidth: 1,
    borderColor: '#0066cc',
    borderRadius: 6,
    padding: 12,
    marginTop: 12,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066cc',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#2c3e50',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  });
