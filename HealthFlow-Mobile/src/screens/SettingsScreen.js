import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Switch,
  TextInput,
} from 'react-native';
import { authService } from '../services/authService';

export default function SettingsScreen({ navigation }) {
  const [userData, setUserData] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailAlerts: true,
    analysisUpdates: true,
  });
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const user = await authService.getUserData();
    setUserData(user);
    setFormData({
      email: user?.email || '',
      phone: '',
    });

    const facility = await authService.getSelectedFacility();
    setSelectedFacility(facility);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel' },
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

  const handleChangeFacility = async (facilityId) => {
    await authService.setSelectedFacility(facilityId);
    setSelectedFacility(facilityId);
    Alert.alert('Success', 'Facility changed');
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{userData?.email || 'N/A'}</Text>
          </View>
          <View style={styles.divider} />

          {userData?.decoded && (
            <>
              <View style={styles.cardRow}>
                <Text style={styles.label}>Role</Text>
                <Text style={styles.value}>{userData.decoded.role || 'User'}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          <TouchableOpacity
            style={styles.cardButton}
            onPress={() => setEditing(!editing)}
          >
            <Text style={styles.cardButtonText}>
              {editing ? 'Cancel' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {editing && (
          <View style={styles.editForm}>
            <Text style={styles.label}>Phone</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Facility Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Facilities</Text>

        {userData?.facilities && userData.facilities.length > 0 ? (
          <View style={styles.card}>
            {userData.facilities.map((facility, index) => (
              <React.Fragment key={facility.facility_id}>
                <TouchableOpacity
                  style={styles.facilityItem}
                  onPress={() => handleChangeFacility(facility.facility_id)}
                >
                  <View style={styles.facilityInfo}>
                    <Text style={styles.facilityName}>{facility.facility_id}</Text>
                    <Text style={styles.facilityRole}>{facility.role}</Text>
                  </View>
                  {selectedFacility === facility.facility_id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
                {index < userData.facilities.length - 1 && (
                  <View style={styles.divider} />
                )}
              </React.Fragment>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No facilities assigned</Text>
        )}
      </View>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.card}>
          <View style={styles.notificationRow}>
            <View>
              <Text style={styles.notificationLabel}>Push Notifications</Text>
              <Text style={styles.notificationDesc}>Receive alerts on your device</Text>
            </View>
            <Switch
              value={notifications.pushNotifications}
              onValueChange={(value) =>
                setNotifications({ ...notifications, pushNotifications: value })
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.notificationRow}>
            <View>
              <Text style={styles.notificationLabel}>Email Alerts</Text>
              <Text style={styles.notificationDesc}>Receive email notifications</Text>
            </View>
            <Switch
              value={notifications.emailAlerts}
              onValueChange={(value) =>
                setNotifications({ ...notifications, emailAlerts: value })
              }
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.notificationRow}>
            <View>
              <Text style={styles.notificationLabel}>Analysis Updates</Text>
              <Text style={styles.notificationDesc}>Get notified of AI analysis results</Text>
            </View>
            <Switch
              value={notifications.analysisUpdates}
              onValueChange={(value) =>
                setNotifications({ ...notifications, analysisUpdates: value })
              }
            />
          </View>
        </View>
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.label}>App Version</Text>
            <Text style={styles.value}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.cardRow}>
            <Text style={styles.label}>Build</Text>
            <Text style={styles.value}>001</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.spacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginVertical: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  value: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  cardButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  cardButtonText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '600',
  },
  editForm: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  facilityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  facilityInfo: {
    flex: 1,
  },
  facilityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  facilityRole: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  checkmark: {
    fontSize: 18,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  notificationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    color: '#7f8c8d',
    paddingVertical: 20,
  },
  spacing: {
    height: 20,
  },
});
