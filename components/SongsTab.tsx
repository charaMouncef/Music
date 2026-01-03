import SongCard from "@/components/SongCard";
import { useSort } from "@/hooks/SortContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useSong } from "@/hooks/SongContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllAudioFilesFromDB,shuffleAllSongs } from "../utils/DataBase";
interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}

export default function SongTabs() {
  const [songsList, setSongsList] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying, playAllSongs } = useSong();
  const { sortedBy, setIsOpenSelect } = useSort();

  useEffect(() => {
    const fetchAudioFiles = async () => {
      setLoading(true);
      try {
        const tmp = await getAllAudioFilesFromDB(sortedBy);
        setSongsList(tmp || []);
      } catch (error) {
        console.error("Failed to fetch audio:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAudioFiles();
  }, [sortedBy]);

    const handleShuffleAll = async () => {
      try {
        const allSongs = await shuffleAllSongs();
        if (allSongs.length > 0) {
          playAllSongs(allSongs, 0); // Play all songs starting from first
        }
      } catch (error) {
        console.error("Error shuffling songs:", error);
      }
    };

  return (
    <View className="flex-1 mt-4">
      {loading ? (
        <ActivityIndicator size="large" color="#FEB4A9" className="mt-10" />
      ) : (
        <View 
        style={{paddingBottom: isPlaying ? 70 : 0}}
        className={`flex-1 bg-[#1B100E] rounded-2xl p-4`}>
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity 
            onPress={handleShuffleAll}
            className="bg-[#FEB4A9] px-4 py-2 rounded-full flex-row items-center gap-1">
              <FontAwesome6 name="shuffle" size={24} color="black" />
              <Text className="text-[#1B100E] font-semibold text-xl">
                Shuffle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsOpenSelect(true)}
              className="bg-[#FEB4A9] px-4 py-2 rounded-full flex-row items-center"
            >
              <FontAwesome name="sort-amount-desc" size={24} color="#1B100E" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={songsList}
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
                No songs found.
              </Text>
            }
          />
        </View>
      )}
    </View>
  );
}
