import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, IonApp, IonRouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit() {
    // Initialize auth on app startup
    await this.authService.initializeAuth();

    // Register for push notifications
    try {
      const pushToken = await this.notificationService.registerForPushNotifications();
      if (pushToken) {
        console.log('Push notification token registered:', pushToken);
        // Send token to backend if needed
      }
    } catch (error) {
      console.error('Failed to register for push notifications:', error);
    }

    // Subscribe to notifications
    this.notificationService.subscribeToNotifications((notification) => {
      console.log('Notification received:', notification);
    });
  }
}
