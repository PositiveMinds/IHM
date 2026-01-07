import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import PatientListScreen from './src/screens/PatientListScreen';
import PatientDetailScreen from './src/screens/PatientDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { authService } from './src/services/authService';
import { notificationService } from './src/services/notificationService';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: '#0066cc',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <View style={{ fontSize: 20 }}>📊</View>
          ),
        }}
      />
      <Tab.Screen
        name="Patients"
        component={PatientListScreen}
        options={{
          title: 'Patients',
          tabBarLabel: 'Patients',
          tabBarIcon: ({ color }) => (
            <View style={{ fontSize: 20 }}>👥</View>
          ),
        }}
      />
      <Tab.Screen
        name="Analysis"
        component={AnalysisScreen}
        options={{
          title: 'AI Analysis',
          tabBarLabel: 'Analyze',
          tabBarIcon: ({ color }) => (
            <View style={{ fontSize: 20 }}>🤖</View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => (
            <View style={{ fontSize: 20 }}>⚙️</View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await authService.getAuthToken();
        
        // Verify token is still valid
        if (userToken && !authService.isTokenValid(userToken)) {
          await authService.logout();
          userToken = null;
        }
      } catch (e) {
        console.error('Failed to restore token:', e);
      }

      // Register for push notifications
      try {
        const pushToken = await notificationService.registerForPushNotifications();
        if (pushToken) {
          console.log('Push notification token registered:', pushToken);
          // Send to backend to store for later notifications
        }
      } catch (error) {
        console.error('Failed to register for push notifications:', error);
      }

      // Subscribe to notifications
      const subscriptions = await notificationService.subscribeToNotifications((notification) => {
        console.log('Notification received:', notification);
      });

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });

      return () => {
        if (subscriptions) {
          notificationService.unsubscribeFromNotifications(subscriptions);
        }
      };
    };

    bootstrapAsync();
  }, []);

  if (state.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {state.userToken == null ? (
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              animationEnabled: false,
            }}
          />
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="MainTabs"
              component={DashboardTab}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="PatientDetail"
              component={PatientDetailScreen}
              options={{
                title: 'Patient Details',
                headerShown: true,
              }}
            />
          </Stack.Navigator>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
