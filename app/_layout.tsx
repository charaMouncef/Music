import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import { PermissionsProvider } from "../hooks/PermissionsContext";
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#1B100E" }}
        edges={["top"]}
      >
        <PermissionsProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: "#1B100E",
              },
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </PermissionsProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
