import SongCard from "@/components/SongCard";
import { useSong } from "@/hooks/SongContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getAllFolders, getFolderSongs } from "../utils/DataBase";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}

interface Folder {
  name: string;
  songCount: number;
}

export default function Folders() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [folderSongs, setFolderSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const { isPlaying } = useSong();

  // Fetch all folders
  useEffect(() => {
    fetchFolders();
  }, []);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const data = await getAllFolders();
      setFolders(data || []);
    } catch (error) {
      console.error("Failed to fetch folders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch songs for selected folder
  const handleFolderClick = async (folder: Folder) => {
    setSelectedFolder(folder);
    setLoading(true);
    try {
      const songs = await getFolderSongs(folder.name);
      setFolderSongs(songs || []);
    } catch (error) {
      console.error("Failed to fetch folder songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Go back to folders list
  const handleBack = () => {
    setSelectedFolder(null);
    setFolderSongs([]);
  };

  if (loading && !selectedFolder) {
    return (
      <View className="flex-1 justify-center items-center bg-[#1B100E]">
        <ActivityIndicator size="large" color="#FEB4A9" />
      </View>
    );
  }

  // View: Folder Songs
  if (selectedFolder) {
    return (
      <View className="flex-1 mt-4 rounded-2xl bg-[#1B100E]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
          <TouchableOpacity onPress={handleBack} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#FEB4A9" />
            <Text className="text-white text-xl font-bold ml-2">{selectedFolder.name}</Text>
          </TouchableOpacity>
          <Text className="text-gray-400">{folderSongs.length} songs</Text>
        </View>

        {/* Songs List */}
        <View style={{ paddingBottom: isPlaying ? 70 : 0 }} className="flex-1 p-4">
          {loading ? (
            <ActivityIndicator size="large" color="#FEB4A9" className="mt-10" />
          ) : folderSongs.length === 0 ? (
            <Text className="text-gray-400 text-center mt-10 text-lg">
              No songs in this folder
            </Text>
          ) : (
            <FlatList
              data={folderSongs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SongCard
                  id={item.id}
                  title={item.title}
                  uri={item.uri}
                  duration={item.duration}
                  modificationTime={item.modificationTime}
                  isFavorite={item.isFavorite}
                  isRounded={true}
                />
              )}
              ItemSeparatorComponent={() => <View className="h-2" />}
            />
          )}
        </View>
      </View>
    );
  }

  // View: All Folders
  return (
    <View className="flex-1 bg-[#1B100E] mt-4 rounded-2xl">
      <View style={{ paddingBottom: isPlaying ? 70 : 0 }} className="flex-1 rounded-2xl p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl font-bold">Folders</Text>
        </View>

        {/* Folders List */}
        {folders.length === 0 ? (
          <Text className="text-gray-400 text-center mt-10 text-lg">
            No folders found
          </Text>
        ) : (
          <FlatList
            data={folders}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleFolderClick(item)}
                className="bg-[#261817] p-4 rounded-lg mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-[#FEB4A9] w-12 h-12 rounded-lg items-center justify-center mr-3">
                    <MaterialIcons name="folder" size={24} color="black" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-semibold">{item.name}</Text>
                    <Text className="text-gray-400 text-sm">{item.songCount} songs</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#FEB4A9" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}