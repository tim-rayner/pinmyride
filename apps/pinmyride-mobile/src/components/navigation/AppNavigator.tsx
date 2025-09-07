import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import SignInScreen from "../auth/SignInScreen";
import OnboardingScreen from "../onboarding/OnboardingScreen";
import MainApp from "./MainApp";

export default function AppNavigator() {
  const { isAuthenticated, hasSeenOnboarding, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#304FFE" />
      </View>
    );
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen />;
  }

  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  return <MainApp />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
});
