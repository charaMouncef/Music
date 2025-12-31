import SongCard from "@/components/SongCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";

export default function Home() {
  return (
    <View className="h-screen flex-1 bg-[#1B100E] p-6 pt-12 ">
      <Text className="text-4xl font-semibold text-white mb-2">Your Mix</Text>
      <View className="flex-row justify-between items-center ">
        <Text className="text-xl text-white">Your mix for today</Text>
        <TouchableOpacity>
          <MaterialIcons
            className="bg-[#FEB4A9] rounded-full p-2"
            name="shuffle"
            size={38}
            color="rgba(17, 17, 17, 0.8)"
          />
        </TouchableOpacity>
      </View>
      <View className="w-full mt-6">
        <View className="bg-[#B18C72] p-4 rounded-t-2xl">
          <Text className="text-white text-2xl font-semibold">Daily Mix</Text>
          <Text className="text-white text-xl font-medium">
            Based on History
          </Text>
        </View>
        <View className="bg-[#1B100E] gap-1">
          <SongCard />
          <SongCard />
          <SongCard />
          <SongCard />
        </View>
        <Link href="/" asChild>
        <TouchableOpacity className="bg-[#261817] flex-row items-center justify-around p-4 rounded-b-2xl">
          <Text className="text-xl text-white font-semibold">
            Check all of Daily Mix
          </Text>
          <MaterialIcons
            className="rotate-180"
            name="arrow-back"
            size={26}
            color="white"
          />
        </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
