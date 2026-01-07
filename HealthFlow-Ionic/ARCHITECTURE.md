# Application Architecture

## System Overview

```
┌─────────────────────────────────────────────────────┐
│           IONIC MOBILE APPLICATION                 │
│          (Web View + Capacitor Bridge)              │
└───────────────────┬─────────────────────────────────┘
                    │
         ┌──────────┴──────────┬──────────┐
         │                     │          │
    ┌────▼────┐          ┌─────▼───┐  ┌──▼──────┐
    │ Angular │          │Capacitor│  │  Ionic  │
    │ Core    │          │  Plugins│  │ UI Comp │
    │         │          │         │  │         │
    │ Router  │          │  Device │  │ Layout  │
    │ Forms   │          │  Access │  │ Forms   │
    │ Services│          │         │  │ Routing │
    └────┬────┘          └────┬────┘  └────┬────┘
         │                    │            │
    ┌────▼────────────────────▼────────────▼────┐
    │        Hybrid App Runtime                  │
    │   (Native WebView + JavaScript Engine)    │
    └────────┬──────────────────────────────────┘
             │
    ┌────────▼──────────────┐
    │  Native Platform APIs │
    │                       │
    │  ├─ Device Storage    │
    │  ├─ Notifications     │
    │  ├─ Network Stack     │
    │  └─ UI Rendering      │
    └───────────────────────┘
```

## Application Layers

### 1. **Presentation Layer** (Pages)
Ionic pages handle UI and user interactions.

```
TabsPage
├── DashboardPage
│   ├── User info
│   ├── Facility selector
│   └── Dashboard cards
├── PatientListPage
│   ├── Search bar
│   └── Patient list
├── PatientDetailPage
│   └── Patient information
├── AnalysisPage
│   └── AI analysis results
└── SettingsPage
    └── Preferences & logout
```

### 2. **Service Layer** (Business Logic)
Angular services handle data and API communication.

```
AuthService
├── Login/Logout
├── Token Management
├── User Data
└── Facility Selection

ApiService
├── HTTP Client (axios)
├── Request Interceptors
├── Error Handling
└── Token Injection

NotificationService
├── Register Device
├── Listen to Messages
└── Display Toasts
```

### 3. **Routing Layer** (Navigation)
Angular Router with Ionic routing provides navigation structure.

```
/
├── /login (Public)
├── /tabs (Protected by AuthGuard)
│   ├── /tabs/dashboard
│   ├── /tabs/patients
│   ├── /tabs/analysis
│   └── /tabs/settings
└── /patient-detail/:id (Protected by AuthGuard)
```

### 4. **Data Storage Layer** (Persistence)
Capacitor Preferences stores sensitive data securely.

```
Device Storage
├── authToken (JWT)
├── userEmail
├── facilities (JSON)
└── selectedFacility
```

## Data Flow

### Authentication Flow
```
┌─────────────────────────────────────────────────────┐
│ User enters credentials in LoginPage                 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────────┐
        │  AuthService       │
        │  loginWithEmail()  │
        └────────┬───────────┘
                 │
                 ▼
    ┌────────────────────────────────┐
    │  POST /auth/login              │
    │  {email, password}             │
    │  (via ApiService/axios)        │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  Backend API                   │
    │  Returns: token, user, facils  │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  Store in Device Storage       │
    │  (Capacitor Preferences)       │
    └────────┬───────────────────────┘
             │
             ▼
    ┌────────────────────────────────┐
    │  Navigate to /tabs/dashboard   │
    │  (via Router)                  │
    └────────────────────────────────┘
```

### Data Load Flow
```
┌──────────────────────────────────────┐
│ Page initializes (ngOnInit)          │
└────────────┬─────────────────────────┘
             │
             ▼
    ┌────────────────────────┐
    │ Call Service method    │
    │ (async/await)          │
    └────────┬───────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ ApiService.get()                 │
    │ - Retrieves auth token           │
    │ - Adds to request header         │
    │ - Makes HTTP call                │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Backend returns data             │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Update component property        │
    │ (Component re-renders via         │
    │  Angular change detection)        │
    └──────────────────────────────────┘
```

### Notification Flow
```
┌─────────────────────────────────────┐
│ App Startup (AppComponent.ngOnInit) │
└────────────┬────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ NotificationService              │
    │ .registerForPushNotifications()   │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Capacitor Push Notifications     │
    │ - Requests device permission     │
    │ - Registers with FCM/APNS        │
    │ - Returns device token           │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Subscribe to notification events │
    │ (PushNotifications listeners)     │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Backend sends notification       │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ Device receives notification     │
    │ (Capacitor captures)             │
    └────────┬─────────────────────────┘
             │
             ▼
    ┌──────────────────────────────────┐
    │ NotificationService listener     │
    │ - Displays toast                 │
    │ - Emits BehaviorSubject          │
    │ - App reacts accordingly         │
    └──────────────────────────────────┘
```

## Component Hierarchy

