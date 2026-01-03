import SongCard from "@/components/SongCard";
import { useSong } from "@/hooks/SongContext";
import { getDailyMix, shuffleAllSongs } from "@/utils/DataBase";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}

export default function Home() {
  const [dailyMix, setDailyMix] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { playAllSongs, isPlaying } = useSong();

  useEffect(() => {
    fetchDailyMix();
  }, []);

  const fetchDailyMix = async () => {
    setLoading(true);
    try {
      const mix = await getDailyMix(10); // Get 10 random songs
      setDailyMix(mix);
    } catch (error) {
      console.error("Error fetching daily mix:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <View className="flex-1 bg-[#1B100E] justify-center items-center">
        <ActivityIndicator size="large" color="#FEB4A9" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#1B100E]">
      <View className="p-6 pt-12">
        <Text className="text-4xl font-semibold text-white mb-2">Your Mix</Text>
        <View className="flex-row justify-between items-center">
          <Text className="text-xl text-white">Your mix for today</Text>
          <TouchableOpacity onPress={handleShuffleAll}>
            <MaterialIcons
              className="bg-[#FEB4A9] rounded-full p-2"
              name="shuffle"
              size={38}
              color="rgba(17, 17, 17, 0.8)"
            />
          </TouchableOpacity>
        </View>
        <View className="w-full mt-6">
          <View className="bg-[#B18C72] p-4 rounded-t-2xl">
            <Text className="text-white text-2xl font-semibold">Daily Mix</Text>
            <Text className="text-white text-xl font-medium">
              Based on History
            </Text>
          </View>
          <View
            style={{ marginBottom: isPlaying ? 60 : 0 }}
            className="bg-[#1B100E] gap-1 rounded-b-2xl overflow-hidden"
          >
            {dailyMix.length === 0 ? (
              <View className="p-8 ">
                <Text className="text-gray-400 text-center text-lg ">
                  No songs available for daily mix
                </Text>
              </View>
            ) : (
              dailyMix.map((song) => (
                <SongCard
                  key={song.id}
                  id={song.id}
                  title={song.title}
                  uri={song.uri}
                  duration={song.duration}
                  modificationTime={song.modificationTime}
                  isFavorite={song.isFavorite}
                  isRounded={false}
                />
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
