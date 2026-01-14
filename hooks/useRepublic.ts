import { useAuth } from "@/contexts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

type UseRepublicState = {
    republicName: string;
    republicImage?: string;
    residentName: string;
    residentPhoto?: string;
    pixKey: string;
    phone: string;
};

type UseRepublicActions = {
    setRepublicName: (name: string) => void;
    setRepublicImage: (uri?: string) => void;
    handleSelectImageRepublic: () => Promise<void>;
    setResidentName: (name: string) => void;
    setResidentPhoto: (uri?: string) => void;
    setPixKey: (key: string) => void;
    setPhone: (phone: string) => void;
    handlePress: () => Promise<void>;
};

type UseRepublicReturn = UseRepublicState & UseRepublicActions;

export function useRepublic(): UseRepublicReturn {
    const { user } = useAuth();
    const router = useRouter();

    const [republicName, setRepublicName] = useState("");
    const [republicImage, setRepublicImage] = useState<string | undefined>(
        undefined
    );
    // Inicializa os campos com os dados do usuário logado
    const [residentName, setResidentName] = useState(user?.nome ?? "");
    const [pixKey, setPixKey] = useState(user?.email ?? "");
    const [phone, setPhone] = useState(user?.telefone ?? "");
    const [residentPhoto, setResidentPhoto] = useState<string | undefined>(
        user?.fotoPerfil ?? undefined
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
            // Cria IDs únicos para república
            const republicId = String(uuid.v4());

            const newRepublic = {
                id: republicId,
                nome: republicName,
                imagemRepublica: republicImage,
                moradores: [
                    {
                        id: user?.id ?? "",
                        nome: residentName,
                        fotoPerfil: residentPhoto,
                        telefone: phone,
                        chavePix: pixKey,
                    },
                ],
                contas: [],
            };

            // Recupera array existente ou inicializa
            const existing = await AsyncStorage.getItem("republic-data");
            let republicArray: any[] = [];
            if (existing) {
                try {
                    republicArray = JSON.parse(existing);
                    if (!Array.isArray(republicArray)) republicArray = [];
                } catch {
                    republicArray = [];
                }
            }

            republicArray.push(newRepublic);
            await AsyncStorage.setItem(
                "republic-data",
                JSON.stringify(republicArray)
            );

            console.log("República cadastrada com sucesso", newRepublic);

            // Navega para a página da república criada
            router.push(`/(userProfile)/(republics)/${republicId}`);
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
        residentName,
        residentPhoto,
        pixKey,
        phone,
        // Funções para atualizar os estados
        setRepublicName,
        setRepublicImage: setRepublicImageWrapper,
        handleSelectImageRepublic,
        setResidentName,
        setResidentPhoto,
        setPixKey,
        setPhone,
        // Funções de ação
        handlePress,
    };
}
