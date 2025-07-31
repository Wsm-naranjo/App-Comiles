import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import React from 'react';
import '../global.css';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="dashboard"
          options={{
            drawerLabel: 'Dashboard',
            title: 'Dashboard',
          }}
        />
        <Drawer.Screen
          name="auth/LoginScreen"
          options={{
            drawerLabel: 'Login',
            title: 'Login',
            headerShown: false,
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
