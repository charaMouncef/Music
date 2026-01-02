import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View, FlatList } from "react-native";
import SongCard from "@/components/SongCard";
import { useSong } from "@/hooks/SongContext";
import { getSongsInSearch, saveSearchQuery, getSearchHistory, deleteSearchQuery, deleteSearchHistory } from "@/utils/DataBase";

interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}

interface SearchHistoryItem {
  id: number;
  query: string;
  searchedAt: string;
}

export default function Songs() {
  const {currentSong} = useSong();
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [fetchedSongs, setFetchedSongs] = useState<Song[]>([]);
  const [showingResults, setShowingResults] = useState(false);

  useEffect(() => {
    // Fetch recent searches from the database on component mount
    const fetchRecentSearches = async () => {
      const searches = await getSearchHistory();
      setRecentSearches(searches);
    };
    fetchRecentSearches();
  }, []);

  // Function to delete a single item
  const deleteItem = async (itemToDelete: string) => {
    await deleteSearchQuery(itemToDelete);
    const updatedSearches = await getSearchHistory();
    setRecentSearches(updatedSearches);
  };

  // Function to clear all items
  const clearAll = async () => {
    await deleteSearchHistory();
    setRecentSearches([]);
  };

  // Function to handle search submission
  const handleSearch = async () => {
    if (search.trim()) {
      await saveSearchQuery(search.trim());
      const songs = await getSongsInSearch(search.trim());
      setFetchedSongs(songs);
      setShowingResults(true);
      const updatedSearches = await getSearchHistory();
      setRecentSearches(updatedSearches);
    }
  };

  // Function to handle clicking a recent search
  const handleRecentSearchClick = async (query: string) => {
    setSearch(query);
    const songs = await getSongsInSearch(query);
    setFetchedSongs(songs);
    setShowingResults(true);
  };

  const handleClearSearch = () => {
    setShowingResults(false);
    setSearch("");
    setFetchedSongs([]);
  };

  return (
    <View className="h-screen flex-1 bg-[#1B100E] pt-6">
      {/* Search Bar */}
      <View className="flex-row items-center space-x-2 px-4 border-b border-gray-400">
        
        <Ionicons name="search" size={26} color="#FEB4A9" />
        <TextInput
          className="ml-2 flex-1 h-14 placeholder:text-[#FEB4A9] text-white text-xl p-2"
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
          placeholder="Search..."
          onSubmitEditing={handleSearch}
        />
        {search && (
          <TouchableOpacity onPress={() => handleClearSearch()}>
            <MaterialIcons name="clear" size={26} color="#FEB4A9" />
          </TouchableOpacity>
        )}
      </View>

      {showingResults ? (
        // Search Results
        <View className="flex-1">
          {fetchedSongs.length === 0 ? (
            <Text className="text-gray-400 text-xl font-bold text-center px-4 mt-20">
              No songs found
            </Text>
          ) : (
            <FlatList
              data={fetchedSongs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SongCard id={item.id} title={item.title} uri={item.uri} duration={item.duration} modificationTime={item.modificationTime} isRounded={true} isFavorite={item.isFavorite}/>} 
              ItemSeparatorComponent={() => <View className="h-3" />}
              contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 12, paddingBottom: currentSong ? 80 : 10 }}
            />
          )}
        </View>
      ) : (
        // Recent Searches
        <>
          {recentSearches.length === 0 ? (
            <Text className="text-gray-400 text-xl font-bold text-center px-4 mt-20">
              No recent searches
            </Text>
          ) : (
            <View className="mt-4 px-4">
              <Text className="text-gray-500 px-4 mt-4">Recent Searches</Text>
              <View className="bg-[#261817] p-4 rounded-t-md mt-2 space-y-4 border-b border-b-gray-400">
                {recentSearches.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    className={`flex-row items-center justify-between ${
                      index !== recentSearches.length - 1 ? "py-2" : ""
                    }`}
                    onPress={() => handleRecentSearchClick(item.query)}
                  >
                    <Text className="text-white text-xl">{item.query}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.query)}>
                      <MaterialIcons name="clear" size={26} color="white" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                className="py-4 bg-[#261817] rounded-b-md"
                onPress={clearAll}
              >
                <Text className="text-white text-center text-lg">Clear all</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}