import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../hooks/useAuth";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function Layout() {
  return (
    <SafeAreaProvider className="flex-1">
      <AuthProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "black" },
              headerTitleStyle: { color: "white" },
              headerTintColor: "white",
              animation: "fade",
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          </Stack>
        </KeyboardAvoidingView>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
