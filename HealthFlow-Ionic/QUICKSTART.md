# Quick Start Guide

Get HealthFlow Ionic running in minutes.

## First Time Setup (5 minutes)

### 1. Install Node.js
Download from https://nodejs.org/ (LTS recommended)

### 2. Install Ionic CLI
```bash
npm install -g @ionic/cli
```

### 3. Install Dependencies
```bash
cd HealthFlow-Ionic
npm install
```

### 4. Configure Backend URL
```bash
# Edit .env file
NG_APP_BACKEND_URL=http://localhost:3000
```

## Development (Choose One)

### Option A: Web Browser (Fastest - Recommended for Development)
```bash
npm run ionic:serve
```
- Opens at `http://localhost:4200`
- Auto-refreshes on code changes
- Best for rapid development

### Option B: Android Device (USB Connected)
```bash
# Prerequisites:
# - Android Studio installed
# - USB debugging enabled on phone
# - Phone connected via USB

npm run ionic:build:android
# This opens Android Studio
# Click "Run" button or use Shift+F10
```

### Option C: iOS Simulator (Mac Only)
```bash
# Prerequisites:
# - Xcode installed
# - Mac with iOS 14+

npm run ionic:build:ios
# This opens Xcode
# Select iPhone simulator and click Run
```

## Project Structure

```
src/
├── app/
│   ├── pages/          # 6 screen pages
│   ├── services/       # 3 main services
│   ├── app.routes.ts   # Navigation routes
│   └── app.component.ts
├── main.ts             # App entry point
└── styles.scss         # Global styles
```

## Common Commands

```bash
# Development server
npm run ionic:serve

# Build for production
npm run build

# Build for Android
ionic build && ionic cap open android

# Build for iOS
ionic build && ionic cap open ios

# Run tests
npm test

# Format code
npm run format
```

## File Changes

Make changes in these folders:
- `src/app/pages/` - Edit page content and logic
- `src/app/services/` - Modify API calls, auth logic
- `src/styles.scss` - Change colors, fonts, spacing

**Live reload** happens automatically in dev server.

## Common Issues

### Port 4200 already in use
```bash
# Use different port
ng serve --port 4300
```

### Backend connection fails
- Check `.env` file has correct URL
- Ensure backend is running
- Check browser console (F12) for errors

### Android emulator won't start
```bash
# List available emulators
emulator -list-avds

# Run specific emulator
emulator -avd Pixel_4_API_30
```

### Dependencies not installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Edit Styles**
   - Colors in `src/styles.scss`
   - Component-specific styles in `.page.scss`

2. **Update API Endpoints**
   - Backend URLs in `src/app/services/`
   - Replace endpoint placeholders

3. **Customize Pages**
   - Add your branding
   - Adjust layouts
   - Add missing features

4. **Test Features**
   - Login with real credentials
   - Navigate all pages
   - Check data loading

## Build for Production

### Android
```bash
ionic build --prod
ionic cap open android
# In Android Studio: Build > Generate Signed APK
```

### iOS
```bash
ionic build --prod
ionic cap open ios
# In Xcode: Product > Archive > Distribute App
```

## Documentation

- [Ionic Docs](https://ionicframework.com/docs)
- [Angular Docs](https://angular.io/docs)
- [Capacitor Docs](https://capacitorjs.com/docs)
- [Detailed Migration Guide](./MIGRATION_GUIDE.md)

## Get Help

1. Check `MIGRATION_GUIDE.md` for API mapping
2. Compare with original `HealthFlow-Mobile/` code
3. Look at Ionic/Angular documentation links above

---

Ready? Start with:
```bash
npm run ionic:serve
```

Open http://localhost:4200 in your browser.
