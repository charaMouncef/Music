import Tabs from "@/components/Tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator } from "react-native";
import { getListeningStats, getMostPlayedSongs } from "@/utils/DataBase";

interface MostPlayedSong {
  id: string;
  title: string;
  artist: string | null;
  plays: number;
  totalDuration: number;
}

interface Stats {
  totalTime: number;
  totalPlays: number;
}

export default function Statistics() {
  const [activeTab, setActiveTab] = useState("Today");
  const [mostPlayed, setMostPlayed] = useState<MostPlayedSong[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTime: 0, totalPlays: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, [activeTab]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      const period = getDateRange(activeTab);
      const [statsData, songsData] = await Promise.all([
        getListeningStats(period),
        getMostPlayedSongs(period, 5),
      ]);
      
      setStats(statsData);
      setMostPlayed(songsData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = (tab: string) => {
    const now = new Date();
    let startDate = new Date();

    switch (tab) {
      case "Today":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "This Week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "This Month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "This Year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case "All Time":
        startDate = new Date(0); // Beginning of time
        break;
    }

    return startDate.toISOString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)} s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} m`;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.round((seconds % 3600) / 60);
    return minutes > 0 ? `${hours} h ${minutes} m` : `${hours} h`;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#1B100E] justify-center items-center">
        <ActivityIndicator size="large" color="#FEB4A9" />
      </View>
    );
  }

  return (
    <View className="h-screen flex-1 bg-[#1B100E] pt-12">
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
          <Text className="text-white text-4xl font-bold">
            {formatDuration(stats.totalTime)}
          </Text>
          <Text className="text-white/70 font-semibold">
            Across {stats.totalPlays} plays
          </Text>
        </View>

        <View className="bg-[#352726] p-6 rounded-xl mt-4">
          <Text className="text-white font-semibold text-xl mb-2">
            Most played songs
          </Text>
          
          {mostPlayed.length === 0 ? (
            <Text className="text-gray-400 text-center mt-4">
              No listening history for this period
            </Text>
          ) : (
            mostPlayed.map((item, index) => (
              <View key={item.id} className="flex-row items-center mt-4">
                <View className="w-16 h-16 rounded-lg mr-4 bg-[#3E2E2C] flex items-center justify-center">
                  <Ionicons size={40} name="musical-notes" color="gray" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-medium">
                    {index + 1}. {item.title}
                  </Text>
                  <Text className="text-gray-400">
                    {item.artist || "Unknown Artist"}
                  </Text>
                  <Text className="text-gray-400">
                    {item.plays} plays - {formatDuration(item.totalDuration)}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}