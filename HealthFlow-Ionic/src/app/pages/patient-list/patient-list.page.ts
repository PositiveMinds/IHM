import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSpinner,
  IonSearchbar,
} from '@ionic/angular/standalone';
import { ApiService } from '@services/api.service';

interface Patient {
  id: string;
  name: string;
  email?: string;
  status?: string;
  [key: string]: any;
}

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonSpinner,
    IonSearchbar,
  ],
  templateUrl: './patient-list.page.html',
  styleUrls: ['./patient-list.page.scss'],
})
export class PatientListPage implements OnInit {
  patients: Patient[] = [];
  loading: boolean = true;
  searchTerm: string = '';

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadPatients();
  }

  private async loadPatients() {
    this.loading = true;
    try {
      const data = await this.apiService.get<{ patients: Patient[] }>('/patients');
      this.patients = data.patients || [];
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      this.loading = false;
    }
  }

  viewPatientDetail(patientId: string) {
    this.router.navigate(['/patient-detail', patientId]);
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    // Implement search filtering if needed
  }
}
