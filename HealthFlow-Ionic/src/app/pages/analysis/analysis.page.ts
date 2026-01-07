import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonSpinner,
} from '@ionic/angular/standalone';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonButton,
    IonSpinner,
  ],
  templateUrl: './analysis.page.html',
  styleUrls: ['./analysis.page.scss'],
})
export class AnalysisPage implements OnInit {
  analysisData: any = null;
  loading: boolean = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadAnalysisData();
  }

  private async loadAnalysisData() {
    this.loading = true;
    try {
      const data = await this.apiService.get('/analysis');
      this.analysisData = data;
    } catch (error) {
      console.error('Error loading analysis data:', error);
    } finally {
      this.loading = false;
    }
  }

  async runAnalysis() {
    this.loading = true;
    try {
      const data = await this.apiService.post('/analysis/run', {});
      this.analysisData = data;
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      this.loading = false;
    }
  }
}
