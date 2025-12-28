import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as MediaLibrary from "expo-media-library";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { usePermissions } from "../hooks/PermissionsContext";
export default function Second() {
  const { setPermission } = usePermissions() as any;


  const requestMediaPermission = async () => {
    const { status: existingStatus } = await MediaLibrary.getPermissionsAsync();
    let finalStatus = existingStatus;
    // Ask if not granted
    if (existingStatus !== "granted") {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      setPermission("media", finalStatus); // ✅ updates shared state

      return false;
    }
    setPermission("media", finalStatus); // ✅ updates shared state

    return true;
  };

  return (
    <View className="flex-1 py-8 bg-[#1B100E] justify-center ">
      <Text className="text-white text-center font-bold text-4xl">
        Media Permission
      </Text>

      <Image
        source={require("@/assets/images/second.png")}
        className="h-[300px] w-full"
      />

      <View className="p-6">
        <Text className="text-white text-xl font-bold text-center">
          PixelPlay needs access to your audio files to build your music
          library.
        </Text>

        <TouchableOpacity
          onPress={requestMediaPermission}
          className="bg-[#FEB4A9] rounded-full p-4 mt-6 items-center"
        >
          <Text className="text-[#1B100E] font-bold text-lg">
            Grant Media Permission
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[#FEB4A9] font-bold text-4xl">Step 1 of 3</Text>

          <Link href="/third" asChild>
            <TouchableOpacity className="bg-[#FEB4A9] rounded-full p-2">
              <MaterialIcons
                className="rotate-180"
                name="arrow-back"
                size={32}
              />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