```
AppComponent (Root)
│
└── RouterOutlet
    │
    ├── LoginPage (not authenticated)
    │   └── IonContent
    │       ├── Header
    │       ├── Form Group (email, password)
    │       └── Login Button
    │
    └── TabsPage (authenticated)
        │
        ├── IonRouterOutlet (tab content)
        │   │
        │   ├── DashboardPage
        │   │   ├── IonHeader
        │   │   ├── IonContent
        │   │   │   ├── Header card
        │   │   │   ├── Facility selector
        │   │   │   ├── Dashboard cards
        │   │   │   └── Action buttons
        │   │
        │   ├── PatientListPage
        │   │   ├── IonHeader
        │   │   ├── IonSearchbar
        │   │   └── IonList
        │   │       └── IonItem (per patient)
        │   │
        │   ├── AnalysisPage
        │   │   ├── IonHeader
        │   │   └── IonCard
        │   │       └── Analysis results
        │   │
        │   └── SettingsPage
        │       ├── IonHeader
        │       └── IonList
        │           └── Setting items
        │
        └── IonTabBar
            ├── IonTabButton (Dashboard)
            ├── IonTabButton (Patients)
            ├── IonTabButton (Analysis)
            └── IonTabButton (Settings)
```

## Service Diagram

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │            API Service                       │  │
│  │                                              │  │
│  │  ┌────────────────────────────────────────┐ │  │
│  │  │ axios Instance                         │ │  │
│  │  │ baseURL: environment.backendUrl       │ │  │
│  │  │ headers: Content-Type: application/json
│  │  └────────────────────────────────────────┘ │  │
│  │           ▲                    ▲             │  │
│  │           │                    │             │  │
│  │     ┌─────┴────────┐  ┌────────┴─────┐     │  │
│  │     │ Interceptor  │  │ Interceptor  │     │  │
│  │     │ (Request)    │  │ (Response)   │     │  │
│  │     │              │  │              │     │  │
│  │     │Get auth token│  │Handle 401    │     │  │
│  │     │Add to headers│  │Auto-logout   │     │  │
│  │     └──────────────┘  └──────────────┘     │  │
│  │                                              │  │
│  └──────────────────────────────────────────────┘  │
│           ▲                         │               │
│           │                         │               │
│  ┌────────┴──────┐        ┌────────▼──────┐      │
│  │               │        │                │      │
│  │ Auth Service  │        │ Backend API    │      │
│  │               │        │                │      │
│  │ loginWithEmail│◄─────► │ /auth/login    │      │
│  │ getUserData   │        │ /dashboard     │      │
│  │ logout        │        │ /patients      │      │
│  │ setFacility   │        │ /analysis      │      │
│  │               │        │                │      │
│  └───────────────┘        └────────────────┘      │
│           ▲                                         │
│           │                                         │
│  ┌────────┴──────────────────────────────────┐   │
│  │        Notification Service               │   │
│  │                                            │   │
│  │ registerForPushNotifications()             │   │
│  │ subscribeToNotifications()                 │   │
│  │ unsubscribeFromNotifications()             │   │
│  │                                            │   │
│  └───────────────────────────────────────────┘   │
│                                                    │
└─────────────────────────────────────────────────────┘
```

## State Management

### Component-Level State (Local)
Each page manages its own component state:
- `loading: boolean` - Loading indicator
- `data: Type` - Page data
- `error: string` - Error message

### Global State (Services)
Services manage global application state:
- `AuthService.user$` - Current user (BehaviorSubject)
- `NotificationService.notification$` - Last notification

### Persistent State (Device Storage)
Capacitor Preferences persists critical data:
- `authToken` - JWT for API calls
- `userEmail` - Current user email
- `facilities` - Available facilities
- `selectedFacility` - Current facility

## Security Architecture

```
┌─────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                     │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Layer 1: Authentication Guard                      │
│  ├─ Route protection (AuthGuard)                    │
│  └─ Token validation before navigation              │
│                                                      │
│  Layer 2: Token Management                          │
│  ├─ Secure storage (Capacitor Preferences)          │
│  ├─ JWT validation (expiration check)               │
│  └─ Automatic renewal on startup                    │
│                                                      │
│  Layer 3: Request Security                          │
│  ├─ Authorization header injection                  │
│  ├─ HTTPS/TLS (production)                          │
│  └─ CORS handling                                   │
│                                                      │
│  Layer 4: Response Security                         │
│  ├─ 401 handling (logout on token expire)           │
│  ├─ Error interception                              │
│  └─ Sensitive data sanitization                     │
│                                                      │
│  Layer 5: Storage Security                          │
│  ├─ Capacitor Preferences (encrypted on device)     │
│  ├─ No localStorage for sensitive data              │
│  └─ Automatic cleanup on logout                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Build & Deployment

```
Source Code
    │
    ├─► Angular Build (ng build)
    │   └─► Compiled JavaScript + Templates
    │
    ├─► Capacitor Build (ionic cap add)
    │   │
    │   ├─► Android Project
    │   │   └─► Android Studio/Gradle
    │   │       └─► APK/AAB for Play Store
    │   │
    │   └─► iOS Project
    │       └─► Xcode
    │           └─► IPA for App Store
    │
    └─► Web Build (ng build)
        └─► Deployable to web server
```

## Performance Optimization

✅ **Lazy Loading**
- Routes configured for lazy loading
- Modules loaded on demand

✅ **Change Detection**
- OnPush strategy for components
- RxJS observables with async pipe

✅ **Code Splitting**
- Automatic by Angular CLI
- Smaller initial bundle

✅ **Tree Shaking**
- Standalone components (no NgModule overhead)
- Services provided at root level

✅ **Caching**
- API response caching (can be added)
- Service worker support (can be added)

---

**Architecture Review**: Scalable, secure, and maintainable design.
