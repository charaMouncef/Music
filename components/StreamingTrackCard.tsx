import { useSong } from "@/hooks/SongContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Foundation from "@expo/vector-icons/Foundation";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Slider from "@react-native-community/slider";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, TouchableOpacity, View, Dimensions, PanResponder } from "react-native";
import { markSongAsFavorite, isFavoriteSong } from "@/utils/DataBase";
import AddToPlaylistModal from "./AddToPlaylistModal";

export default function StreamingTrackCard() {
  const { isOpen, setIsOpen, isPlaying, setIsPlaying, currentSong } = useSong();
  const [liked, setLiked] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  // 🔄 Animation values
  const spinValue = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const spinLoop = useRef<Animated.CompositeAnimation | null>(null);
  // For drag gesture
  const dragY = useRef(new Animated.Value(0)).current;
  const lastDragY = useRef(0);
  
  const screenHeight = Dimensions.get('window').height;

  // 🔁 Rotation interpolation
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Create PanResponder for drag gesture
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        dragY.setValue(0);
        lastDragY.current = 0;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow dragging downward (positive Y)
        if (gestureState.dy > 0) {
          dragY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged more than 100px down, close the sheet
        if (gestureState.dy > 100) {
          handleClose();
        } else {
          // If not dragged enough, animate back to position
          Animated.spring(dragY, {
            toValue: 0,
            useNativeDriver: true,
            damping: 20,
            stiffness: 90,
          }).start();
        }
        lastDragY.current = 0;
      },
    })
  ).current;

  // Combined transform - both the initial slide and drag gesture
  const translateY = Animated.add(
    slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [screenHeight, 0],
    }),
    dragY
  );

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (currentSong) {
        const favStatus = await isFavoriteSong(currentSong.id);
        setLiked(favStatus);
      }
    };
    checkIfFavorite();
  }, [currentSong]);

  // Handle open/close animation
  useEffect(() => {
    if (isOpen) {
      // Reset drag position
      dragY.setValue(0);
      // Start slide up animation
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 90,
      }).start();
    } else {
      // Reset animation when closed
      slideAnim.setValue(0);
    }
  }, [isOpen]);

  // ▶️ Play / Pause control
  useEffect(() => {
    if (isPlaying) {
      // Reset rotation (remove this line if you want resume instead)
      spinValue.setValue(0);

      spinLoop.current = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 5000, // rotation speed
          easing: Easing.linear, // constant speed
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
  }, [isPlaying, isOpen]);

  const getTitleFormatted = (title: string) => {
    return title.replace(/\.[^/.]+$/, "");
  };

  const handleClose = () => {
    console.log('handleClose called');
    
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      console.log('Animation completed, setting isOpen to false');
      setIsOpen(false);
    });
  };

  if (!isOpen) return null;

  return (
    <>
      <Animated.View 
        className="absolute bottom-0 w-full h-full bg-[#7A3321] p-4 rounded-t-2xl"
        style={{
          transform: [{ translateY }],
        }}
      >
        {/* Drag handle */}
        <View className="items-center w-full mb-4" {...panResponder.panHandlers}>
          <View className="w-14 h-2 bg-white/70 rounded-lg mb-1" />
          <Text className="text-white/60 text-xs">Drag down to close</Text>
        </View>

        {/* ⬅ Back */}
        <TouchableOpacity onPress={() => {
          console.log('Back button pressed');
          handleClose();
        }} className="mb-2">
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>

        {/* 💿 Album Art */}
        <Animated.Image
          source={require("@/assets/images/record.png")}
          className="w-[300px] h-[300px] self-center mt-6 mb-4"
          style={{
            transform: [{ rotate: spin }],
          }}
        />

        {/* 🎵 Track Info */}
        <View className="flex-row justify-between items-center px-4 mb-6">
          <View className="flex-1">
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-white font-semibold text-2xl"
            >
              {getTitleFormatted(currentSong?.title || "unknown")}
            </Text>
            <Text className="text-white">unknown artist</Text>
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity onPress={() => {
              markSongAsFavorite(currentSong?.id || "", !liked);
              setLiked(!liked);
            }}>
              {liked ? (
                <FontAwesome name="heart" size={24} color="#EBBBAF" />
              ) : (
                <FontAwesome name="heart-o" size={24} color="#EBBBAF" />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPlaylistModal(true)}>
              <Entypo name="plus" size={24} color="#EBBBAF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ⏱ Slider */}
        <Slider
          value={60}
          minimumValue={0}
          maximumValue={500}
          minimumTrackTintColor="#FEB4A9"
          maximumTrackTintColor="#222222"
          thumbTintColor="#FEB4A9"
          style={{ width: "100%", height: 4 }}
        />

        {/* ⌛ Time */}
        <View className="flex-row justify-between px-4 mt-4">
          <Text className="text-white font-semibold">0:0</Text>
          <Text className="text-white font-semibold">
            {formatTime(currentSong?.duration || 0) || "0:0"}
          </Text>
        </View>

        {/* 🎮 Controls */}
        <View className="flex-row justify-between items-center mt-10 px-8">
          <TouchableOpacity>
            <Entypo name="shuffle" size={30} color="#FEB4A9" />
          </TouchableOpacity>

          <TouchableOpacity>
            <AntDesign name="step-backward" size={30} color="#FEB4A9" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsPlaying(!isPlaying)}
            className="bg-[#EBBBAF] flex justify-center items-center rounded-full py-2 px-6"
          >
            {isPlaying ? (
              <Foundation name="pause" size={30} color="#7A3321" />
            ) : (
              <Foundation name="play" size={30} color="#7A3321" />
            )}
          </TouchableOpacity>

          <TouchableOpacity>
            <AntDesign name="step-forward" size={30} color="#FEB4A9" />
          </TouchableOpacity>

          <TouchableOpacity>
            <FontAwesome6 name="repeat" size={30} color="#FEB4A9" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <AddToPlaylistModal
        visible={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        songId={currentSong?.id || ""}
        songTitle={getTitleFormatted(currentSong?.title || "unknown")}
      />
    </>
  );
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};