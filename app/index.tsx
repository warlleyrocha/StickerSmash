import { useRouter } from "expo-router";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import "../global.css";

const { height } = Dimensions.get("window");

export default function App() {
  const router = useRouter();

  const handlePress = () => {
    router.push("/register");
  };

  return (
    <View className="flex-1 items-center bg-white">
      <Image
        source={require("../assets/images/pexels-olia-danilevich-8093032.jpg")}
        style={{
          width: "100%",
          height: height * 0.5,
          resizeMode: "cover",
        }}
      />

      <View
        className="mt-8 w-full  items-center justify-between overflow-hidden rounded-3xl rounded-t-[24px] bg-white px-6 py-8 shadow-lg"
        style={{
          marginTop: -25, // Sobreposição sobre o background
          paddingTop: 40, // Espaço para compensar a sobreposição
          minHeight: height * 0.5, // Mínimo 50% da altura
        }}
      >
        <View className="gap-6">
          <Text className="text-center text-4xl font-bold">Rep Finance</Text>
          <Text className="text-center">
            Faça login para começar o controle de suas finanças em republica
          </Text>
        </View>

        <TouchableOpacity
          className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2"
          onPress={handlePress}
        >
          <Text className="text-center text-lg text-white">Get Started</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
