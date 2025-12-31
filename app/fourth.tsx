import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import {getPermissionStatus} from "../utils/DataBase";
export default function Fourth() {
  const [errors, setErrors] = useState({ media: false, notifications: false });
  const [permissionsStatus, setPermissionsStatus] = useState({ media: "", notifications: "" });
  const [isDisable, setIsDisable] = useState(true);
  
  useEffect(() => {

    const fetchPermissionsStatus = async () => {
      const mediaStatus = await getPermissionStatus("media");
      const notificationsStatus = await getPermissionStatus("notifications");
      setPermissionsStatus({ media: mediaStatus, notifications: notificationsStatus });
    }

    fetchPermissionsStatus()



    const newErrors: any = { ...errors };
    if (permissionsStatus.media !== "granted") {
      newErrors.media = true;
    } else {
      newErrors.media = false;
    }
    if (permissionsStatus.notifications !== "granted") {
      newErrors.notifications = true;
    } else {
      newErrors.notifications = false;
    }
    setIsDisable(newErrors.media || newErrors.notifications);
    setErrors(newErrors);
  }, [permissionsStatus]);

  return (
    <View className="flex-1 py-8 bg-[#1B100E] justify-center">
      <Text className="text-white text-center font-bold text-4xl">
        {errors.media || errors.notifications ? "Almost There!" : "All Set!"}
      </Text>
      <Image
        source={require("@/assets/images/allGood.png")}
        className="h-[300px] w-full"
      />

      <View className="p-6">
        <Text className="text-white text-xl font-bold text-center">
          {errors.media && "• Media permission is not granted.\n"}
          {errors.notifications &&
            "• Notifications permission is not granted.\n"}
          {!errors.media &&
            !errors.notifications &&
            "You're ready to enjoy your music!"}
        </Text>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[#FEB4A9] font-bold text-4xl">Step 3 of 3</Text>

          <Link href="/(tabs)/home" asChild>
            <TouchableOpacity
              className={`rounded-full p-2 ${
                isDisable ? "bg-gray-400 opacity-50" : "bg-[#FEB4A9]"
              }`}
              disabled={isDisable}
            >
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
