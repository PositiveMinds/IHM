import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import api from '../services/api';
import { authService } from '../services/authService';

export default function PatientDetailScreen({ route, navigation }) {
  const { patientId } = route.params || {};
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(patientId ? true : false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    phone: '',
    status: 'active',
    medicalHistory: '',
    allergies: '',
    medications: '',
  });

  useEffect(() => {
    if (patientId) {
      loadPatient();
    }
  }, [patientId]);

  const loadPatient = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/patient/${patientId}`);
      setPatient(response.data.patient);
      setFormData(response.data.patient);
    } catch (error) {
      console.error('Error loading patient:', error);
      Alert.alert('Error', 'Failed to load patient');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Patient name is required');
      return;
    }

    setSaving(true);
    try {
      const facility = await authService.getSelectedFacility();

      if (patientId) {
        await api.put(`/patient/${patientId}`, {
          facilityId: facility,
          ...formData,
        });
        Alert.alert('Success', 'Patient updated');
      } else {
        await api.post('/patient', {
          facilityId: facility,
          ...formData,
        });
        Alert.alert('Success', 'Patient created');
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving patient:', error);
      Alert.alert('Error', 'Failed to save patient');
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyze = async () => {
    navigation.navigate('Analysis', {
      patientData: JSON.stringify(formData),
      patientId: patientId,
    });
  };

  const handleDelete = async () => {
    if (!patientId) return;

    Alert.alert('Delete Patient', 'Are you sure you want to delete this patient?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await api.delete(`/patient/${patientId}`);
            Alert.alert('Success', 'Patient deleted');
            navigation.goBack();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete patient');
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Patient Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient name"
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          editable={!saving}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter age"
          value={formData.age?.toString()}
          onChangeText={(text) => setFormData({ ...formData, age: text })}
          keyboardType="numeric"
          editable={!saving}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          editable={!saving}
        />

        <Text style={styles.label}>Phone</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          keyboardType="phone-pad"
          editable={!saving}
        />

        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          {['active', 'inactive', 'critical'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.statusButton,
                formData.status === status && styles.statusButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, status })}
              disabled={saving}
            >
              <Text
                style={[
                  styles.statusButtonText,
                  formData.status === status && styles.statusButtonTextActive,
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Medical History</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter medical history"
          value={formData.medicalHistory}
          onChangeText={(text) => setFormData({ ...formData, medicalHistory: text })}
          multiline
          numberOfLines={4}
          editable={!saving}
        />

        <Text style={styles.label}>Allergies</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter known allergies"
          value={formData.allergies}
          onChangeText={(text) => setFormData({ ...formData, allergies: text })}
          multiline
          numberOfLines={3}
          editable={!saving}
        />

        <Text style={styles.label}>Medications</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter current medications"
          value={formData.medications}
          onChangeText={(text) => setFormData({ ...formData, medications: text })}
          multiline
          numberOfLines={3}
          editable={!saving}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Patient</Text>
          )}
        </TouchableOpacity>

        {patientId && (
          <>
            <TouchableOpacity
              style={[styles.analyzeButton, styles.marginTop]}
              onPress={handleAnalyze}
              disabled={saving}
            >
              <Text style={styles.buttonText}>Analyze with AI</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.deleteButton, styles.marginTop]}
              onPress={handleDelete}
              disabled={saving}
            >
              <Text style={styles.buttonText}>Delete Patient</Text>
            </TouchableOpacity>
          </>
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
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  textArea: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#0066cc',
    borderColor: '#0066cc',
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7f8c8d',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  analyzeButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  marginTop: {
    marginTop: 12,
  },
});
