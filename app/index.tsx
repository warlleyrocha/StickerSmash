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
          <Text className="font-inter-bold text-center text-4xl">Kontas</Text>
          <Text className="font-mulish-medium px-2 text-center leading-[22px]">
            Gerencie com facilidade as contas da sua república. Cadastre
            moradores, acompanhe pagamentos, defina responsáveis e organize
            todas as despesas em um só lugar.
          </Text>
        </View>

        <TouchableOpacity
          className="mt-6 w-full rounded-lg bg-blue-500 px-4 py-2"
          onPress={handlePress}
        >
          <Text className="font-inter-medium text-center text-lg text-white">
            Entrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
