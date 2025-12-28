import SongCard from "@/components/SongCard";
import Tabs from "@/components/Tabs";
import { getAudioFiles } from "@/hooks/getAudioFiles";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

interface Song {
  id: string;
  filename: string;
  artist: string;
  image?: string;
}

export default function Songs() {
  const [activeTab, setActiveTab] = useState("Songs");
  const [songsList, setSongsList] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  const TABS_LIST = ["Songs", "Playlists", "Artists", "Favorites"];

  useEffect(() => {
    const fetchAudioFiles = async () => {
      try {
        const tmp = await getAudioFiles();
        setSongsList(tmp || []);
      } catch (error) {
        console.error("Failed to fetch audio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudioFiles();
  }, []);

  return (
    <View className="flex-1 bg-[#1B100E] p-4 pt-12">
      <Text className="text-4xl font-bold text-[#FEB4A9]">Library</Text>

      <View className="mt-6">
        <Tabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          list={TABS_LIST}
        />
      </View>

      <View className="flex-1 mt-4">
        {loading ? (
          <ActivityIndicator size="large" color="#FEB4A9" className="mt-10" />
        ) : (
          <FlatList
            data={songsList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-2">
                <SongCard
                  title={item.filename}
                  image={item.image ?? ""}
                  artist={item.artist}
                  isRounded={true}
                />
              </View>
            )}
            
            ListEmptyComponent={
              <Text className="text-gray-400 text-center mt-10">
                No songs found.
              </Text>
            }
          />
        )}
      </View>
    </View>
  );
}
