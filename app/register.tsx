import InputField from "@/components/ui/input-field";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();
  const [republicName, setRepublicName] = useState("");

  const handlePress = () => {
    router.push("/residents");
  };

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("@/assets/images/image-register.jpg")}
        style={{
          height: height * 0.5,
          width: "100%",
        }}
        className="items-center justify-center"
        resizeMode="cover"
      >
        <View className="flex-1 items-center justify-center gap-[24px]">
          <View className="h-[81px] w-[81px] items-center justify-center rounded-full bg-[#111928]">
            <Text className="font-inter-bold text-[36px] text-white">iF</Text>
          </View>

          <Text
            className="font-inter-bold text-center text-white"
            style={{
              fontSize: width > 400 ? 25 : 24,
              lineHeight: width > 400 ? 28 : 24,
              paddingHorizontal: width * 0.1,
            }}
          >
            Cadastre sua {"\n"} República
          </Text>
        </View>
      </ImageBackground>

      <View
        className="flex-1 items-center justify-between rounded-t-[24px] bg-[#FAFAFA] px-4 pb-4"
        style={{
          width: width,
          marginTop: -25,
          paddingTop: 48,
          minHeight: height * 0.5,
        }}
      >
        <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
          <InputField
            label="Nome da República"
            placeholder="Digite o nome da sua república"
            value={republicName}
            onChangeText={setRepublicName}
          />
        </ScrollView>

        <TouchableOpacity
          className="mb-4 w-full rounded-lg bg-blue-500 px-4 py-3"
          onPress={handlePress}
        >
          <Text className="text-center text-lg text-white">Registrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
