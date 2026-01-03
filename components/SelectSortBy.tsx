import { SortType, useSort } from "@/hooks/SortContext";
import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function SelectSortBy() {
  const { sortedBy, setSortedBy, isOpenSelect, setIsOpenSelect } = useSort();
  const sheetRef = useRef<View>(null);
  
  // Animation value for slide up
  const slideAnim = useRef(new Animated.Value(0)).current;
  // For drag gesture
  const dragY = useRef(new Animated.Value(0)).current;
  const lastDragY = useRef(0);

  const isSelected = (value: SortType) => sortedBy === value;

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
        // If dragged more than 50px down, close the sheet
        if (gestureState.dy > 50) {
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

  // Handle open/close animation
  useEffect(() => {
    if (isOpenSelect) {
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
  }, [isOpenSelect]);

  // Combined transform - both the initial slide and drag gesture
  const translateY = Animated.add(
    slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [1000, 0],
    }),
    dragY
  );

  const handleClose = () => {
    // Slide down animation when closing
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setIsOpenSelect(false);
    });
  };

  if (!isOpenSelect) return null;

  return (
    <Animated.View
      className="absolute bottom-0 w-full h-full bg-black/50 justify-end items-center"
      style={{
        transform: [{ translateY }],
      }}
    >
      <Pressable
        className="absolute bottom-0 w-full h-full"
        onPress={handleClose}
      />
      
      <Animated.View
        ref={sheetRef}
        className="w-full p-4 bg-[#352726] rounded-t-2xl pb-12"
        
      >
        {/* Enhanced Drag handle with gesture support */}
        <View 
        {...panResponder.panHandlers}
        className="items-center w-full mb-6">
          <View 
            className="w-14 h-2 bg-white rounded-lg"
            
          />
          <Text className="text-white/60 text-xs mt-2">Drag down to close</Text>
        </View>

        {/* Title */}
        <Text className="text-4xl text-left font-bold mb-4 text-white/50">
          Sort By
        </Text>

        {/* Title (A-Z) */}
        <TouchableOpacity
          className={`w-[90%] rounded-full p-4 flex-row justify-between items-center self-center mb-2 ${
            isSelected("title(A-Z)") ? "bg-[#5D403C]" : "bg-[#281D1B]"
          }`}
          onPress={() => {
            setSortedBy("title(A-Z)");
            handleClose();
          }}
        >
          <Text
            className={`text-xl font-semibold ${
              isSelected("title(A-Z)") ? "text-[#FDDCD7]" : "text-white"
            }`}
          >
            Title (A-Z)
          </Text>

          <View className="border border-white rounded-full p-1">
            <View
              className={`rounded-full w-5 h-5 ${
                isSelected("title(A-Z)") ? "bg-white" : "bg-white/0"
              }`}
            />
          </View>
        </TouchableOpacity>

        {/* Title (Z-A) */}
        <TouchableOpacity
          className={`w-[90%] rounded-full p-4 flex-row justify-between items-center self-center mb-2 ${
            isSelected("title(Z-A)") ? "bg-[#5D403C]" : "bg-[#281D1B]"
          }`}
          onPress={() => {
            setSortedBy("title(Z-A)");
            handleClose();
          }}
        >
          <Text
            className={`text-xl font-semibold ${
              isSelected("title(Z-A)") ? "text-[#FDDCD7]" : "text-white"
            }`}
          >
            Title (Z-A)
          </Text>

          <View className="border border-white rounded-full p-1">
            <View
              className={`rounded-full w-5 h-5 ${
                isSelected("title(Z-A)") ? "bg-white" : "bg-white/0"
              }`}
            />
          </View>
        </TouchableOpacity>

        {/* Date Added */}
        <TouchableOpacity
          className={`w-[90%] rounded-full p-4 flex-row justify-between items-center self-center mb-2 ${
            isSelected("Date added") ? "bg-[#5D403C]" : "bg-[#281D1B]"
          }`}
          onPress={() => {
            setSortedBy("Date added");
            handleClose();
          }}
        >
          <Text
            className={`text-xl font-semibold ${
              isSelected("Date added") ? "text-[#FDDCD7]" : "text-white"
            }`}
          >
            Date Added
          </Text>

          <View className="border border-white rounded-full p-1">
            <View
              className={`rounded-full w-5 h-5 ${
                isSelected("Date added") ? "bg-white" : "bg-white/0"
              }`}
            />
          </View>
        </TouchableOpacity>

        {/* Duration */}
        <TouchableOpacity
          className={`w-[90%] rounded-full p-4 flex-row justify-between items-center self-center mb-2 ${
            isSelected("duration") ? "bg-[#5D403C]" : "bg-[#281D1B]"
          }`}
          onPress={() => {
            setSortedBy("duration");
            handleClose();
          }}
        >
          <Text
            className={`text-xl font-semibold ${
              isSelected("duration") ? "text-[#FDDCD7]" : "text-white"
            }`}
          >
            Duration
          </Text>

          <View className="border border-white rounded-full p-1">
            <View
              className={`rounded-full w-5 h-5 ${
                isSelected("duration") ? "bg-white" : "bg-white/0"
              }`}
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}