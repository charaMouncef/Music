import { Text, View, Image,TouchableOpacity } from "react-native";

export default function SongCard({ title, image, artist, isRounded }: { title?: string; image?: any; artist?: string; isRounded?: boolean }) {
  const truncate = (text:string, maxLength = 30) => {
  if (!text) return "";
  return text.length > maxLength
    ? text.slice(0, maxLength) + "…"
    : text;
};

  return (
    <TouchableOpacity className={`bg-[#281D1B] py-2 px-1 flex-row items-center ${isRounded ? 'rounded-xl' : ''}`}>
      <Image
      className="w-[60px] h-[60px] mr-4 rounded-lg"
       source={image ? { uri: image } : require("@/assets/images/ivoxygen.png")}/>
       <View>
        <Text className="text-white text-lg font-medium">{title ? truncate(title) : 'unknown'}</Text>
        <Text className="text-gray-400 text-md">{artist ? artist : 'unknown'}</Text>
       </View>
    </TouchableOpacity>     
  );
}
