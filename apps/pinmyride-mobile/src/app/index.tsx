import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the tabs by default
  return <Redirect href="/(tabs)" />;
}
