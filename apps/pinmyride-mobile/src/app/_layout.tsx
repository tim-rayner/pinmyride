import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import AppNavigator from "../components/navigation/AppNavigator";

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}