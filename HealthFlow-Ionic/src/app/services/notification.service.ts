import { Injectable } from '@angular/core';
import {
  PushNotifications,
  PushNotificationSchema,
  Token,
  ActionPerformed,
} from '@capacitor/push-notifications';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<PushNotificationSchema | null>(
    null
  );
  public notification$ = this.notificationSubject.asObservable();

  constructor(private toastController: ToastController) {}

  async registerForPushNotifications(): Promise<string | null> {
    try {
      // Request permission
      let permission = await PushNotifications.checkPermissions();

      if (permission.receive === 'prompt') {
        permission = await PushNotifications.requestPermissions();
      }

      if (permission.receive !== 'granted') {
        throw new Error('User denied permission to notifications');
      }

      // Register with FCM
      await PushNotifications.register();

      // Get the token
      const result = await PushNotifications.getDeliveryTokens();
      const token = result.tokens[0];

      console.log('Push token:', token);
      return token;
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
      return null;
    }
  }

  subscribeToNotifications(callback?: (notification: PushNotificationSchema) => void): Observable<PushNotificationSchema | null> {
    // Listen to notification received event
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        console.log('Notification received:', notification);
        this.notificationSubject.next(notification);

        if (callback) {
          callback(notification);
        }

        // Show toast
        await this.showNotificationToast(notification);
      }
    );

    // Listen to action performed event
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        console.log('Notification action performed:', notification);
        const data = notification.notification;
        this.notificationSubject.next(data);

        if (callback) {
          callback(data);
        }
      }
    );

    return this.notification$;
  }

  private async showNotificationToast(notification: PushNotificationSchema): Promise<void> {
    const toast = await this.toastController.create({
      message: notification.body || 'New notification',
      duration: 3000,
      position: 'top',
      color: 'primary',
    });
    await toast.present();
  }

  async unsubscribeFromNotifications(): Promise<void> {
    try {
      PushNotifications.removeAllListeners();
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    }
  }
}
