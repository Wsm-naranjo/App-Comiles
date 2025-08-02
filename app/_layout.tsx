import { Stack } from "expo-router";
import '../global.css';
import { UserProvider } from '../services/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/LoginScreen" />
        <Stack.Screen name="auth/AccessDenied" />
        <Stack.Screen name="plugins/loading" />
        <Stack.Screen name="plugins/logout" />

        <Stack.Screen name="dashboard" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
}

