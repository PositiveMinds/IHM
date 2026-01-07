import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const authService = {
  async loginWithEmail(email, password) {
    try {
      // Send credentials to backend to query Google Sheets
      const response = await axios.post(`${BACKEND_URL}/auth/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Invalid credentials');
      }

      const { token, facilities, user } = response.data;

      // Store token and user data securely
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('userEmail', user.email);
      await SecureStore.setItemAsync('facilities', JSON.stringify(facilities));
      await SecureStore.setItemAsync('selectedFacility', facilities[0].facility_id);

      return { token, user, facilities };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async getAuthToken() {
    try {
      return await SecureStore.getItemAsync('authToken');
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  },

  async getUserData() {
    try {
      const token = await this.getAuthToken();
      if (!token) return null;

      const decoded = jwtDecode(token);
      const email = await SecureStore.getItemAsync('userEmail');
      const facilities = JSON.parse(
        await SecureStore.getItemAsync('facilities') || '[]'
      );

      return { email, facilities, decoded };
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  async logout() {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('userEmail');
      await SecureStore.deleteItemAsync('facilities');
      await SecureStore.deleteItemAsync('selectedFacility');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  async setSelectedFacility(facilityId) {
    try {
      await SecureStore.setItemAsync('selectedFacility', facilityId);
    } catch (error) {
      console.error('Error setting facility:', error);
    }
  },

  async getSelectedFacility() {
    try {
      return await SecureStore.getItemAsync('selectedFacility');
    } catch (error) {
      console.error('Error getting facility:', error);
      return null;
    }
  },

  isTokenValid(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};
