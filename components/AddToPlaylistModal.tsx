import {
  addSongToPlaylist,
  createPlaylist,
  getAllPlaylists,
  isSongInPlaylist,
} from "@/utils/DataBase";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Playlist {
  id: number;
  name: string;
  createdAt: string;
  songCount: number;
}

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  songId: string;
  songTitle: string;
}

export default function AddToPlaylistModal({
  visible,
  onClose,
  songId,
  songTitle,
}: AddToPlaylistModalProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [loading, setLoading] = useState(false);
  const [songInPlaylists, setSongInPlaylists] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (visible) {
      setShowCreateNew(false);
      setNewPlaylistName("");
      fetchPlaylists();
    }
  }, [visible]);

  const fetchPlaylists = async () => {
    try {
      const data = await getAllPlaylists();
      console.log("All Playlists:", data);
      console.log("Playlists length:", data?.length);
      setPlaylists(data || []);

      // Check which playlists already contain this song
      const inPlaylists = new Set<number>();
      for (const playlist of data) {
        const isIn = await isSongInPlaylist(playlist.id, songId);
        if (isIn) {
          inPlaylists.add(playlist.id);
        }
      }
      setSongInPlaylists(inPlaylists);
    } catch (error) {
      console.error("Failed to fetch playlists:", error);
    }
  };

  const handleAddToPlaylist = async (
    playlistId: number,
    playlistName: string
  ) => {
    setLoading(true);
    try {
      const isAlreadyIn = await isSongInPlaylist(playlistId, songId);

      if (isAlreadyIn) {
        Alert.alert(
          "Already Added",
          `"${songTitle}" is already in "${playlistName}"`
        );
      } else {
        const success = await addSongToPlaylist(playlistId, songId);
        if (success) {
          Alert.alert("Success", `Added "${songTitle}" to "${playlistName}"`);
          setSongInPlaylists((prev) => new Set(prev).add(playlistId));
          handleClose(); // Close modal after adding song
        } else {
          Alert.alert("Error", "Failed to add song to playlist");
        }
      }
    } catch (error) {
      console.error("Error adding song to playlist:", error);
      Alert.alert("Error", "Failed to add song to playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAndAdd = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }

    setLoading(true);
    try {
      const playlistId = await createPlaylist(newPlaylistName.trim());
      if (playlistId) {
        const success = await addSongToPlaylist(playlistId, songId);
        if (success) {
          Alert.alert("Success", `Created "${newPlaylistName}" and added song`);
          handleClose(); // Close modal after creating and adding song
        } else {
          Alert.alert("Error", "Playlist created but failed to add song");
        }
      } else {
        Alert.alert("Error", "Failed to create playlist");
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
      Alert.alert("Error", "Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowCreateNew(false);
    setNewPlaylistName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView behavior="height" className="flex-1">
        <View className="flex-1 justify-start items-center bg-black/50 pt-12 px-4">
          <View
            className="bg-[#1B100E] rounded-3xl w-full max-w-lg"
            style={{ maxHeight: "70%" }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
              <Text className="text-white text-xl font-bold">
                Add to Playlist
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <MaterialIcons name="close" size={28} color="white" />
              </TouchableOpacity>
            </View>

            {/* Song Info */}
            <View className="p-4 border-b border-gray-700">
              <Text className="text-gray-400 text-sm">Adding:</Text>
              <Text
                numberOfLines={1}
                className="text-white text-lg font-semibold"
              >
                {songTitle}
              </Text>
            </View>

            {/* Playlists List */}
            <View style={{ minHeight: 200, maxHeight: 400 }}>
              {playlists.length === 0 ? (
                <View className="p-8 items-center">
                  <Ionicons
                    name="musical-notes-outline"
                    size={48}
                    color="#666"
                  />
                  <Text className="text-gray-400 text-center mt-4">
                    No playlists yet. Create one to get started!
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={playlists}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    const isInPlaylist = songInPlaylists.has(item.id);
                    return (
                      <TouchableOpacity
                        onPress={() => handleAddToPlaylist(item.id, item.name)}
                        disabled={loading || isInPlaylist}
                        className="flex-row items-center justify-between p-4 border-b border-gray-800"
                      >
                        <View className="flex-row items-center flex-1">
                          <View className="bg-[#261817] w-12 h-12 rounded-lg items-center justify-center mr-3">
                            <MaterialIcons
                              name="queue-music"
                              size={24}
                              color="#FEB4A9"
                            />
                          </View>
                          <View className="flex-1">
                            <Text className="text-white text-lg font-semibold">
                              {item.name}
                            </Text>
                            <Text className="text-gray-400 text-sm">
                              {item.songCount} songs
                            </Text>
                          </View>
                        </View>
                        {isInPlaylist ? (
                          <Ionicons
                            name="checkmark-circle"
                            size={24}
                            color="#10b981"
                          />
                        ) : (
                          <MaterialIcons
                            name="add-circle-outline"
                            size={24}
                            color="#FEB4A9"
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              )}
            </View>

            {/* Create New Playlist Button/Form - Fixed at bottom */}
            <View className="border-t border-gray-700">
              {showCreateNew ? (
                <View className="p-4">
                  <Text className="text-white text-lg font-semibold mb-3">
                    New Playlist
                  </Text>
                  <TextInput
                    className="bg-[#261817] text-white p-3 rounded-lg mb-3"
                    placeholder="Playlist name"
                    placeholderTextColor="#999"
                    value={newPlaylistName}
                    onChangeText={setNewPlaylistName}
                    autoFocus
                  />
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => {
                        setShowCreateNew(false);
                        setNewPlaylistName("");
                      }}
                      className="flex-1 bg-[#261817] p-3 rounded-lg"
                    >
                      <Text className="text-white text-center font-semibold">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCreateAndAdd}
                      disabled={loading}
                      className="flex-1 bg-[#FEB4A9] p-3 rounded-lg"
                    >
                      <Text className="text-[#1B100E] text-center font-semibold">
                        {loading ? "Creating..." : "Create & Add"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => setShowCreateNew(true)}
                  className="flex-row items-center justify-center p-4"
                >
                  <View className="bg-[#FEB4A9] w-10 h-10 rounded-full items-center justify-center mr-3">
                    <MaterialIcons name="add" size={24} color="black" />
                  </View>
                  <Text className="text-white text-lg font-semibold">
                    Create New Playlist
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
