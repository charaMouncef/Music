import { useSong } from "@/hooks/SongContext";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, TouchableOpacity, View } from "react-native";
export default function SongCard({
  id,
  title,
  uri,
  duration,
  modificationTime,
  isFavorite,
  isRounded = false,

}: {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
  isRounded?: boolean;
}) {
  const { setCurrentSong, setIsPlaying, currentSong } = useSong();
  const getTitle = (title:string)=>{
    return title.replace(/\.[^/.]+$/, "");
  }
  return (
    <TouchableOpacity
      onPress={() => {
        setCurrentSong({
          id,
          title,
          uri,
          duration,
          modificationTime,
          isFavorite,
        });
        setIsPlaying(true);
      }}
      className={`bg-[#281D1B] py-2 px-1 flex-row items-center justify-between ${currentSong?.id === id ? "bg-[#48231D]" : "bg-[#281D1B]"} ${isRounded ? "rounded-xl" : ""}`}
    >
      <View className="flex-row items-center flex-1">
        <View className="w-[60px] h-[60px] bg-[#3E2E2C] flex items-center justify-center mr-4 ml-2 rounded-xl">
          <Ionicons size={40} name="musical-notes" color="gray" />
        </View>
        <View className="overflow-hidden flex-1">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-white text-lg font-medium"
          >
            {getTitle(title) || "unknown"}
          </Text>
          <Text className="text-gray-400 text-md">unknown artist</Text>
        </View>
      </View>
      {isRounded && (
        <TouchableOpacity className="p-2">
          <Entypo name="dots-three-vertical" size={24} color="grey" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}
