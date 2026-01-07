# React Native to Ionic Migration Guide

Complete migration from HealthFlow-Mobile (React Native/Expo) to HealthFlow-Ionic (Angular/Ionic).

## Overview

| Aspect | React Native | Ionic |
|--------|-------------|-------|
| **Framework** | React 19 | Angular 17 |
| **UI Components** | React Native | Ionic Components |
| **Navigation** | React Navigation | Angular Router + Ionic Routing |
| **State** | React Hooks/useReducer | Angular Services + RxJS |
| **Styling** | StyleSheet/CSS | SCSS |
| **Storage** | expo-secure-store | @capacitor/preferences |
| **Notifications** | expo-notifications | @capacitor/push-notifications |
| **HTTP Client** | axios | axios (same) |
| **Build System** | Expo | Capacitor |

## Component Migration Examples

### 1. Login Screen

**React Native:**
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

<TextInput
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
/>
<TouchableOpacity onPress={handleLogin}>
  <Text>Login</Text>
</TouchableOpacity>
```

**Ionic/Angular:**
```typescript
email = '';
password = '';

constructor(private authService: AuthService) {}

async handleLogin() {
  const result = await this.authService.loginWithEmail(
    this.email,
    this.password
  );
}
```

```html
<ion-input
  [(ngModel)]="email"
  placeholder="Enter your email"
></ion-input>
<ion-button (click)="handleLogin()">Login</ion-button>
```

### 2. Service Migration

**React Native (authService):**
```javascript
export const authService = {
  async loginWithEmail(email, password) {
    const response = await axios.post(url, { email, password });
    await SecureStore.setItemAsync('authToken', token);
    return { token, user, facilities };
  }
}
```

**Ionic/Angular Service:**
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}

  async loginWithEmail(email: string, password: string): Promise<User> {
    const response = await this.apiClient.post('/auth/login', {
      email,
      password
    });
    await Preferences.set({ key: 'authToken', value: token });
    return userData;
  }
}
```

### 3. Navigation

**React Native:**
```javascript
<NavigationContainer>
  <Stack.Navigator>
    {userToken == null ? (
      <Stack.Screen name="Login" component={LoginScreen} />
    ) : (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Patients" component={PatientListScreen} />
      </Tab.Navigator>
    )}
  </Stack.Navigator>
</NavigationContainer>

// Navigation
navigation.navigate('Patients')
navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] })
```

**Ionic/Angular:**
```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: DashboardPage },
      { path: 'patients', component: PatientListPage }
    ]
  }
];

// In component
constructor(private router: Router) {}
this.router.navigate(['/tabs/patients'])
```

### 4. Styling

**React Native StyleSheet:**
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 14,
    borderRadius: 8,
  }
});

// Usage: <View style={styles.container}>
```

**Ionic SCSS:**
```scss
// styles in component .scss file
.container {
  display: flex;
  flex: 1;
  background: #f5f5f5;
}

.button {
  background: #0066cc;
  padding: 14px;
  border-radius: 8px;
}
```

## API Compatibility

### Storage API Migration

**Expo Secure Store:**
```javascript
import * as SecureStore from 'expo-secure-store';

await SecureStore.setItemAsync('token', value);
const token = await SecureStore.getItemAsync('token');
await SecureStore.deleteItemAsync('token');
```

**Capacitor Preferences:**
```typescript
import { Preferences } from '@capacitor/preferences';

await Preferences.set({ key: 'token', value });
const result = await Preferences.get({ key: 'token' });
await Preferences.remove({ key: 'token' });
```

### Notifications API Migration

**Expo Notifications:**
```javascript
const pushToken = await notificationService.registerForPushNotifications();
notificationService.subscribeToNotifications((notification) => {
  // Handle notification
});
```

**Capacitor Push Notifications:**
```typescript
async registerForPushNotifications(): Promise<string | null> {
  await PushNotifications.register();
  const result = await PushNotifications.getDeliveryTokens();
  return result.tokens[0];
}

subscribeToNotifications(callback) {
  PushNotifications.addListener('pushNotificationReceived', (notification) => {
    callback(notification);
  });
}
```

## Dependency Changes

### Removed (React Native specific)
```json
{
  "react": "^19.1.0",
  "react-native": "^0.74.0",
  "@react-navigation/native": "^6.1.0",
  "@react-navigation/bottom-tabs": "^6.5.0",
  "@react-navigation/stack": "^6.3.0",
  "expo": "^54.0.30",
  "expo-secure-store": "~13.0.0",
  "expo-notifications": "~0.27.0"
}
```

### Added (Ionic/Angular)
```json
{
  "@angular/core": "^17.0.0",
  "@angular/router": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@ionic/angular": "^7.5.0",
  "@capacitor/preferences": "^6.0.0",
  "@capacitor/push-notifications": "^6.0.0",
  "@capacitor/core": "^6.0.0"
}
```

## Directory Structure Migration

**React Native Structure:**
```
HealthFlow-Mobile/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js
│   │   ├── DashboardScreen.js
│   │   └── ...
│   └── services/
│       ├── authService.js
│       └── api.js
├── App.js
└── app.json
```

**Ionic Structure:**
```
HealthFlow-Ionic/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── api.service.ts
│   │   ├── shared/
│   │   │   └── guards/
│   │   └── app.routes.ts
│   ├── main.ts
│   └── index.html
├── ionic.config.json
└── capacitor.config.ts
```

## Testing on Devices

### React Native (Expo)
```bash
# Scan QR code with Expo Go app
expo start --android

# Build native app
eas build --platform android
```

### Ionic (Capacitor)
```bash
# Web dev server
ionic serve

# Build and open in Android Studio
ionic build
ionic cap open android

# Build and open in Xcode
ionic build
ionic cap open ios
```

## Common Issues & Solutions

### 1. TypeScript Strict Mode
- Angular enforces stricter type checking
- Add proper types to services and components
- Use `any` sparingly

### 2. Async/Await in Templates
- Angular doesn't directly support async/await in templates
- Use RxJS observables or store async results in component properties
- Use `async` pipe for observables in templates

### 3. Environment Variables
- React Native: `process.env.EXPO_PUBLIC_*`
- Ionic: `process.env['NG_APP_*']`
- Update `.env` file variable names

### 4. Module Not Found
- Ensure path aliases in `tsconfig.json` match imports
- Check that services are provided in root module

### 5. Capacitor Plugin Not Working
- Ensure native app is built: `ionic cap sync`
- Check plugin permissions in `capacitor.config.ts`
- Verify Android/iOS specific configurations

## Next Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Update Environment Variables:**
   - Update `.env` with your backend URL

3. **Test Web Version:**
   ```bash
   npm run ionic:serve
   ```

4. **Build for Android:**
   ```bash
   npm run ionic:build:android
   ```

5. **Build for iOS:**
   ```bash
   npm run ionic:build:ios
   ```

## Verification Checklist

- [ ] Login page working
- [ ] Authentication with backend successful
- [ ] Secure storage (auth token) working
- [ ] Dashboard loads patient data
- [ ] Patient list displays
- [ ] Patient details page works
- [ ] Tab navigation functioning
- [ ] Settings page accessible
- [ ] Logout clears data and redirects
- [ ] Push notifications registered
- [ ] Works on physical Android device
- [ ] Works on physical iOS device (Mac)
- [ ] Production build succeeds

## Resources

- [Ionic Documentation](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Capacitor Plugin List](https://capacitorjs.com/docs/plugins)

## Questions?

Refer to the original React Native code in `HealthFlow-Mobile` for logic and API references.
