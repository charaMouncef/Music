import { Stack } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {
  


  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#1B100E" }}
        edges={["top","bottom"]}
      >
       
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
        
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
