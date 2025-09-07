import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

type OnboardingImageProps = {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
};

export function OnboardingImage({
  iconName,
  size = 120,
  color = "#304FFE",
}: OnboardingImageProps) {
  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Ionicons name={iconName} size={size * 0.6} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f0f4ff",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
