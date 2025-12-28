import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Songs() {
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState([
    "Apple",
    "Banana",
    "Cherry",
    "Date",
  ]);

  // Function to delete a single item
  const deleteItem = (itemToDelete: string) => {
    setRecentSearches(recentSearches.filter((item) => item !== itemToDelete));
  };

  // Function to clear all items
  const clearAll = () => {
    setRecentSearches([]);
  };

  // Function to handle search submission
  const handleSearch = () => {
    if (search.trim() !== "" && !recentSearches.includes(search.trim())) {
      setRecentSearches([search.trim(), ...recentSearches]);
    }
    setSearch("");
  };

  return (
    <View className="h-screen flex-1 bg-[#1B100E] pt-6 ">
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
          <TouchableOpacity onPress={() => setSearch("")}>
            <MaterialIcons name="clear" size={26} color="#FEB4A9" />
          </TouchableOpacity>
        )}
      </View>

      {/* Recent Searches */}
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
                key={index}
                className={`flex-row items-center justify-between ${
                  index !== recentSearches.length - 1 ? "py-2" : ""
                }`}
              >
                <Text className="text-white text-xl">{item}</Text>
                <TouchableOpacity onPress={() => deleteItem(item)}>
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
    </View>
  );
}
