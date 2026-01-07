/**
 * Main Application Module
 * Handles routing, page rendering, and app initialization
 */

class HealthFlowPWA {
  constructor() {
    this.currentPage = null;
    this.pages = {};
    this.init();
  }

  async init() {
    console.log('Initializing HealthFlow PWA...');

    try {
      // Register pages
      this.registerPages();

      // Check authentication
      if (!auth.isAuthenticated) {
        this.navigate('login');
      } else {
        this.navigate('dashboard');
      }

      // Hide loading screen
      this.hideLoading();

      // Setup event listeners
      this.setupEventListeners();

      console.log('HealthFlow PWA initialized successfully');
    } catch (error) {
      console.error('App initialization error:', error);
      notifications.showAlert('Failed to initialize app', 'danger');
    }
  }

  registerPages() {
    this.pages = {
      login: {
        path: '/pages/login.html',
        title: 'Login'
      },
      dashboard: {
        path: '/pages/dashboard.html',
        title: 'Dashboard'
      },
      patients: {
        path: '/pages/patients.html',
        title: 'Patients'
      },
      'patient-detail': {
        path: '/pages/patient-detail.html',
        title: 'Patient Details'
      },
      analysis: {
        path: '/pages/analysis.html',
        title: 'Analysis'
      },
      settings: {
        path: '/pages/settings.html',
        title: 'Settings'
      }
    };
  }

  async navigate(pageName, params = {}) {
    const page = this.pages[pageName];
    if (!page) {
      console.error('Page not found:', pageName);
      return;
    }

    try {
      // Update URL without page reload
      history.pushState({ page: pageName, params }, page.title, `/?page=${pageName}`);

      // Update current page
      this.currentPage = pageName;

      // Load page content
      const response = await fetch(page.path);
      if (!response.ok) {
        throw new Error(`Failed to load page: ${response.status}`);
      }

      const content = await response.text();
      const root = document.getElementById('root');
      root.innerHTML = content;

      // Update page title
      document.title = `${page.title} - HealthFlow`;

      // Trigger page load event
      this.triggerPageLoad(pageName, params);
    } catch (error) {
      console.error('Navigation error:', error);
      notifications.showAlert('Failed to load page', 'danger');
    }
  }

  triggerPageLoad(pageName, params) {
    const event = new CustomEvent('page-load', {
      detail: { page: pageName, params }
    });
    document.dispatchEvent(event);
  }

  setupEventListeners() {
    // Handle back button
    window.addEventListener('popstate', (event) => {
      if (event.state) {
        this.navigate(event.state.page, event.state.params);
      }
    });

    // Auth state changes
    auth.subscribe((isAuthenticated) => {
      if (!isAuthenticated && this.currentPage !== 'login') {
        this.navigate('login');
      }
    });

    // Offline state changes
    offline.subscribe((isOnline) => {
      const indicator = document.getElementById('online-indicator');
      if (indicator) {
        indicator.classList.toggle('offline', !isOnline);
      }
    });

    // Handle logout
    document.addEventListener('logout', () => {
      auth.logout();
      this.navigate('login');
    });
  }

  hideLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
  }

  // Utility methods
  showModal(title, content, buttons = []) {
    const modalContainer = document.getElementById('modal-container');
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">${title}</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">${content}</div>
        <div class="modal-footer">
          ${buttons
            .map(
              (btn) =>
                `<button class="btn btn-${btn.variant || 'primary'}" data-action="${btn.action}">${btn.label}</button>`
            )
            .join('')}
        </div>
      </div>
    `;

    modalContainer.appendChild(modal);

    // Event handlers
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Button handlers
    buttons.forEach((btn) => {
      const button = modal.querySelector(`[data-action="${btn.action}"]`);
      if (button) {
        button.addEventListener('click', () => {
          if (btn.callback) {
            btn.callback();
          }
          modal.remove();
        });
      }
    });
  }

  showConfirm(title, message, onConfirm, onCancel) {
    this.showModal(title, message, [
      {
        label: 'Cancel',
        action: 'cancel',
        variant: 'secondary',
        callback: onCancel
      },
      {
        label: 'Confirm',
        action: 'confirm',
        variant: 'primary',
        callback: onConfirm
      }
    ]);
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new HealthFlowPWA();
  });
} else {
  window.app = new HealthFlowPWA();
}
