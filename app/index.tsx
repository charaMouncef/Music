import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
export default function Index() {
  return (
    <View className=" flex-1 py-12 bg-[#1B100E] ">
      <Text className="text-white text-center font-bold text-4xl ">
        Welcome to PixelPlay
      </Text>
      <Image source={require("@/assets/images/bg.png")} className="w-full" />
      <View className="p-6 ">
        <Text className="text-white text-2xl font-bold ">
          Let's get everything set up for you
        </Text>
        <View className="mt-6 flex-row items-center justify-between">
          <Text className="text-[#FEB4A9] text-center font-bold text-4xl">
            Let's go
          </Text>
          <Link href="/second" asChild>
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
