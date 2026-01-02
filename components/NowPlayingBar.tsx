import { useSong } from "@/hooks/SongContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Foundation from "@expo/vector-icons/Foundation";
import { useEffect, useRef } from "react";
import { Animated, Easing, Text, TouchableOpacity, View } from "react-native";

export default function NowPlayingBar() {
  const { setIsPlaying, isPlaying, currentSong, setIsOpen } = useSong();
  
  // Animation for disk rotation
  const spinValue = useRef(new Animated.Value(0)).current;
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);

  // Rotation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Control rotation based on play state
  useEffect(() => {
    if (isPlaying) {
      spinLoop.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 5000, // 5 seconds per rotation
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      spinLoop.current.start();
    } else {
      spinLoop.current?.stop();
    }

    return () => {
      spinLoop.current?.stop();
    };
  }, [isPlaying]);

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => setIsOpen(true)}
      className="absolute bottom-[65px] left-3 right-3 flex-row items-center bg-[#7A3321] rounded-2xl px-2 py-1 pr-4 shadow-lg"
    >
      {/* Rotating Disk */}
      <View className="w-[56px] h-[56px] items-center justify-center rounded-xl mr-4">
        <Animated.Image
          source={require("@/assets/images/record.png")}
          className="w-[56px] h-[56px]"
          style={{
            transform: [{ rotate: spin }],
          }}
        />
      </View>

      {/* Song Info */}
      <View className="flex-1">
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          className="text-white text-base font-semibold"
        >
          {currentSong?.title || "unknown"}
        </Text>
        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          unknown
        </Text>
      </View>

      {/* Controls */}
      <View className="flex-row items-center gap-4 ml-3">
        <TouchableOpacity>
          <AntDesign name="step-backward" size={30} color="#FEB4A9" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? (
            <Foundation name="pause" size={30} color="#FEB4A9" />
          ) : (
            <Foundation name="play" size={30} color="#FEB4A9" />
          )}
        </TouchableOpacity>

        <TouchableOpacity>
          <AntDesign name="step-forward" size={30} color="#FEB4A9" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}