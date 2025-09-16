import "../global.css";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../hooks/useAuth";

export default function Layout() {
  return (
    <SafeAreaProvider className="flex-1">
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "black" },
            headerTitleStyle: { color: "white" },
            headerTintColor: "white",
            animation: "fade",
          }}
        />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
