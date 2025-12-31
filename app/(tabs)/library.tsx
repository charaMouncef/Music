import SongCard from "@/components/SongCard";
import Tabs from "@/components/Tabs";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllAudioFilesFromDB } from "../../utils/DataBase";
import SongTabs from "@/components/SongsTab";
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
      <Text className="text-4xl font-bold text-[#FEB4A9] px-4 mb-2">Library</Text>

      <View className="px-4">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          list={TABS_LIST}
        />
      </View>

      {activeTab === "Songs" && (
        <SongTabs />
      )}
    </View>
  );
}
