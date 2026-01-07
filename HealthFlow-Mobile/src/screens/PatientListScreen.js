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
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { authService } from '../services/authService';

export default function PatientListScreen({ navigation }) {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      loadPatients();
    }, [])
  );

  const loadPatients = async () => {
    setLoading(true);
    try {
      const facility = await authService.getSelectedFacility();
      const response = await api.get(`/patients/${facility}`);
      setPatients(response.data.patients || []);
      setFilteredPatients(response.data.patients || []);
    } catch (error) {
      console.error('Error loading patients:', error);
      Alert.alert('Error', 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text.trim() === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(text.toLowerCase()) ||
          patient.id.toLowerCase().includes(text.toLowerCase()) ||
          patient.email.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      onPress={() => navigation.navigate('PatientDetail', { patientId: item.id })}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.patientName}>{item.name}</Text>
          <Text style={styles.patientId}>ID: {item.id}</Text>
        </View>
        <Text
          style={[
            styles.statusBadge,
            item.status === 'active' && styles.statusActive,
            item.status === 'inactive' && styles.statusInactive,
            item.status === 'critical' && styles.statusCritical,
          ]}
        >
          {item.status?.toUpperCase()}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.patientInfo}>Age: {item.age}</Text>
        <Text style={styles.patientInfo}>Email: {item.email}</Text>
        <Text style={styles.patientInfo}>Phone: {item.phone}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.lastVisit}>Last Visit: {item.lastVisit || 'N/A'}</Text>
        <Text style={styles.chevron}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, or email..."
          placeholderTextColor="#999"
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatientCard}
        contentContainerStyle={styles.listContent}
        onEndReached={loadPatients}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No patients found</Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('PatientDetail', { patientId: null })}
      >
        <Text style={styles.addButtonText}>+ New Patient</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  patientId: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#ecf0f1',
    color: '#34495e',
  },
  statusActive: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusInactive: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  statusCritical: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  patientInfo: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  lastVisit: {
    fontSize: 11,
    color: '#7f8c8d',
  },
  chevron: {
    fontSize: 18,
    color: '#0066cc',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});
