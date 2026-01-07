import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonInput,
  IonSpinner,
  IonText,
  AlertController,
} from '@ionic/angular/standalone';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonInput,
    IonSpinner,
    IonText,
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async handleLogin() {
    if (!this.email.trim() || !this.password.trim()) {
      await this.showAlert('Error', 'Please enter email and password');
      return;
    }

    this.loading = true;
    try {
      const result = await this.authService.loginWithEmail(
        this.email,
        this.password
      );

      if (result && result.facilities.length > 0) {
        this.router.navigate(['/tabs/dashboard']);
      } else {
        await this.showAlert(
          'No Facilities',
          'No facilities assigned to your account. Please contact administrator.'
        );
      }
    } catch (error: any) {
      await this.showAlert('Login Error', error.message || 'Invalid credentials');
    } finally {
      this.loading = false;
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
