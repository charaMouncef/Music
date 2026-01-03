import SongCard from "@/components/SongCard";
import { useSong } from "@/hooks/SongContext";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Alert,
} from "react-native";
import { getAllPlaylists, createPlaylist, getPlaylistSongs, deletePlaylist } from "../utils/DataBase";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  isFavorite: number;
}

interface Playlist {
  id: number;
  name: string;
  createdAt: string;
  songCount: number;
}

export default function Playlists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { isPlaying } = useSong();

  // Fetch all playlists
  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const data = await getAllPlaylists();
      setPlaylists(data || []);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch songs for selected playlist
  const handlePlaylistClick = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    try {
      const songs = await getPlaylistSongs(playlist.id);
      setPlaylistSongs(songs || []);
    } catch (error) {
      console.error("Failed to fetch playlist songs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create new playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }

    const playlistId = await createPlaylist(newPlaylistName.trim());
    if (playlistId) {
      setNewPlaylistName("");
      setShowCreateModal(false);
      fetchPlaylists();
    } else {
      Alert.alert("Error", "Failed to create playlist");
    }
  };

  // Delete playlist
  const handleDeletePlaylist = async (playlistId: number) => {
    Alert.alert(
      "Delete Playlist",
      "Are you sure you want to delete this playlist?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const success = await deletePlaylist(playlistId);
            if (success) {
              fetchPlaylists();
              if (selectedPlaylist?.id === playlistId) {
                setSelectedPlaylist(null);
              }
            }
          },
        },
      ]
    );
  };

  // Go back to playlists list
  const handleBack = () => {
    setSelectedPlaylist(null);
    setPlaylistSongs([]);
  };

  if (loading && !selectedPlaylist) {
    return (
      <View className="flex-1 justify-center items-center bg-[#1B100E]">
        <ActivityIndicator size="large" color="#FEB4A9" />
      </View>
    );
  }

  // View: Playlist Songs
  if (selectedPlaylist) {
    return (
      <View className="flex-1 mt-4 rounded-2xl bg-[#1B100E]">
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
          <TouchableOpacity onPress={handleBack} className="flex-row items-center">
            <Ionicons name="arrow-back" size={24} color="#FEB4A9" />
            <Text className="text-white text-xl font-bold ml-2">{selectedPlaylist.name}</Text>
          </TouchableOpacity>
          <Text className="text-gray-400">{playlistSongs.length} songs</Text>
        </View>

        {/* Songs List */}
        <View style={{ paddingBottom: isPlaying ? 70 : 0 }} className="flex-1 p-4">
          {loading ? (
            <ActivityIndicator size="large" color="#FEB4A9" className="mt-10" />
          ) : playlistSongs.length === 0 ? (
            <Text className="text-gray-400 text-center mt-10 text-lg">
              No songs in this playlist yet
            </Text>
          ) : (
            <FlatList
              data={playlistSongs}
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

  // View: All Playlists
  return (
    <View className="flex-1 bg-[#1B100E] mt-4 rounded-2xl">
      <View style={{ paddingBottom: isPlaying ? 70 : 0 }} className="flex-1 rounded-2xl p-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl font-bold">Playlists</Text>
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-[#FEB4A9] px-4 py-2 rounded-full flex-row items-center gap-2"
          >
            <MaterialIcons name="add" size={24} color="black" />
            <Text className="text-[#1B100E] font-semibold text-lg">New</Text>
          </TouchableOpacity>
        </View>

        {/* Playlists List */}
        {playlists.length === 0 ? (
          <Text className="text-gray-400 text-center mt-10 text-lg">
            No playlists yet. Create one to get started!
          </Text>
        ) : (
          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handlePlaylistClick(item)}
                className="bg-[#261817] p-4 rounded-lg mb-3 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="bg-[#FEB4A9] w-12 h-12 rounded-lg items-center justify-center mr-3">
                    <MaterialIcons name="queue-music" size={24} color="black" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-lg font-semibold">{item.name}</Text>
                    <Text className="text-gray-400 text-sm">{item.songCount} songs</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleDeletePlaylist(item.id)}>
                  <MaterialIcons name="delete" size={24} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      {/* Create Playlist Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-[#261817] p-6 rounded-2xl w-4/5">
            <Text className="text-white text-xl font-bold mb-4">Create Playlist</Text>
            <TextInput
              className="bg-[#1B100E] text-white p-3 rounded-lg mb-4"
              placeholder="Playlist name"
              placeholderTextColor="#999"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View className="flex-row justify-end gap-3">
              <TouchableOpacity
                onPress={() => {
                  setShowCreateModal(false);
                  setNewPlaylistName("");
                }}
                className="px-4 py-2"
              >
                <Text className="text-gray-400 text-lg">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreatePlaylist}
                className="bg-[#FEB4A9] px-6 py-2 rounded-lg"
              >
                <Text className="text-[#1B100E] font-semibold text-lg">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}