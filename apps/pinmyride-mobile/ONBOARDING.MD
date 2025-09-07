Building a beautiful Onboarding Section with React Native Reanimated
Giulio Milani
Giulio Milani

Follow
11 min read
·
Aug 30, 2023
274

2

In this tutorial, we will walk through the process of creating an engaging onboarding section using React Native Reanimated. We’ll explain how to structure the components, implement smooth animations, and provide in-depth insights into using the Reanimated library.

Press enter or click to view image in full size

Prerequisites
Before you start, make sure you have the following prerequisites:

Basic understanding of React Native.
A working React Native development environment.
Familiarity with JavaScript and React concepts.
Getting Started
Let’s begin building our animated onboarding section step by step.

Project Setup
If you haven’t already, create a new React Native project using the following command:
npx create-expo-app --template
Select “Blank (TypeScript)”
Give a name to your app eg. “OnboardingApp”
Navigate to the project directory:
cd OnboardingApp
Install the necessary dependencies:
npx expo install react-native-reanimated
Add react-native-reanimated/plugin plugin to your babel.config.js.
module.exports = {
presets: [
...
],
plugins: [
...
'react-native-reanimated/plugin', // HERE
],
};
Let’s dive into the code and break down each component’s role and functionality.

Main App Component
The App component serves as the entry point for our onboarding section. It sets up the shared animated value x, handles scroll events, and renders the components:

import { useCallback, useRef } from 'react';
import {
ImageURISource,
Pressable,
SafeAreaView,
StyleSheet,
View,
ViewToken,
} from 'react-native';
import Animated, {
useAnimatedRef,
useAnimatedScrollHandler,
useSharedValue,
} from 'react-native-reanimated';
import ListItem from './ListItem';
import PaginationElement from './PaginationElement';
import Button from './Button';

const pages = [
{
text: 'Trusted by millions of people, part of one part',
image: require('./assets/Trust.png'),
},
{
text: 'Spend money abroad, and track your expense',
image: require('./assets/spendMoneyAbroad.png'),
},
{
text: 'Receive Money From Anywhere In The World',
image: require('./assets/receiveMoney.png'),
},
];

export default function App() {
const x = useSharedValue(0);
const flatListIndex = useSharedValue(0);
const flatListRef = useAnimatedRef<
Animated.FlatList<{
text: string;
image: ImageURISource;
}>

> ();

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
item: { text: string; image: ImageURISource };
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
keyExtractor={(\_, index) => index.toString()}
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
        />
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
},
bottomContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
paddingHorizontal: 20,
},
});
Exploring the code
Now that we’ve seen the complete code for the App component, let's break down the key concepts and functions used in this part.

Understanding the Shared Animated Values
Here, we’ll delve into the concept of shared animated values and their role in creating smooth animations.

The useSharedValue hook from react-native-reanimated is used to create the shared animated value x. This value will be shared across different components to keep track of the scroll position, ensuring that the animations stay synchronized.

const x = useSharedValue(0);
By utilizing a shared value, we’re able to achieve seamless communication between different components without unnecessary re-renders. This is crucial for maintaining performance and ensuring that animations remain fluid, especially during complex interactions.

Shared Animated Values and Animation Consistency
The shared animated value x plays a pivotal role in maintaining animation consistency across components. One of the primary goals of Shared Values is to provide a notion of shared memory in Reanimated, it runs animation code in a separate thread using a separate JS VM context. Shared Values make it possible to maintain a reference to mutable data that can be read and modified securely across those threads.

