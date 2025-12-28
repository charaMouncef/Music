import SongCard from "@/components/SongCard";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
export default function Songs() {
  const [activeTab, setActiveTab] = useState("Songs");
  const List = ["Songs", "Playlists", "Artists", "Favorites", "Folders"];
  const SongsList = [
    {
      title: "song of rome",
      image: require("@/assets/images/ivoxygen.png"),
    },
    {
      title: "keep your eyes peeled",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 2",
    },
    {
      title: "melancholy hill",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 3",
    },
    {
      title: "sunny days",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 4",
    },
    {
      title: "rainy nights",
      image: require("@/assets/images/ivoxygen.png"),
      artist: "Artist 5",
    },
  ];
  return (
    <View className="h-screen flex-1 bg-[#1B100E] p-4 pt-12 ">
      <Text className="text-4xl font-bold text-[#FEB4A9]">Library</Text>
      <View className="mt-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} list={List} />
      </View>
      <ScrollView className="mt-4 flex-1">
      {SongsList.map((song, index) => (
        <View key={index} className="mb-2">
          <SongCard title={song.title} image={song.image} artist={song.artist} isRounded={true} />
        </View>
      ))}
      </ScrollView>
    </View>
  );
}
