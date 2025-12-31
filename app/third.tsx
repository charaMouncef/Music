import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Notifications from "expo-notifications";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { changePermissionStatus } from "../utils/DataBase";
export default function Third() {
  const requestNotificationPermission = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission only if not already granted
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      await changePermissionStatus("notifications", finalStatus);
    } catch (error) {
      console.log("Error requesting media permission:", error);
    }
  };

  return (
    <View className="flex-1 py-8 bg-[#1B100E] justify-center ">
      <Text className="text-white text-center font-bold text-4xl">
        Notifications
      </Text>

      <Image
        source={require("@/assets/images/notification.png")}
        className="h-[300px] w-full"
      />

      <View className="p-6 ">
        <Text className="text-white text-xl font-bold text-center">
          Enable notifications to control your music from the lock screen and
          notification center.
        </Text>

        <TouchableOpacity
          onPress={requestNotificationPermission}
          className="bg-[#FEB4A9] rounded-full p-4 mt-6 items-center"
        >
          <Text className="text-[#1B100E] font-bold text-lg">
            Enable Notifications
          </Text>
        </TouchableOpacity>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[#FEB4A9] font-bold text-4xl">Step 2 of 3</Text>

          <Link href="/fourth" asChild>
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
