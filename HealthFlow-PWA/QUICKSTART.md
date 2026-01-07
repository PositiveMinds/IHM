# HealthFlow PWA - Quick Start Guide

Get the PWA app running in 5 minutes.

## 1. Install Dependencies

```bash
cd HealthFlow-PWA
npm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your backend API URL:

```env
API_BASE_URL=http://localhost:3000/api
```

## 3. Start Development Server

```bash
npm run dev
```

The app opens at `http://localhost:8000`

## 4. Login

- Email: Use your test account
- Password: Your password

## 5. Test Features

### Dashboard
- View patient statistics
- Access quick actions
- Switch facilities

### Patients
- Browse all patients
- Search by name
- View patient details

### Analysis
- Run health analysis
- View results
- Export reports

### Settings
- Manage preferences
- Update profile
- Logout

## 6. Install as App

### On Chrome (Desktop)
1. Click address bar
2. Click "Install HealthFlow"
3. App opens in window mode

### On Mobile (iOS/Android)
1. Open in Safari or Chrome
2. Tap Share → Add to Home Screen
3. App installs on home screen

## 7. Test Offline Mode

1. Open DevTools (F12)
2. Go to Application → Service Workers
3. Check "Offline"
4. Refresh page
5. App still works!

## 8. Try Push Notifications

1. Browser requests permission
2. Click "Allow"
3. Device receives test notification

## Commands

```bash
# Development
npm run dev        # Start dev server

# Deployment
npm run serve      # Serve for production
npm run build      # Build assets

# Testing
npm start          # Start on port 3000
```

## File Structure Overview

```
public/
├── index.html         ← Main HTML
├── manifest.json      ← PWA configuration
├── sw.js              ← Service Worker
├── js/
│   ├── app.js         ← Main app logic
│   └── modules/       ← Core modules
├── css/               ← Styling
└── pages/             ← Page templates
```

## Key Features Working

✅ Authentication (Login/Logout)
✅ Offline Access (cached data)
✅ Patient Management
✅ Push Notifications
✅ Settings Management
✅ Mobile Responsive
✅ Installable

## Troubleshooting

### Port 8000 already in use?
```bash
npm run serve -- -p 8080
```

### Service Worker not updating?
```
DevTools → Application → Service Workers → Unregister
Then refresh page
```

### Can't login?
- Check `.env` API_BASE_URL
- Verify backend is running
- Check credentials

### App won't install?
- Must be served over HTTPS (except localhost)
- Manifest must be valid
- Service Worker must be registered

## Next Steps

1. **Customize Branding**
   - Edit colors in `css/style.css`
   - Replace images in `images/`

2. **Add More Pages**
   - Create `pages/your-page.html`
   - Register in `js/app.js`

3. **Connect Real Backend**
   - Update API endpoints
   - Configure authentication

4. **Deploy to Production**
   - Build: `npm run build`
   - Deploy `public/` folder
   - Enable HTTPS

## Resources

- [PWA Features Guide](https://web.dev/pwa/)
- [Service Workers](https://developers.google.com/web/tools/workbox)
- [IndexedDB Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

## Need Help?

Check the full README.md for detailed documentation.
