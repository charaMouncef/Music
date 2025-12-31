import Ionicons from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import { Text, View, Pressable } from "react-native";

export default function NowPlayingBar({
  isPlaying = false,
}: {
  isPlaying: boolean;
}) {
  return (
    <Pressable
      className="
        absolute bottom-[65px] left-3 right-3
        flex-row items-center
        bg-[#804C1A]
        rounded-2xl
        px-2 py-1 pr-4
        shadow-lg
      "
    >
      {/* Album / Icon */}
      <View className="w-[56px] h-[56px] bg-[#2C1F1D] items-center justify-center rounded-xl mr-4">
        <Ionicons size={36} name="musical-notes" color="#9CA3AF" />
      </View>

      {/* Song Info */}
      <View className="flex-1">
        <Text
          className="text-white text-base font-semibold"
          numberOfLines={1}
        >
          unknown
        </Text>
        <Text
          className="text-gray-400 text-sm"
          numberOfLines={1}
        >
          unknown
        </Text>
      </View>

      {/* Controls */}
      <View className="flex-row items-center gap-4 ml-3">
        <Pressable>
          <Foundation name="previous" size={30} color="#FEB4A9" />
        </Pressable>

        <Pressable>
          {isPlaying ? (
            <Foundation name="pause" size={30} color="#FEB4A9" />
          ) : (
            <Foundation name="play" size={30} color="#FEB4A9" />
          )}
        </Pressable>

        <Pressable>
          <Foundation name="next" size={30} color="#FEB4A9" />
        </Pressable>
      </View>
    </Pressable>
  );
}
