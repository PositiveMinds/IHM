import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonText,
  AlertController,
  IonScroll,
} from '@ionic/angular/standalone';
import { AuthService, User } from '@services/auth.service';
import { ApiService } from '@services/api.service';

interface DashboardData {
  totalPatients: number;
  activeCases: number;
  [key: string]: any;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonSpinner,
    IonText,
    IonScroll,
  ],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  userData: User | null = null;
  selectedFacility: string | null = null;
  dashboardData: DashboardData | null = null;
  loading: boolean = true;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadData();
  }

  private async loadData() {
    this.loading = true;
    try {
      const user = await this.authService.getUserData();
      this.userData = user;

      const facility = await this.authService.getSelectedFacility();
      this.selectedFacility = facility || user?.facilities[0]?.facility_id || null;

      // Fetch dashboard data from backend
      if (this.selectedFacility) {
        const data = await this.apiService.get<DashboardData>(
          `/dashboard/${this.selectedFacility}`
        );
        this.dashboardData = data;
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      await this.showAlert('Error', 'Failed to load dashboard data');
    } finally {
      this.loading = false;
    }
  }

  async handleFacilityChange(facilityId: string) {
    await this.authService.setSelectedFacility(facilityId);
    this.selectedFacility = facilityId;
    this.loadData();
  }

  async handleLogout() {
    const alert = await this.alertController.create({
      header: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          role: 'destructive',
          handler: async () => {
            await this.authService.logout();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    await alert.present();
  }

  viewAllPatients() {
    this.router.navigate(['/tabs/patients']);
  }

  viewAnalysis() {
    this.router.navigate(['/tabs/analysis']);
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
