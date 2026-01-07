import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthflow.mobile',
  appName: 'HealthFlow',
  webDir: 'www',
  server: {
    androidScheme: 'https',
    iosSchemeLodging: 'https',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
  },
};

export default config;
