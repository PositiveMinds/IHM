import { Injectable } from '@angular/core';
import axios, { AxiosInstance } from 'axios';
import { environment } from '@environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiClient: AxiosInstance;

  constructor(private authService: AuthService) {
    this.apiClient = axios.create({
      baseURL: environment.backendUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to all requests
    this.apiClient.interceptors.request.use(async (config) => {
      const token = await this.authService.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle response errors
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout
          this.authService.logout();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.apiClient.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.apiClient.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.apiClient.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.apiClient.delete<T>(url, config);
    return response.data;
  }
}
