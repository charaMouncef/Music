import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getPermissionStatus, initializeDatabase, getAndStoreAudioFiles } from "../utils/DataBase";

export default function Index() {
  const router = useRouter(); 
  const [permissionsStatus, setPermissionsStatus] = useState({
    media: null,
    notifications: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Initialize DB and Check Permissions on Mount
  useEffect(() => {
    const setup = async () => {
      // Initialize DB schema first
      await initializeDatabase();

      const mediaStatus = await getPermissionStatus("media");
      const notificationsStatus = await getPermissionStatus("notifications");

      setPermissionsStatus({
        media: mediaStatus,
        notifications: notificationsStatus,
      });
      
      if (mediaStatus === "granted") {
        // Fetch and save audio files to DB
        await getAndStoreAudioFiles();
      }
    };
    setup();
  }, []);

  // 2. Separate Effect for Navigation based on state changes
  useEffect(() => {
    if(permissionsStatus.notifications === "granted" && permissionsStatus.media === "granted"){
      router.replace("/(tabs)/home")
    }else{
      setIsLoading(false);
    }
  }, [permissionsStatus, router]);
     

  return isLoading ? (
    <View className="flex-1 justify-center items-center bg-[#1B100E]">
      <ActivityIndicator size="large" color="#FEB4A9" />
    </View>
  ) : (
    <View className="flex-1 py-12 bg-[#1B100E]">
      <Text className="text-white text-center font-bold text-4xl">
        Welcome to PixelPlay
      </Text>

      <Image source={require("@/assets/images/bg.png")} className="w-full" />

      <View className="p-6">
        <Text className="text-white text-2xl font-bold">
          Let's get everything set up for you
        </Text>

        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[#FEB4A9] text-center font-bold text-4xl">
            Let's go
          </Text>

          <Link href="/second" asChild>
            <TouchableOpacity className="bg-[#FEB4A9] rounded-full p-2">
              <MaterialIcons
                style={{ transform: [{ rotate: "180deg" }] }}
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