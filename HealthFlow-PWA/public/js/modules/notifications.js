/**
 * Notifications Module
 * Handles push notifications and in-app notifications
 */

class NotificationManager {
  constructor() {
    this.supported = 'Notification' in window;
    this.permission = 'default';
    this.init();
  }

  async init() {
    if (!this.supported) {
      console.warn('Notifications not supported');
      return;
    }

    this.permission = Notification.permission;

    if ('serviceWorker' in navigator && 'PushManager' in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        this.registration = registration;
        console.log('Service Worker ready for notifications');
      } catch (error) {
        console.error('Service Worker not ready:', error);
      }
    }
  }

  async requestPermission() {
    if (!this.supported) return false;

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Permission request error:', error);
      return false;
    }
  }

  async subscribe() {
    if (!this.registration || !('pushManager' in this.registration)) {
      console.warn('Push notifications not available');
      return null;
    }

    try {
      const permission = await this.requestPermission();
      if (!permission) return null;

      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'YOUR_PUBLIC_VAPID_KEY'
        )
      });

      // Send subscription to server
      await api.post('/notifications/subscribe', {
        subscription: subscription.toJSON()
      });

      return subscription;
    } catch (error) {
      console.error('Push subscription error:', error);
      return null;
    }
  }

  showNotification(title, options = {}) {
    if (!this.supported || this.permission !== 'granted') {
      console.warn('Cannot show notification');
      return;
    }

    const defaultOptions = {
      icon: '/images/icon-192x192.png',
      badge: '/images/badge-72x72.png',
      tag: 'notification',
      requireInteraction: false,
      ...options
    };

    if (this.registration) {
      this.registration.showNotification(title, defaultOptions);
    } else {
      new Notification(title, defaultOptions);
    }
  }

  showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in-out';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  showAlert(message, type = 'info', duration = 0) {
    const root = document.getElementById('root');
    if (!root) return;

    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.innerHTML = `
      <div class="alert-title">${this.getAlertTitle(type)}</div>
      <p>${message}</p>
    `;

    const alertContainer = document.createElement('div');
    alertContainer.style.cssText = 'position: fixed; top: 20px; left: 20px; right: 20px; z-index: 1500;';
    alertContainer.appendChild(alert);
    document.body.appendChild(alertContainer);

    if (duration > 0) {
      setTimeout(() => {
        alertContainer.remove();
      }, duration);
    }

    return alertContainer;
  }

  getAlertTitle(type) {
    const titles = {
      primary: 'Info',
      success: 'Success',
      danger: 'Error',
      warning: 'Warning'
    };
    return titles[type] || 'Alert';
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Global notification instance
const notifications = new NotificationManager();
