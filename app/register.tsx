import InputField from "@/components/ui/input-field";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const { width, height } = Dimensions.get("window");
  const router = useRouter();
  const [republicName, setRepublicName] = useState("");
  const [republicImage, setRepublicImage] = useState<string | undefined>(
    undefined
  );

  const selecionarImagemRepublica = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de permissão para acessar suas fotos!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setRepublicImage(result.assets[0].uri);
    }
  };

  const handlePress = async () => {
    if (!republicName.trim()) {
      Alert.alert("Erro", "Por favor, informe o nome da república");
      return;
    }

    try {
      await AsyncStorage.setItem("@republica_nome", republicName.trim());
      if (republicImage) {
        await AsyncStorage.setItem("@republica_imagem", republicImage);
      }
      router.push("/residents");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
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
          {/* Seleção de Imagem */}
          <View className="mb-6 items-center">
            <TouchableOpacity
              onPress={selecionarImagemRepublica}
              className="items-center"
            >
              <View className="h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                {republicImage ? (
                  <Image
                    source={{ uri: republicImage }}
                    className="h-32 w-32 rounded-full"
                  />
                ) : (
                  <Feather name="image" size={48} color="#6b7280" />
                )}
              </View>
              <Text className="mt-3 text-sm text-indigo-600">
                {republicImage
                  ? "Toque para alterar a imagem"
                  : "Adicionar imagem"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <InputField
              label="Nome da República"
              placeholder="Digite o nome da sua república"
              value={republicName}
              onChangeText={setRepublicName}
              animatedLabel
              labelProps={{
                className:
                  "mb-2 text-[16px] font-medium leading-[18px] text-gray-700 text-center",
              }}
              inputProps={{
                className:
                  "mb-2 rounded-lg border border-gray-300 items-center justify-center bg-white text-center px-4 py-3 text-lg text-gray-900",
              }}
            />
          </View>
        </ScrollView>

        <TouchableOpacity
          className="mb-4 w-full rounded-lg bg-blue-500 px-4 py-3"
          onPress={handlePress}
        >
          <Text className="text-center text-lg text-white">Registrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
