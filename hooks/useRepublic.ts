import { republicService } from "@/services/republic.service";
import type { RepublicPost } from "@/types/republic.types";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

type UseRepublicState = {
  republicName: string;
  republicImage?: string;
};

type UseRepublicActions = {
  setRepublicName: (name: string) => void;
  setRepublicImage: (uri?: string) => void;
  handleSelectImageRepublic: () => Promise<void>;
  handlePress: () => Promise<void>;
};

type UseRepublicReturn = UseRepublicState & UseRepublicActions;

export function useRepublic(): UseRepublicReturn {
  const router = useRouter();

  const [republicName, setRepublicName] = useState("");
  const [republicImage, setRepublicImage] = useState<string | undefined>(
    undefined
  );

  const handleSelectImageRepublic = async () => {
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
    try {
      console.log("Salvando republica...");

      const newRepublic: RepublicPost = {
        nome: republicName,
        imagemRepublica: republicImage,
      };

      const republicCreated = await republicService.createRepublic(newRepublic);

      console.log("República cadastrada com sucesso", republicCreated.nome);

      // Navega para a página da república criada
      router.push(`/(userProfile)/(republics)/${republicCreated.id}`);
    } catch (error) {
      console.error("Erro ao salvar republica:", error);
      Alert.alert(
        "Erro",
        "Não foi possível salvar a república. Tente novamente."
      );
    }
  };

  // Wrapper para setRepublicImage
  const setRepublicImageWrapper = (uri?: string) => {
    setRepublicImage(uri ?? "");
  };

  return {
    // Estados dos dados da república
    republicName,
    republicImage,

    // Funções para atualizar os estados
    setRepublicName,
    setRepublicImage: setRepublicImageWrapper,
    handleSelectImageRepublic,

    // Funções de ação
    handlePress,
  };
}
