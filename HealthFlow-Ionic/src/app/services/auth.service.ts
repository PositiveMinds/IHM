import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import axios, { AxiosInstance } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { environment } from '@environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  email: string;
  facilities: Facility[];
}

export interface Facility {
  facility_id: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiClient: AxiosInstance;
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.apiClient = axios.create({
      baseURL: environment.backendUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.apiClient.interceptors.request.use((config) => {
      this.getAuthToken().then((token) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      });
      return config;
    });
  }

  async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const response = await this.apiClient.post<any>('/auth/login', {
        email,
        password,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Invalid credentials');
      }

      const { token, facilities, user } = response.data;

      // Store token and user data securely
      await Preferences.set({ key: 'authToken', value: token });
      await Preferences.set({ key: 'userEmail', value: user.email });
      await Preferences.set({
        key: 'facilities',
        value: JSON.stringify(facilities),
      });
      await Preferences.set({
        key: 'selectedFacility',
        value: facilities[0].facility_id,
      });

      const userData = { email: user.email, facilities };
      this.userSubject.next(userData);
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getAuthToken(): Promise<string | null> {
    try {
      const result = await Preferences.get({ key: 'authToken' });
      return result.value;
    } catch (error) {
      console.error('Error retrieving auth token:', error);
      return null;
    }
  }

  async getUserData(): Promise<User | null> {
    try {
      const token = await this.getAuthToken();
      if (!token) return null;

      const decoded = jwtDecode(token);
      const emailResult = await Preferences.get({ key: 'userEmail' });
      const facilitiesResult = await Preferences.get({ key: 'facilities' });

      const userData = {
        email: emailResult.value || '',
        facilities: facilitiesResult.value ? JSON.parse(facilitiesResult.value) : [],
      };

      this.userSubject.next(userData);
      return userData;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await Preferences.remove({ key: 'authToken' });
      await Preferences.remove({ key: 'userEmail' });
      await Preferences.remove({ key: 'facilities' });
      await Preferences.remove({ key: 'selectedFacility' });
      this.userSubject.next(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async setSelectedFacility(facilityId: string): Promise<void> {
    try {
      await Preferences.set({ key: 'selectedFacility', value: facilityId });
    } catch (error) {
      console.error('Error setting facility:', error);
    }
  }

  async getSelectedFacility(): Promise<string | null> {
    try {
      const result = await Preferences.get({ key: 'selectedFacility' });
      return result.value;
    } catch (error) {
      console.error('Error getting facility:', error);
      return null;
    }
  }

  isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  async initializeAuth(): Promise<string | null> {
    let userToken = null;
    try {
      userToken = await this.getAuthToken();

      // Verify token is still valid
      if (userToken && !this.isTokenValid(userToken)) {
        await this.logout();
        userToken = null;
      } else if (userToken) {
        await this.getUserData();
      }
    } catch (error) {
      console.error('Failed to restore token:', error);
    }

    return userToken;
  }
}
