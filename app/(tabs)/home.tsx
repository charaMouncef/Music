import SongCard from "@/components/SongCard";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
interface Song {
  id: string;
  title: string;
  uri: string;
  duration: number;
  modificationTime: number;
  folder: string;
  isFavorite: number;
}
export default function Home() {
  const examplePlaylist: Song[] = [
  {
    id: "1a2b3c",
    title: "Blinding Lights",
    uri: "file:///music/blinding_lights.mp3",
    duration: 200,
    modificationTime: 1672531200000,
    folder: "/music",
    isFavorite: 1
  },
  {
    id: "4d5e6f",
    title: "Levitating",
    uri: "file:///music/levitating.mp3",
    duration: 203,
    modificationTime: 1672617600000,
    folder: "/music",
    isFavorite: 0
  },
  {
    id: "7g8h9i",
    title: "Save Your Tears",
    uri: "file:///music/save_your_tears.mp3",
    duration: 215,
    modificationTime: 1672704000000,
    folder: "/music",
    isFavorite: 1
  },
  {
    id: "0j1k2l",
    title: "Peaches",
    uri: "file:///music/peaches.mp3",
    duration: 198,
    modificationTime: 1672790400000,
    folder: "/music",
    isFavorite: 0
  }
];

  return (
    <View className="h-screen flex-1 bg-[#1B100E] p-6 pt-12 ">
      <Text className="text-4xl font-semibold text-white mb-2">Your Mix</Text>
      <View className="flex-row justify-between items-center ">
        <Text className="text-xl text-white">Your mix for today</Text>
        <TouchableOpacity>
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
        <View className="bg-[#1B100E] gap-1">
          {examplePlaylist.map((song) => (
            <SongCard
              key={song.id}
              id={song.id}
              title={song.title}
              uri={song.uri}
              duration={song.duration}
              modificationTime={song.modificationTime}
              folder={song.folder}
              isFavorite={song.isFavorite}
            />
          ))}
        </View>
        <Link href="/" asChild>
        <TouchableOpacity className="bg-[#261817] flex-row items-center justify-around p-4 rounded-b-2xl">
          <Text className="text-xl text-white font-semibold">
            Check all of Daily Mix
          </Text>
          <MaterialIcons
            className="rotate-180"
            name="arrow-back"
            size={26}
            color="white"
          />
        </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
