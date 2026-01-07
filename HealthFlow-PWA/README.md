# HealthFlow PWA - Mobile Progressive Web App

A Progressive Web App (PWA) version of HealthFlow, providing a mobile-first healthcare management application that works online and offline.

## Features

✅ **Mobile-First Design** - Optimized for all mobile devices
✅ **Offline Support** - Works without internet connection
✅ **Push Notifications** - Real-time alerts and updates
✅ **Installable** - Install as native app on mobile
✅ **Responsive** - Beautiful on all screen sizes
✅ **Fast** - Service Worker for instant loading
✅ **Secure** - Token-based authentication

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Storage**: IndexedDB + LocalStorage
- **Service Worker**: Offline-first approach
- **HTTP Client**: Fetch API
- **Authentication**: JWT tokens
- **Build**: Webpack (optional)

## Project Structure

```
HealthFlow-PWA/
├── public/
│   ├── images/
│   │   ├── icon-192x192.png
│   │   └── icon-512x512.png
│   ├── pages/
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── patients.html
│   │   ├── patient-detail.html
│   │   ├── analysis.html
│   │   └── settings.html
│   ├── css/
│   │   ├── style.css        - Variables & typography
│   │   ├── layout.css       - Layout components
│   │   ├── components.css   - Reusable components
│   │   └── responsive.css   - Mobile responsive
│   ├── js/
│   │   ├── modules/
│   │   │   ├── auth.js        - Authentication
│   │   │   ├── api.js         - HTTP client
│   │   │   ├── storage.js     - Data persistence
│   │   │   ├── notifications.js - Notifications
│   │   │   └── offline.js     - Offline support
│   │   └── app.js           - Main app
│   ├── manifest.json        - PWA metadata
│   ├── sw.js                - Service Worker
│   └── index.html           - Entry point
├── package.json
├── README.md
└── .env.example
```

## Getting Started

### Installation

1. Clone the project:
```bash
cd HealthFlow-PWA
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env with your backend URL
```

### Development

Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:8000`

### Testing PWA Features

1. **Install as App**:
   - Desktop: Click "Install" button in address bar
   - Mobile: Tap "Add to Home Screen"

2. **Test Offline**:
   - DevTools → Application → Service Workers
   - Check "Offline" checkbox
   - App should still work

3. **Push Notifications**:
   - Browser will request permission
   - Accept to receive notifications

## API Integration

The app connects to a backend API. Configure the base URL in `.env`:

```env
API_BASE_URL=http://localhost:3000/api
```

### Expected Endpoints

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /patients` - List patients
- `GET /patients/:id` - Get patient details
- `GET /dashboard` - Dashboard data
- `POST /analysis` - Run analysis

## Modules

### AuthManager (`auth.js`)
- Login/logout
- Token management
- Session persistence
- Auth state notifications

### APIManager (`api.js`)
- HTTP requests (GET, POST, PUT, DELETE)
- Token injection
- Error handling
- Request caching

### StorageManager (`storage.js`)
- LocalStorage (key-value)
- IndexedDB (complex data)
- Cache management
- Offline queue

### NotificationManager (`notifications.js`)
- Push notifications
- Toast messages
- In-app alerts
- Permission handling

### OfflineManager (`offline.js`)
- Online/offline detection
- Data synchronization
- Offline queue
- Sync status

## Styling

The app uses CSS custom properties (variables) for consistent theming:

```css
--color-primary: #0066cc
--color-secondary: #00a86b
--color-danger: #d32f2f
--spacing-md: 16px
--radius-md: 8px
```

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 51+ | ✅ Full |
| Firefox | 44+ | ✅ Full |
| Safari | 11+ | ✅ Full |
| Edge | 15+ | ✅ Full |
| iOS Safari | 11+ | ✅ Full |
| Chrome Mobile | 40+ | ✅ Full |

## Performance

- **Cache First** for assets
- **Network First** for API calls
- Service Worker caches assets
- IndexedDB for offline data
- Lazy loading of modules

## Security

- JWT token authentication
- Secure token storage
- Request token injection
- CORS handling
- Auto-logout on 401
- Offline action queueing

## Deployment

### Web Server

```bash
npm run build
# Deploy 'public' folder to web server
```

### App Stores

Create signed APK/IPA using:
- Android: Trusted Web Activity (TWA)
- iOS: Web Clip or WebView wrapper

## Development Tips

1. **Debug Service Worker**:
   - DevTools → Application → Service Workers
   - Check logs in DevTools Console

2. **Clear Cache**:
   - DevTools → Application → Storage → Clear Site Data
   - Unregister Service Worker

3. **Simulate Offline**:
   - DevTools → Network → Set throttling to "Offline"
   - Or check "Offline" in Service Workers tab

4. **Test Notifications**:
   - Allow notification permission
   - Check browser notification center

## Customization

### Change Theme Colors

Edit `public/css/style.css`:

```css
:root {
  --color-primary: #your-color;
  --color-secondary: #your-color;
  /* ... */
}
```

### Add New Pages

1. Create `public/pages/your-page.html`
2. Register in `app.js`:
   ```javascript
   this.pages['your-page'] = {
     path: '/pages/your-page.html',
     title: 'Your Page'
   };
   ```
3. Add event listener:
   ```javascript
   document.addEventListener('page-load', (e) => {
     if (e.detail.page === 'your-page') {
       initYourPage();
     }
   });
   ```

## Troubleshooting

### Service Worker not updating
- Clear browser cache and site data
- Unregister old Service Worker
- Hard refresh (Ctrl+Shift+R)

### Authentication not working
- Check `.env` API_BASE_URL
- Verify backend is running
- Check CORS settings

### Offline features not working
- Enable IndexedDB support
- Check browser storage quota
- Review Service Worker status

### Push notifications not showing
- Request notification permission
- Check VAPID keys in `.env`
- Verify push subscription

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Web Push Protocol](https://datatracker.ietf.org/doc/html/draft-ietf-webpush-protocol)

## Support

For issues or questions, refer to the [HealthFlow Documentation](../README.md)

## License

MIT License - See LICENSE file for details
