import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, Text, View, ScrollView } from "react-native";
import onboardingImage from "../../assets/onboarding2.png";
import LoadingScreen from "../components/LoadingScreen";
import { Link, useNavigation, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function Signup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  if (user) {
    router.replace("/chat/home");
  }

  useEffect(() => {
    //show loading page for 1 second then redirect to home if already logged in
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <LoadingScreen visible={loading} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black justify-center px-4 py-5">
      <View>
        <Image
          source={onboardingImage}
          className="w-full h-64"
          resizeMode="contain"
        />
      </View>
      <View className="mt-8 mb-10">
        <Text className="text-white text-2xl font-light text-center">
          Hi! I'm AskCho, your AI buddy.
        </Text>
      </View>

      <View className="flex-row my-4 rounded-lg overflow-hidden">
        <Pressable
          className="flex-1 bg-white p-3 items-center"
          onPress={() => router.push("/chat/home")}
        >
          {({ pressed }) => (
            <Text
              className={`text-black font-light ${
                pressed ? "opacity-70" : ""
              } text-center text-xl`}
            >
              ASKCHO ANYTHING
            </Text>
          )}
        </Pressable>
      </View>
      <View className="flex-row rounded-lg overflow-hidden">
        <Pressable
          android_ripple={{ color: "rgba(255,255,255,0.2)" }} // ripple for Android
          className="flex-1 bg-white p-3 items-center"
          onPress={() => router.push("/auth/signup")}
        >
          {({ pressed }) => (
            <Text
              className={`text-xl text-black font-light ${
                pressed ? "opacity-70" : ""
              } text-center`}
            >
              NEW TO ASKCHO?{"\n"}SIGN UP
            </Text>
          )}
        </Pressable>

        <Pressable
          android_ripple={{ color: "rgba(255,255,255,0.2)" }}
          className="flex-1 bg-white p-3 items-center border-l border-black/20"
          onPress={() => router.push("/auth/login")}
        >
          {({ pressed }) => (
            <Text
              className={`text-xl text-black font-light ${
                pressed ? "opacity-70" : ""
              } text-center`}
            >
              ALREADY FRIENDS?{"\n"}SIGN IN
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