Shared Value objects serve as references to pieces of shared data that can be accessed and modified using their .value property. It is important to remember that whether anyone want to access or update shared data, it should use .value property (one of the most common sources of mistakes in Reanimated code, is to expect the Shared Value reference to return the data instead of accessing it's .value property).

Get Giulio Milani’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe
In order to provide secure and fast ways of accessing shared data across two threads, the reanimated team had to make some tradeoffs when designing Shared Values. As, during animations, updates most of the time happen on the UI thread, Shared Values are optimized to be updated and read from the UI thread. Hence, read and writes done from the UI thread are all synchronous, which means that when running from a worklet on the UI thread, anyone can update the value and expect it to be updated immediately after that call. The consequence of this choice is that updates made on the React Native JS thread are all asynchronous. Instead of those updates being immediate in such case, Reanimated core schedules the update to be performed on the UI thread, this way preventing any concurrency issues. When accessing and updating Shared Values from the React Native JS thread, it is best to think about it as if the value worked the same way as React’s state. We can make updates to the state, but the updates are not immediate, and in order to read the data we need to wait till the next re-render.

Understanding the Scroll Handler
The useAnimatedScrollHandler hook is a tool for handling scroll events and updating the shared animated value x.

const scrollHandle = useAnimatedScrollHandler({
onScroll: (event) => {
x.value = event.contentOffset.x;
},
});
In this code snippet, the scrollHandle function is used as an event handler for the scroll action. When the user scrolls, the onScroll callback is invoked with the event object containing scroll-related data. We update the x value with the current scroll position, ensuring that animations respond accurately to user interactions.

ListItem Component
The ListItem component is responsible for rendering each onboarding page. It uses Animated to animate the image and text based on the scroll position. Here’s the code:

import {
View,
useWindowDimensions,
ImageURISource,
StyleSheet,
} from 'react-native';
import React from 'react';
import Animated, {
Extrapolate,
interpolate,
useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
item: { text: string; image: ImageURISource };
index: number;
x: Animated.SharedValue<number>;
};

const ListItem = ({ item, index, x }: Props) => {
const { width: SCREEN*WIDTH } = useWindowDimensions();
const rnImageStyle = useAnimatedStyle(() => {
const translateY = interpolate(
x.value,
[
(index - 1) * SCREEN_WIDTH,
index * SCREEN_WIDTH,
(index + 1) * SCREEN_WIDTH,
],
[100, 0, 100],
Extrapolate.CLAMP
);
const opacity = interpolate(
x.value,
[
(index - 1) * SCREEN_WIDTH,
index * SCREEN_WIDTH,
(index + 1) * SCREEN_WIDTH,
],
[0, 1, 0],
Extrapolate.CLAMP
);
return {
opacity,
width: SCREEN_WIDTH * 0.7,
height: SCREEN*WIDTH * 0.7,
transform: [{ translateY}],
};
}, [index, x]);

const rnTextStyle = useAnimatedStyle(() => {
const translateY = interpolate(
x.value,
[
(index - 1) * SCREEN_WIDTH,
index * SCREEN_WIDTH,
(index + 1) * SCREEN_WIDTH,
],
[100, 0, 100],
Extrapolate.CLAMP
);
const opacity = interpolate(
x.value,
[
(index - 1) * SCREEN_WIDTH,
index * SCREEN_WIDTH,
(index + 1) * SCREEN_WIDTH,
],
[0, 1, 0],
Extrapolate.CLAMP
);
return {
opacity,
transform: [{ translateY}],
};
}, [index, x]);
return (
<View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
<Animated.Image
source={item.image}
style={rnImageStyle}
resizeMode="contain"
/>
<Animated.Text style={[styles.textItem, rnTextStyle]}>
{item.text}
</Animated.Text>
</View>
);
};

export default React.memo(ListItem);

const styles = StyleSheet.create({
itemContainer: {
flex: 1,
alignItems: 'center',
justifyContent: 'space-around',
},
textItem: {
fontWeight: '600',
lineHeight: 41,
fontSize: 34,
},
});
Utilizing the useAnimatedStyle Hook
Inside the ListItem component, we define animations that respond to the scroll position through useAnimatedStyle. These animations control the opacity and translation of the image and text elements:

const rnImageStyle = useAnimatedStyle(() => {
// ...
}, [index, x]);

const rnTextStyle = useAnimatedStyle(() => {
// ...
}, [index, x]);
The useAnimatedStyle hook lets us dynamically create styles based on the shared animated value x. As the user scrolls, the animations smoothly transition between different states, giving the illusion of elements moving and fading in or out.

Applying interpolate function to Achieve Smooth Transitions
In the context of our ListItem animations, we're using interpolate to dynamically adjust the properties of elements based on the scroll position. Let's take a closer look at how this is achieved:

const rnImageStyle = useAnimatedStyle(() => {
const translateY = interpolate(
x.value,
[(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
[100, 0, 100],
Extrapolate.CLAMP
);
const opacity = interpolate(
x.value,
[(index - 1) * SCREEN_WIDTH, index * SCREEN_WIDTH, (index + 1) * SCREEN_WIDTH],
[0, 1, 0],
Extrapolate.CLAMP
);
return {
opacity,
width: SCREEN*WIDTH * 0.7,
height: SCREEN*WIDTH * 0.7,
transform: [{ translateY}],
};
}, [index, x]);
Here, translateY and opacity are calculated using interpolate. The first argument is the shared animated value x, which represents the scroll position.

The second argument is an array representing the input range. In this case, it's the range of scroll positions where we want the animation to take effect:
In the context of our onboarding animation, the scroll position x.value represents the current offset along the horizontal axis of the FlatList. The input range values are defined as follows:

(index - 1) _ SCREEN_WIDTH: This corresponds to the scroll position at which the previous page starts transitioning out of view.
index _ SCREEN_WIDTH: This is the exact scroll position at which the current page is centered in the viewport.
(index + 1) \* SCREEN_WIDTH: This anticipates the scroll position at which the next page starts transitioning into view.
The third argument is the output range. It defines how the property should change based on the scroll position. For example, we’re animating the opacity, and transform properties of the image.

The Extrapolate.CLAMP parameter ensures that the animation values are clamped within the specified ranges, preventing unexpected behaviors.

PaginationElement Component
The PaginationElement component renders the pagination indicators below the onboarding pages. It uses reanimated to create dynamic styles for each indicator. Let's break it down:

import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import React, { useCallback } from 'react';
import Animated, {
Extrapolate,
interpolate,
interpolateColor,
useAnimatedStyle,
} from 'react-native-reanimated';

type Props = {
length: number;
x: Animated.SharedValue<number>;
};

const PaginationElement = ({ length, x }: Props) => {
const { width: SCREEN_WIDTH } = useWindowDimensions();

const PaginationComponent = useCallback(({ index }: { index: number }) => {
const itemRnStyle = useAnimatedStyle(() => {
const width = interpolate(
x.value,
[
(index - 1) * SCREEN_WIDTH,
index * SCREEN_WIDTH,
(index + 1) * SCREEN_WIDTH,
],
[35, 16, 35],
Extrapolate.CLAMP
);

      const bgColor = interpolateColor(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        ['#D0D0D0', '#304FFE', '#D0D0D0']
      );

      return {
        width,
        backgroundColor: bgColor,
      };
    }, [x]);
    return <Animated.View style={[styles.itemStyle, itemRnStyle]} />;

}, []);

return (
<View style={styles.container}>
{Array.from({ length }).map((\_, index) => {
return <PaginationComponent index={index} key={index} />;
})}
</View>
);
};

export default PaginationElement;

const styles = StyleSheet.create({
container: {
flexDirection: 'row',
justifyContent: 'center',
alignItems: 'center',
},
itemStyle: {
width: 35,
height: 10,
borderRadius: 5,

    marginHorizontal: 5,

},
});
Exploring the PaginationComponent
Let’s dive into the PaginationComponent and take a closer look to any anew functionalities that we haven’t discussed until now

Creating Dynamic Indicator Colors with interpolateColor
The interpolateColor function is a powerful feature of the react-native-reanimated library, allows us to smoothly transition between colors based on a given input range. In our PaginationComponent, we utilize interpolateColor to dynamically adjust the background color of each indicator dot according to the scroll position.

const PaginationComponent = ({ index }) => {
const itemRnStyle = useAnimatedStyle(() => {
// ...
const bgColor = interpolateColor(
x.value,
[
(index - 1) * SCREEN_WIDTH,
index * SCREEN_WIDTH,
(index + 1) * SCREEN_WIDTH,
],
['#D0D0D0', '#304FFE', '#D0D0D0']
);
return {
// ...
backgroundColor: bgColor,
};
}, [x]);
// ...
};
The bgColor is calculated using interpolateColor with an input range based on scroll positions. The output colors [ '#D0D0D0', '#304FFE', '#D0D0D0' ] correspond to the background colors of the indicator dot for three different scroll positions:

When the previous page is transitioning out of view ('#D0D0D0').
When the current page is in focus ('#304FFE').
When the next page is transitioning into view ('#D0D0D0').
Button Component
The Button component provides the navigation capabilities. It uses reanimated to animate the button's style and text position based on the scroll position:

import {
ImageURISource,
Pressable,
StyleSheet,
Text,
View,
} from 'react-native';
import React, { useCallback } from 'react';
import Animated, {
useAnimatedStyle,
withSpring,
withTiming,
} from 'react-native-reanimated';

type Props = {
currentIndex: Animated.SharedValue<number>;
length: number;
flatListRef: any;
};
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Button = ({ currentIndex, length, flatListRef }: Props) => {
const rnBtnStyle = useAnimatedStyle(() => {
return {
width:
currentIndex.value === length - 1 ? withSpring(140) : withSpring(60),
height: 60,
};
}, [currentIndex, length]);

const rnTextStyle = useAnimatedStyle(() => {
return {
opacity:
currentIndex.value === length - 1 ? withTiming(1) : withTiming(0),
transform: [
{
translateX:
currentIndex.value === length - 1 ? withTiming(0) : withTiming(100),
},
],
};
}, [currentIndex, length]);

const imageAnimatedStyle = useAnimatedStyle(() => {
return {
opacity:
currentIndex.value !== length - 1 ? withTiming(1) : withTiming(0),
transform: [
{
translateX:
currentIndex.value !== length - 1 ? withTiming(0) : withTiming(100),
},
],
};
}, [currentIndex, length]);

const onPress = useCallback(() => {
if (currentIndex.value === length - 1) {
console.log('Get Started');
return;
} else {
flatListRef?.current?.scrollToIndex({
index: currentIndex.value + 1,
});
}
}, []);
return (
<AnimatedPressable style={[styles.container, rnBtnStyle]} onPress={onPress}>
<Animated.Text style={[styles.textStyle, rnTextStyle]}>
Get Started
</Animated.Text>
<Animated.Image
source={require('./assets/arrow.png')}
style={[styles.imageStyle, imageAnimatedStyle]}
/>
</AnimatedPressable>
);
};

export default Button;

const styles = StyleSheet.create({
container: {
flexDirection: 'row',
paddingHorizontal: 24,
paddingVertical: 16,
borderRadius: 100,
backgroundColor: '#304FFE',
alignItems: 'center',
justifyContent: 'center',
overflow: 'hidden',
},
textStyle: {
color: 'white',
position: 'absolute',
fontWeight: '600',
fontSize: 16,
},
imageStyle: {
width: 24,
height: 24,
position: 'absolute',
},
});
Enhancing Interaction with withSpring and withTiming
In this segment, we’ll dive into the significance of the withSpring and withTiming functions within the Button component. These functions play a pivotal role in creating engaging and natural animations, ensuring a nice user experience during interactions within the onboarding section.

Applying Spring Animation with withSpring
The withSpring function is a tool that adds a touch of realism and interactivity to animations by simulating a spring-like motion. In the context of the Button component, withSpring is employed to achieve dynamic and fluid transitions in button width based on user interaction.

const rnBtnStyle = useAnimatedStyle(() => {
const width = currentIndex.value === length - 1 ? withSpring(140) : withSpring(60);
return {
width,
height: 60,
};
}, [currentIndex, length]);
Timing Animation with withTiming
In other instances, the withTiming function is employed to control opacity and translation of certain components within the Button component. This function enables precise control over the timing and execution of animations, allowing us to orchestrate smooth and harmonious visual effects.

const rnTextStyle = useAnimatedStyle(() => {
const opacity = currentIndex.value === length - 1 ? withTiming(1) : withTiming(0);
const translateX = currentIndex.value === length - 1 ? withTiming(0) : withTiming(100);
return {
opacity,
transform: [{ translateX }],
};
}, [currentIndex, length]);
The Result
Press enter or click to view image in full size

Conclusion
Congratulations! You’ve successfully created an interactive onboarding section using React Native Reanimated. This tutorial provided a step-by-step breakdown of the components, animations, and interactions involved. By leveraging the power of Animated and useAnimated... hooks from react-native-reanimated, you've built a smooth and engaging onboarding experience.

Feel free to customize and enhance the onboarding section further, experiment with different animations, and add your unique design elements. The React Native Reanimated library empowers you to create dynamic and visually appealing user interfaces.

React Native Reanimated
React Native
Mobile App Development
Mobile Ux
274

2

Giulio Milani
Written by Giulio Milani
134 followers
·
35 following
Mobile developer with 3+ years focused with React native & Flutter. Passionate about creating cross-platform performant apps with an engaging user experiences.

Follow
Responses (2)

Write a response

What are your thoughts?

Cancel
Respond
Tiyalo
Tiyalo

Jul 24

Great article, if you don't mind can you share GitHub Link ?
Reply

Burak Erdem
Burak Erdem

Sep 6, 2023

Great article! I would also use Moti library as it makes composing animations much easier with declarative style.
Reply

More from Giulio Milani
Handling large files in Expo with expo-file-system
Stackademic
In

Stackademic

by

Giulio Milani

Handling large files in Expo with expo-file-system
Handling with files in Expo? Avoid OOM crashes with smart techniques and a custom plugin! 🚀🔥
Mar 23
2
Creating an Animated Bottom Navigation Bar with React Native Reanimated
Stackademic
In

Stackademic

by

Giulio Milani

Creating an Animated Bottom Navigation Bar with React Native Reanimated
Create captivating animated bottom navigation bars in React Native with Reanimated. Elevate your app’s UX!
Oct 11, 2023
54
3
Creating an Animated Carousel with React Native Reanimated
Stackademic
In

Stackademic

by

Giulio Milani

Creating an Animated Carousel with React Native Reanimated
Creating an Animated Carousel with React Native Reanimated. Elevate your app with animated transitions! 🚀
Dec 18, 2023
31
Unleashing iOS Dynamic Islands in Your React Native App: A Step-by-Step Guide
Stackademic
In

Stackademic

by

Giulio Milani

Unleashing iOS Dynamic Islands in Your React Native App: A Step-by-Step Guide
Explore iOS Dynamic Islands in React Native: Master Live Activities setup, native modules, and seamless integration. Let’s begin!
Dec 27, 2023
170
See all from Giulio Milani
Recommended from Medium
🏗️ Zero-Drama Releases: A 2025 CI/CD Blueprint for React 📱 Native (TestFlight, Play Console, OTA…
The Expert Developer
The Expert Developer

🏗️ Zero-Drama Releases: A 2025 CI/CD Blueprint for React 📱 Native (TestFlight, Play Console, OTA…
Shipping great features is fun.

Aug 27
35
1
How to use GoogleFonts in expo react native
Rudraksh
Rudraksh

How to use GoogleFonts in expo react native
install fonts with npx

Mar 25
20 React Native One-Liners That Will Blow Your Mind
Jayant Kumar
Jayant Kumar

20 React Native One-Liners That Will Blow Your Mind
Small lines of code can save you hours of work — if you know the right tricks.

Aug 27
2
1
React Native Skeleton Loaders: Elevate Your App’s UX with Shimmering Placeholders
Andrew Chester
Andrew Chester

React Native Skeleton Loaders: Elevate Your App’s UX with Shimmering Placeholders
Skeleton loaders are the shimmering placeholders you see in apps like YouTube, Twitter, or Notion, creating a polished, responsive user…
Apr 25
9
Still Manually Managing React Native Forms? Let Formik Do the Work
Mrinal Maheshwari
Mrinal Maheshwari

Still Manually Managing React Native Forms? Let Formik Do the Work
Formik makes form logic feel effortless. Learn how to clean up your inputs, validations, and submit flows with a few lines of code.

Apr 23
Understanding React Native Component Architecture: A Deep Dive into Building Modular Apps
Abdullah Sevmez
Abdullah Sevmez

Understanding React Native Component Architecture: A Deep Dive into Building Modular Apps
How Components Power React Native Apps — From Basics to Best Practices

Apr 18
1
See more recommendations
Help

Status

About

Careers

Press

Blog

Privacy

Rules

Terms

Text to speech
