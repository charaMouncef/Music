import SongCard from "@/components/SongCard";
import { useSong } from "@/hooks/SongContext";
import { getFavoriteSongs } from "@/utils/DataBase";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}
export default function Favorites() {
  const { isPlaying } = useSong();
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavoriteSongs = async () => {
      try {
        const favSongs = await getFavoriteSongs();
        setFavoriteSongs(favSongs || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch favorite songs:", error);
      }
    };
    fetchFavoriteSongs();
  }, [favoriteSongs]);
  return (
    <View className="flex-1 mt-4">
      {isLoading ? (
        <ActivityIndicator size="large" color="#FEB4A9" className="mt-10" />
      ) : (
        <View
          style={{ paddingBottom: isPlaying ? 70 : 0 }}
          className={`flex-1 bg-[#1B100E] rounded-2xl p-4`}
        >
          <FlatList
            data={favoriteSongs}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-2">
                <SongCard
                  id={item.id}
                  title={item.title}
                  uri={item.uri}
                  duration={item.duration}
                  modificationTime={item.modificationTime}
                  isFavorite={item.isFavorite}
                  isRounded={true}
                />
              </View>
            )}
            ListEmptyComponent={
              <Text className="text-gray-400 text-center mt-10">
                No favorite songs found.
              </Text>
            }
          />
        </View>
      )}
    </View>
  );
}
