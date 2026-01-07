import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { authService } from '../services/authService';
import api from '../services/api';

export default function DashboardScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const user = await authService.getUserData();
      setUserData(user);

      const facility = await authService.getSelectedFacility();
      setSelectedFacility(facility || user?.facilities[0]?.facility_id);

      // Fetch dashboard data from backend
      const response = await api.get(`/dashboard/${facility}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setDashboardData(response.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      Alert.alert('Error', 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityChange = async (facilityId) => {
    await authService.setSelectedFacility(facilityId);
    setSelectedFacility(facilityId);
    loadData();
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: async () => {
          await authService.logout();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userEmail}>{userData?.email}</Text>
        </View>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Facility Selector */}
      {userData?.facilities && userData.facilities.length > 1 && (
        <View style={styles.facilitySection}>
          <Text style={styles.sectionTitle}>Select Facility</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.facilityList}
          >
            {userData.facilities.map((facility) => (
              <TouchableOpacity
                key={facility.facility_id}
                style={[
                  styles.facilityButton,
                  selectedFacility === facility.facility_id &&
                    styles.facilityButtonActive,
                ]}
                onPress={() => handleFacilityChange(facility.facility_id)}
              >
                <Text
                  style={[
                    styles.facilityButtonText,
                    selectedFacility === facility.facility_id &&
                      styles.facilityButtonTextActive,
                  ]}
                >
                  {facility.facility_id}
                </Text>
                <Text
                  style={[
                    styles.facilityRole,
                    selectedFacility === facility.facility_id &&
                      styles.facilityRoleActive,
                  ]}
                >
                  {facility.role}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Dashboard Cards */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Dashboard</Text>

        {dashboardData && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Total Patients</Text>
              <Text style={styles.cardValue}>
                {dashboardData.totalPatients || 0}
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardLabel}>Active Cases</Text>
              <Text style={styles.cardValue}>
                {dashboardData.activeCases || 0}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('PatientList')}
            >
              <Text style={styles.actionButtonText}>View All Patients</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => navigation.navigate('Analysis')}
            >
              <Text style={styles.actionButtonText}>AI Analysis</Text>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  facilitySection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  facilityList: {
    flexDirection: 'row',
  },
  facilityButton: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 100,
  },
  facilityButtonActive: {
    backgroundColor: '#0066cc',
  },
  facilityButtonText: {
    color: '#2c3e50',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  facilityButtonTextActive: {
    color: '#fff',
  },
  facilityRole: {
    color: '#7f8c8d',
    fontSize: 10,
  },
  facilityRoleActive: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardsSection: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
  },
  cardLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  actionButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: '#27ae60',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
