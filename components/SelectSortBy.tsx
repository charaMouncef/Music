import { SortType, useSort } from "@/hooks/SortContext";
import { useRef } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export default function SelectSortBy() {
  const { sortedBy, setSortedBy, isOpenSelect, setIsOpenSelect } = useSort();
  const sheetRef = useRef<View>(null);

  const isSelected = (value: SortType) => sortedBy === value;

  if (!isOpenSelect) return null;

  return (
    <Pressable
      className="absolute bottom-0 w-full h-full bg-gray-500/10 justify-end items-center transition duration-300"
      onPress={() => setIsOpenSelect(false)} 
    >
      
      <Pressable
        ref={sheetRef}
        className="w-full p-4 bg-[#352726] rounded-2xl pb-12"
        onPress={() => {}}
      >
        {/* Drag handle */}
        <View className="w-14 h-2 bg-white rounded-lg self-center mb-6" />

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
            setIsOpenSelect(false);
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
            setIsOpenSelect(false);
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
            setIsOpenSelect(false);
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
            setIsOpenSelect(false);
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
      </Pressable>
    </Pressable>
  );
}
