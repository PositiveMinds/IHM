# HealthFlow Mobile - Ionic Version

Multi-Facility Health Management System built with Ionic and Angular.

## Migration from React Native

This is a conversion of the original React Native (Expo) application to Ionic Framework with Angular.

### Key Changes:

- **UI Framework**: React Native → Ionic Components
- **Framework**: React → Angular
- **State Management**: React Hooks → Angular Services + RxJS
- **Navigation**: React Navigation → Angular Router + Ionic Routing
- **Storage**: expo-secure-store → @capacitor/preferences
- **Notifications**: expo-notifications → @capacitor/push-notifications
- **Platform**: Expo → Capacitor

## Prerequisites

- Node.js 18+ and npm
- Ionic CLI: `npm install -g @ionic/cli`
- For Android: Android Studio + Android SDK
- For iOS: Mac with Xcode

## Installation

```bash
cd HealthFlow-Ionic
npm install
```

## Development

### Web (fastest iteration)
```bash
npm run ionic:serve
```

### Android
```bash
# First time setup
npm run ionic:build:android

# Development with live reload
ionic cap open android
```

### iOS (Mac only)
```bash
# First time setup
npm run ionic:build:ios

# Development with live reload
ionic cap open ios
```

## Environment Setup

1. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

2. Update with your backend URL:
```
NG_APP_BACKEND_URL=http://your-backend-url.com
```

## Project Structure

```
src/
├── app/
│   ├── pages/               # Feature pages/screens
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── patient-list/
│   │   ├── patient-detail/
│   │   ├── analysis/
│   │   ├── settings/
│   │   └── tabs/            # Tab navigation layout
│   ├── services/            # Angular services (auth, API, notifications)
│   ├── shared/              # Shared guards, utilities
│   ├── app.routes.ts        # Route configuration
│   └── app.component.ts     # Root component
├── environments/            # Environment configurations
├── assets/                  # Static assets
└── styles.scss             # Global styles
```

## Build for Production

```bash
# Web
npm run build

# Android
ionic build
ionic cap open android
# Build in Android Studio

# iOS
ionic build
ionic cap open ios
# Build in Xcode
```

## Mobile Deployment

### Android
1. Build signed APK in Android Studio
2. Upload to Google Play Store

### iOS
1. Build Archive in Xcode
2. Upload to App Store

## Testing on Physical Device

### Android
```bash
# Connect phone via USB with Developer Mode enabled
ionic cap open android
# Select your device and run from Android Studio
```

### iOS
```bash
# Connect iPhone via USB (requires Mac)
ionic cap open ios
# Select your device and run from Xcode
```

## Troubleshooting

### Port already in use
```bash
# Kill process on port 8100
lsof -ti:8100 | xargs kill -9
```

### Clear build cache
```bash
rm -rf www node_modules dist .angular
npm install
```

### Android emulator issues
```bash
# List available emulators
emulator -list-avds

# Run specific emulator
emulator -avd <name>
```

## Backend API Integration

Services authenticate with the backend and handle:
- User login/logout
- Token management (JWT)
- API requests with automatic token injection
- Token expiration handling

## Features

- ✅ Multi-facility management
- ✅ Patient list and details
- ✅ AI analysis integration
- ✅ Push notifications
- ✅ Secure credential storage
- ✅ Role-based access
- ✅ Responsive mobile UI

## License

Private - PositiveMinds

## Support

For issues or questions, contact the development team.
