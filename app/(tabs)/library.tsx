import SongTabs from "@/components/SongsTab";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import { Text, View } from "react-native";
interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  folder: string;
  isFavorite: number;
}

export default function Songs() {
  const [activeTab, setActiveTab] = useState("Songs");

  const TABS_LIST = ["Songs", "Playlists", "Favorites", "Folders"];

  return (
    <View className="flex-1 bg-[#48231D] pt-12">
      <Text className="text-4xl font-bold text-[#FEB4A9] px-4 mb-2">
        Library
      </Text>

      <View className="px-4">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          list={TABS_LIST}
        />
      </View>

      {activeTab === "Songs" && <SongTabs />}
    </View>
  );
}
