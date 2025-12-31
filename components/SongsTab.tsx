import SongCard from "@/components/SongCard";
import { useSort } from "@/hooks/SortContext";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllAudioFilesFromDB } from "../utils/DataBase";
interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  folder: string;
  isFavorite: number;
}

export default function SongTabs() {
  const [songsList, setSongsList] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <View className="flex-1 mt-4">
      {loading ? (
        <ActivityIndicator size="large" color="#FEB4A9" className="mt-10" />
      ) : (
        <View className="flex-1 bg-[#1B100E] rounded-2xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity className="bg-[#FEB4A9] px-4 py-2 rounded-full flex-row items-center gap-1">
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
                <SongCard title={item.title} isRounded={true} />
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
