import axios from 'axios';
import { notificationService } from './notificationService';

const N8N_WEBHOOK_URL = process.env.EXPO_PUBLIC_N8N_WEBHOOK_URL;
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const n8nService = {
  /**
   * Trigger analysis workflow in n8n
   * @param {object} patientData - Patient information for analysis
   * @param {string} facilityId - Facility ID
   * @returns {object} Response from n8n
   */
  async triggerAnalysis(patientData, facilityId) {
    try {
      const payload = {
        patientData,
        facilityId,
        timestamp: new Date().toISOString(),
        source: 'mobile_app',
      };

      // Option 1: Send directly to n8n webhook
      const response = await axios.post(N8N_WEBHOOK_URL || `${BACKEND_URL}/n8n/analyze`, payload, {
        timeout: 30000,
      });

      return {
        success: true,
        workflowId: response.data.executionId || response.data.id,
        message: response.data.message || 'Analysis started',
        data: response.data,
      };
    } catch (error) {
      console.error('Error triggering n8n analysis:', error);
      return {
        success: false,
        message: error.message || 'Failed to start analysis',
      };
    }
  },

  /**
   * Check analysis status
   * @param {string} executionId - Execution ID from workflow
   * @returns {object} Status and results
   */
  async checkAnalysisStatus(executionId) {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/n8n/status/${executionId}`,
        {
          timeout: 10000,
        }
      );

      return {
        success: true,
        status: response.data.status, // 'waiting', 'running', 'success', 'error'
        data: response.data.data || null,
        error: response.data.error || null,
      };
    } catch (error) {
      console.error('Error checking analysis status:', error);
      return {
        success: false,
        status: 'error',
        message: error.message,
      };
    }
  },

  /**
   * Get analysis results
   * @param {string} patientId - Patient ID
   * @returns {object} Analysis results
   */
  async getAnalysisResults(patientId) {
    try {
      const response = await axios.get(`${BACKEND_URL}/analysis/${patientId}`, {
        timeout: 10000,
      });

      return {
        success: true,
        results: response.data.results,
        recommendations: response.data.recommendations,
        timestamp: response.data.timestamp,
      };
    } catch (error) {
      console.error('Error fetching analysis results:', error);
      return {
        success: false,
        message: 'Failed to fetch results',
      };
    }
  },

  /**
   * Setup webhook listener for n8n callbacks
   * Backend should POST to /webhook/n8n-callback with analysis results
   */
  async setupWebhookListener(onNotification) {
    // This runs on the backend, but the service can document
    // what the n8n workflow should send back to your backend
    console.log(
      'n8n should POST analysis results to: ' +
        `${BACKEND_URL}/webhook/n8n-callback`
    );

    // Backend should then forward to mobile via:
    // - Push notifications (using Expo Push Notifications service)
    // - WebSocket (for real-time updates)
    // - Polling via checkAnalysisStatus()

    return {
      callbackUrl: `${BACKEND_URL}/webhook/n8n-callback`,
      notificationHandler: onNotification,
    };
  },

  /**
   * Trigger different n8n workflows based on action
   * @param {string} action - Workflow action type
   * @param {object} data - Workflow input data
   */
  async triggerWorkflow(action, data) {
    try {
      const workflowMap = {
        'patient-analysis': 'analyze-patient',
        'critical-alert': 'handle-critical-alert',
        'follow-up-reminder': 'schedule-follow-up',
        'report-generation': 'generate-report',
      };

      const workflowName = workflowMap[action];
      if (!workflowName) {
        throw new Error(`Unknown workflow action: ${action}`);
      }

      const response = await axios.post(
        `${N8N_WEBHOOK_URL || BACKEND_URL}/workflows/${workflowName}`,
        {
          ...data,
          triggeredAt: new Date().toISOString(),
        },
        { timeout: 30000 }
      );

      return {
        success: true,
        workflowId: response.data.id,
        data: response.data,
      };
    } catch (error) {
      console.error('Error triggering workflow:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  },

  /**
   * Handle incoming notification from n8n via backend
   * Called when n8n posts analysis results back
   */
  async handleN8nCallback(callbackData) {
    try {
      const { type, patientId, patientName, data } = callbackData;

      // Send local notification
      await notificationService.handleN8nNotification({
        type,
        patientId,
        message: data?.message || `Analysis result for ${patientName}`,
        data,
      });

      // Store results in local cache or update state
      // Your app state management here...

      return {
        success: true,
        processed: true,
      };
    } catch (error) {
      console.error('Error handling n8n callback:', error);
      return {
        success: false,
        processed: false,
      };
    }
  },
};
