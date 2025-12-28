import { Text, View, Image,TouchableOpacity } from "react-native";

export default function SongCard({ title, image, artist, isRounded }: { title?: string; image?: any; artist?: string; isRounded?: boolean }) {
  return (
    <TouchableOpacity className={`bg-[#281D1B] py-2 px-1 flex-row items-center ${isRounded ? 'rounded-xl' : ''}`}>
      <Image
      className="w-[60px] h-[60px] mr-4 rounded-lg"
       source={require("@/assets/images/ivoxygen.png")}/>
       <View>
        {/*max lenght is 22char */}
        <Text className="text-white text-lg font-medium">{title ? title : 'unknown'}</Text>
        <Text className="text-gray-400 text-md">{artist ? artist : 'unknown'}</Text>
       </View>
    </TouchableOpacity>     
  );
}
