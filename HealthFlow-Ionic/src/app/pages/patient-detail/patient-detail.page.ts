import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ApiService } from '@services/api.service';

interface PatientDetail {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonSpinner,
  ],
  templateUrl: './patient-detail.page.html',
  styleUrls: ['./patient-detail.page.scss'],
})
export class PatientDetailPage implements OnInit {
  patientId: string = '';
  patient: PatientDetail | null = null;
  loading: boolean = true;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.patientId = this.route.snapshot.paramMap.get('id') || '';
  }

  ngOnInit() {
    this.loadPatientDetails();
  }

  private async loadPatientDetails() {
    this.loading = true;
    try {
      const data = await this.apiService.get<PatientDetail>(
        `/patients/${this.patientId}`
      );
      this.patient = data;
    } catch (error) {
      console.error('Error loading patient details:', error);
    } finally {
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/tabs/patients']);
  }
}
