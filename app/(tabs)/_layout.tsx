import NowPlayingBar from "@/components/NowPlayingBar";
import SelectSortBy from "@/components/SelectSortBy";
import { SortProvider } from "@/hooks/SortContext";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import StreamingTrackCard from "@/components/StreamingTrackCard";
import {SongProvider} from "@/hooks/SongContext";

export default function TabsLayout() {
  return (
    <SongProvider>
    <SortProvider>
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              paddingTop: 5,
              paddingBottom: 20,
              height: 60,
              backgroundColor: "#281d1bff",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              borderTopWidth: 0,
            },
            tabBarActiveTintColor: "#FEB4A9",
            tabBarInactiveTintColor: "gray",
            tabBarLabelStyle: {
              fontWeight: "600",
              fontSize: 12,
            },
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <Entypo name="home" size={26} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="search"
            options={{
              title: "Search",
              tabBarIcon: ({ color }) => (
                <Ionicons name="search" size={26} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: "Library",
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="library-music" size={26} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="statistics"
            options={{
              title: "Statistics",
              tabBarIcon: ({ color }) => (
                <Ionicons name="stats-chart" size={26} color={color} />
              ),
            }}
          />
        </Tabs>

        {/* 👇 Now Playing Bar */}
        <NowPlayingBar />
        <SelectSortBy/>
        <StreamingTrackCard />
      </View>
    </SortProvider>
    </SongProvider>
  );
}
