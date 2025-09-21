import { Stack, router } from "expo-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.replace("/chat/home"); // Redirect to home or another route
    }
  }, [user]);

  if (!user) {
    return (
      <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return null;
}
