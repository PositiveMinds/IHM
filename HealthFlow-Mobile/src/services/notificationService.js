import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Set notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const notificationService = {
  async registerForPushNotifications() {
    try {
      if (Platform.OS === 'web') {
        console.log('Notifications only work on mobile devices');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push notification permissions');
        return null;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Push notification token:', token.data);
      return token.data;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  },

  async subscribeToNotifications(callback) {
    try {
      // Handle notification when app is in foreground
      const subscription = Notifications.addNotificationReceivedListener((notification) => {
        callback({
          type: 'received',
          data: notification.request.content.data,
        });
      });

      // Handle notification when user taps on it
      const responseSubscription = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          callback({
            type: 'tapped',
            data: response.notification.request.content.data,
          });
        }
      );

      return { subscription, responseSubscription };
    } catch (error) {
      console.error('Error subscribing to notifications:', error);
      return null;
    }
  },

  unsubscribeFromNotifications(subscriptions) {
    try {
      if (subscriptions?.subscription) {
        subscriptions.subscription.remove();
      }
      if (subscriptions?.responseSubscription) {
        subscriptions.responseSubscription.remove();
      }
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  },

  async sendLocalNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          badge: 1,
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
    }
  },

  async cancelAllNotifications() {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {
      console.error('Error canceling notifications:', error);
    }
  },

  // n8n webhook notification handler
  async handleN8nNotification(webhookData) {
    try {
      const { type, message, data, patientId } = webhookData;

      let title = 'HealthFlow Alert';
      let body = message || 'New update available';

      switch (type) {
        case 'analysis_complete':
          title = 'Analysis Complete';
          body = `Patient analysis for ${data?.patientName} is ready`;
          break;
        case 'critical_alert':
          title = '⚠️ Critical Alert';
          body = `Critical condition detected for ${data?.patientName}`;
          break;
        case 'follow_up_reminder':
          title = 'Follow-up Reminder';
          body = `Follow-up scheduled for ${data?.patientName}`;
          break;
        default:
          break;
      }

      await notificationService.sendLocalNotification(title, body, {
        type,
        patientId,
        ...data,
      });

      return true;
    } catch (error) {
      console.error('Error handling n8n notification:', error);
      return false;
    }
  },
};
