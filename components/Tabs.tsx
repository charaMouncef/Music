import React, { useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from "react-native";

export default function Tabs({
  list,
  activeTab,
  setActiveTab,
}: {
  list: string[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const [tabLayouts, setTabLayouts] = useState<
    Record<string, { x: number; width: number }>
  >({});

  const onTabLayout = (item: string) => (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [item]: { x, width } }));
  };

  const handlePress = (item: string) => {
    setActiveTab(item);

    const layout = tabLayouts[item];
    if (!layout || !scrollRef.current) return;

    scrollRef.current.scrollTo({
      x: layout.x + layout.width / 2 - 180, 
      animated: true,
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <View className="flex-row items-center gap-2">
        {list.map((item) => (
          <TouchableOpacity
            key={item}
            onLayout={onTabLayout(item)}
            className={`p-4 rounded-full ${
              activeTab === item ? "bg-[#FEB4A9]" : "bg-[#261817]"
            }`}
            onPress={() => handlePress(item)}
          >
            <Text
              className={`text-lg font-semibold ${
                activeTab === item
                  ? "text-[#1B100E]"
                  : "text-white/50"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
