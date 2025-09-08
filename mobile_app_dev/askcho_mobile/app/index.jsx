import { View, Image } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Progress from "react-native-progress";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Logo from "../assets/logo.png";

// Prevent native splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function SlashPage() {
  const router = useRouter();
  const opacity = useSharedValue(1); // Animation value for fade-out

  // Animated style for fade-out effect using NativeWind classes
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  useEffect(() => {
    // Start fade-out after 4 seconds
    const fadeTimer = setTimeout(() => {
      opacity.value = withTiming(0, { duration: 1000 }); // Fade out over 1 second
    }, 4000);

    // Redirect after 5 seconds
    const redirectTimer = setTimeout(async () => {
      await SplashScreen.hideAsync();
      router.replace("auth/signup"); // Or '/onboarding' if preferred
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, [router, opacity]);

  return (
    <View className="flex-1 bg-black justify-center items-center">
      <Animated.View
        className="flex-1 justify-center items-center px-8"
        style={animatedStyle}
      >
        <Image
          source={Logo}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />
        <Progress.Bar
          indeterminate
          color="#1976d2" // MUI primary color
          className="w-4/5 mt-10"
        />
      </Animated.View>
    </View>
  );
}
