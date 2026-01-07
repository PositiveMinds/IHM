/**
 * Offline Module
 * Handles offline functionality and data synchronization
 */

class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = [];
    this.syncQueue = [];
    this.init();
  }

  init() {
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());

    // Periodic sync check
    setInterval(() => this.syncData(), 30000);
  }

  handleOnline() {
    if (!this.isOnline) {
      this.isOnline = true;
      console.log('App is online');
      notifications.showToast('You are back online', 'success');
      this.syncData();
      this.notifyListeners();
    }
  }

  handleOffline() {
    if (this.isOnline) {
      this.isOnline = true;
      console.log('App is offline');
      notifications.showToast('You are offline. Changes will sync when online.', 'warning');
      this.notifyListeners();
    }
  }

  async queueAction(action) {
    try {
      await storage.addOfflineAction({
        action,
        timestamp: Date.now()
      });

      // Try to execute immediately if online
      if (this.isOnline) {
        await this.syncData();
      }
    } catch (error) {
      console.error('Queue action error:', error);
    }
  }

  async syncData() {
    if (!this.isOnline) return;

    try {
      const actions = await storage.getOfflineActions();

      if (actions.length === 0) return;

      console.log(`Syncing ${actions.length} offline actions`);

      for (const item of actions) {
        try {
          const { action } = item;

          // Execute action based on type
          switch (action.type) {
            case 'POST':
              await api.post(action.endpoint, action.data);
              break;
            case 'PUT':
              await api.put(action.endpoint, action.data);
              break;
            case 'DELETE':
              await api.delete(action.endpoint);
              break;
            default:
              console.warn('Unknown action type:', action.type);
          }

          // Remove from queue after successful sync
          await storage.clearOfflineAction(item.id);
          console.log('Synced action:', action.type, action.endpoint);
        } catch (error) {
          console.error('Sync action error:', error);
        }
      }

      notifications.showToast('Data synchronized', 'success', 2000);
    } catch (error) {
      console.error('Sync error:', error);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.isOnline));
  }

  isOnlineStatus() {
    return this.isOnline;
  }
}

// Global offline manager instance
const offline = new OfflineManager();
