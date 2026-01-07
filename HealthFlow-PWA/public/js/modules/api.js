/**
 * API Module
 * Handles HTTP requests with authentication and error handling
 */

class APIManager {
  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'http://localhost:3000/api';
    this.timeout = 30000;
    this.requestInterceptors = [];
    this.responseInterceptors = [];
  }

  async request(method, endpoint, data = null, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      timeout: options.timeout || this.timeout,
      ...options
    };

    // Add authentication token
    if (auth.isAuthenticated) {
      config.headers['Authorization'] = `Bearer ${auth.getToken()}`;
    }

    // Add request body for non-GET requests
    if (method !== 'GET' && data) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token expired or invalid
        auth.clearSession();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const responseData = await response.json();

      // Cache successful GET requests
      if (method === 'GET' && response.ok) {
        await storage.cacheData(`api_${endpoint}`, responseData, 300000);
      }

      return responseData;
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);

      // Try to return cached data on network error
      if (method === 'GET' && !navigator.onLine) {
        const cached = await storage.getCachedData(`api_${endpoint}`);
        if (cached) {
          console.log('Returning cached data for:', endpoint);
          return cached;
        }
      }

      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request('GET', endpoint, null, options);
  }

  post(endpoint, data, options = {}) {
    return this.request('POST', endpoint, data, options);
  }

  put(endpoint, data, options = {}) {
    return this.request('PUT', endpoint, data, options);
  }

  patch(endpoint, data, options = {}) {
    return this.request('PATCH', endpoint, data, options);
  }

  delete(endpoint, options = {}) {
    return this.request('DELETE', endpoint, null, options);
  }

  // Batch requests
  async batch(requests) {
    try {
      const promises = requests.map((req) => this.request(req.method, req.endpoint, req.data));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Batch request error:', error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(endpoint, file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable && onProgress) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${this.baseURL}${endpoint}`);
      if (auth.isAuthenticated) {
        xhr.setRequestHeader('Authorization', `Bearer ${auth.getToken()}`);
      }
      xhr.send(formData);
    });
  }

  setBaseURL(url) {
    this.baseURL = url;
  }

  setTimeout(timeout) {
    this.timeout = timeout;
  }
}

// Global API instance
const api = new APIManager();
