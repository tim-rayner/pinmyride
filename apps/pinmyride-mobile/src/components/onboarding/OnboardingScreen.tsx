import { useCallback } from "react";
import { SafeAreaView, StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { useAuth } from "../../contexts/AuthContext";
import Button from "./Button";
import ListItem from "./ListItem";
import PaginationElement from "./PaginationElement";

const pages = [
  {
    title: "Welcome to PinMyRide",
    text: "Your personal ride companion that helps you track, plan, and enjoy every journey with confidence.",
    iconName: "bicycle" as const,
  },
  {
    title: "Track Your Rides",
    text: "Keep track of all your rides, routes, and destinations. Never lose your way again with our intelligent tracking system.",
    iconName: "location" as const,
  },
  {
    title: "Plan & Discover",
    text: "Discover new routes, plan your trips, and share your favorite rides with friends. Make every ride an adventure.",
    iconName: "map" as const,
  },
];

export default function OnboardingScreen() {
  const { completeOnboarding } = useAuth();
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);
  const flatListRef = useAnimatedRef<
    Animated.FlatList<{
      text: string;
      iconName: string;
      title: string;
    }>
  >();

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      flatListIndex.value = viewableItems[0].index ?? 0;
    },
    []
  );

  const scrollHandle = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({
      item,
      index,
    }: {
      item: { text: string; iconName: string; title: string };
      index: number;
    }) => {
      return <ListItem item={item} index={index} x={x} />;
    },
    [x]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        ref={flatListRef}
        onScroll={scrollHandle}
        horizontal
        scrollEventThrottle={16}
        pagingEnabled={true}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        bounces={false}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
      />
      <View style={styles.bottomContainer}>
        <PaginationElement length={pages.length} x={x} />
        <Button
          currentIndex={flatListIndex}
          length={pages.length}
          flatListRef={flatListRef}
          onGetStarted={completeOnboarding}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
});
