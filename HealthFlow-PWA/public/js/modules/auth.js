/**
 * Authentication Module
 * Handles user authentication, token management, and session
 */

class AuthManager {
  constructor() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;
    this.listeners = [];
    this.init();
  }

  init() {
    this.restoreSession();
  }

  restoreSession() {
    const token = storage.getItem('authToken');
    const user = storage.getItem('currentUser');

    if (token && this.isTokenValid(token)) {
      this.token = token;
      this.user = user;
      this.isAuthenticated = true;
    } else {
      this.clearSession();
    }
  }

  isTokenValid(token) {
    if (!token) return false;

    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = decoded.exp * 1000;
      return expirationTime > Date.now();
    } catch (error) {
      return false;
    }
  }

  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.token && response.user) {
        this.token = response.token;
        this.user = response.user;
        this.isAuthenticated = true;

        // Store credentials
        storage.setItem('authToken', response.token);
        storage.setItem('currentUser', response.user);

        // Cache user data
        await storage.cacheData('user_' + response.user.id, response.user);

        this.notifyListeners();
        return { success: true, user: response.user };
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  }

  async logout() {
    try {
      // Attempt to notify server
      await api.post('/auth/logout', {});
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    this.clearSession();
  }

  clearSession() {
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;

    // Clear stored data
    storage.removeItem('authToken');
    storage.removeItem('currentUser');

    this.notifyListeners();
  }

  getToken() {
    return this.token;
  }

  getUser() {
    return this.user;
  }

  setToken(token) {
    if (this.isTokenValid(token)) {
      this.token = token;
      storage.setItem('authToken', token);
    }
  }

  decodeToken() {
    if (!this.token) return null;

    try {
      const base64Url = this.token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Token decode error:', error);
      return null;
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.isAuthenticated));
  }
}

// Global auth instance
const auth = new AuthManager();
