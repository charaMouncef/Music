import Tabs from "@/components/Tabs";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("Today");
  const List = [
    {
      title: "song of rome",
      plays: 10,
      duration: "57 m",
      image: require("@/assets/images/ivoxygen.png"),
    },
    {
      title: "keep your eyes peeled",
      plays: 8,
      duration: "45 m",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 2",
    },
    {
      title: "melancholy hill",
      plays: 5,
      duration: "30 m",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 3",
    },
    {
      title: "sunny days",
      plays: 3,
      duration: "20 m",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 4",
    },
    {
      title: "rainy nights",
      plays: 2,
      duration: "15 m",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 5",
    },
  ];
  return (
    <View className="h-screen flex-1 bg-[#1B100E]  pt-12 ">
      <Text className="text-4xl px-6 font-bold text-white">
        Listening Stats
      </Text>
      <View className="mt-6 px-2">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          list={["Today", "This Week", "This Month", "This Year", "All Time"]}
        />
      </View>
      <ScrollView className="mt-4 px-4">
        <View className="bg-[#543C3A] p-6 flex justify-between gap-3 rounded-xl">
          <Text className="text-white/50 font-semibold text-xl">
            {activeTab}
          </Text>
          <Text className="text-white text-4xl font-bold">38 m</Text>
          <Text className="text-white/70 font-semibold">Across 15 plays</Text>
        </View>
        <View className="bg-[#352726] p-6 rounded-xl mt-4">
          <Text className="text-white font-semibold text-xl">Top artists</Text>
          {List.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between mt-4"
            >
              <View className="flex-row items-center">
                <Image
                  source={item.image}
                  className="w-12 h-12 rounded-lg mr-4"
                />
                <View>
                  <Text className="text-white text-lg font-medium">
                    {index + 1}. {item.title}
                  </Text>
                  <Text className="text-gray-400">{item.plays} plays</Text>
                </View>
              </View>
              <Text className="text-white font-bold text-xl">
                {item.duration}
              </Text>
            </View>
          ))}
        </View>
        <View className="bg-[#352726] p-6 rounded-xl mt-4">
          <Text className="text-white font-semibold text-xl">
            Most song played
          </Text>
          {List.map((item, index) => (
            <View key={index} className="flex-row items-center mt-4  ">
              <Image
                source={item.image}
                className="w-16 h-16 rounded-lg mr-4 "
              />
              <View className="flex-1 ">
                <Text className="text-white text-lg font-medium">
                  {index + 1}. {item.title}
                </Text>

                <Text className="text-gray-400">
                  {item.artist ? item.artist : "unknown "}
                </Text>
                <Text className="text-gray-400">
                  {item.plays} plays - {item.duration}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
