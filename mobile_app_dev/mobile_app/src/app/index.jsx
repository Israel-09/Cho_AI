import React, { useEffect, useState } from "react";
import { Button, Image, Pressable, Text, View } from "react-native";
import onboardingImage from "../../assets/onboarding2.png";

import { useNavigation, useRouter } from "expo-router";
// import * as Linking from "expo-linking";
//  import {
//   signInWithCustomToken,
//   getAuth,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { auth } from "../../config/firebase";
// import * as AuthSession from "expo-auth-session";

// WebBrowser.maybeCompleteAuthSession();

// const redirectUri = AuthSession.makeRedirectUri({
//   scheme: "askchoapp",
// });

export default function Signup() {
  const navigation = useNavigation();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const base_url = process.env.APP_BASE_URL || "https://askcho.ai";
  // const [request, response, promptAsync] = AuthSession.useAuthRequest(
  //   {
  //     redirectUri: redirectUri,
  //     responseType: "token", // Or 'code', depending on your auth flow
  //     clientId: "YOUR_CLIENT_ID", // If needed by your auth provider
  //     scopes: ["email", "profile"], // If needed
  //   },
  //   { authorizationEndpoint: `http://192.168.0.180:5173/signin?source=mobile` }
  // );

  // useEffect(() => {
  //   if (response?.type === "success") {
  //     const { params } = response;
  //     // Handle the authentication token or code
  //     Alert.alert("Authentication successful", `Token: ${params.token}`);
  //     // You'll likely want to store the token securely and navigate to your app's main screen
  //   } else if (response?.type === "error") {
  //     Alert.alert("Authentication error", response.message || "Unknown error");
  //   }
  // }, []);

  // const HomePage = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const result = await WebBrowser.openBrowserAsync(
  //       `${base_url}/signup`,
  //       "myapp://auth",
  //       { preferEphemeralSession: true }
  //     );

  //     if (result.type === "cancel" || result.type === "dismiss") {
  //       setLoading(false);
  //       setError("Authentication cancelled");
  //       return;
  //     }
  //     console.log(result);
  //   } catch (error) {
  //     console.error("Error during signup:", error);
  //   }
  // };

  // const handleSignin = async () => {
  //   let result = await WebBrowser.openBrowserAsync("https://askcho.ai/signin");
  //   console.log(result);
  // };

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
          onPress={() => navigation.navigate("/")}
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
          onPress={() => navigation.navigate("auth/signup")}
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
          onPress={() => navigation.navigate("auth/login")}
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
