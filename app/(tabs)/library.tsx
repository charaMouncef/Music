import SongTabs from "@/components/SongsTab";
import Favorites from "@/components/Favorites";
import Playlists from "@/components/PlayLists";
import Folders from "@/components/Folders";
import Tabs from "@/components/Tabs";
import { useState } from "react";
import { Text, View } from "react-native";


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
      {activeTab === "Favorites" && <Favorites />}
      {activeTab === "Playlists" && <Playlists />}
      {activeTab === "Folders" && <Folders />}
    </View>
  );
}
