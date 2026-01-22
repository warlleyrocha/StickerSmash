import AddAccountModal from "@/components/Modals/AddAccountModal";
import { EditRepublicModal } from "@/components/Modals/EditRepublicModal";
import { MenuButton, SideMenu } from "@/components/SideMenu";
import { useSideMenu } from "@/components/SideMenu/useSideMenu";
import Tabs from "@/components/Tabs";
import { AccountsTab } from "@/components/Tabs/Accounts";
import { ResidentsTab } from "@/components/Tabs/Residents";
import { ResumeTab } from "@/components/Tabs/Resume";
import { useAuth } from "@/contexts";
import { useRepublic } from "@/hooks/useRepublic";
import type { Republica } from "@/types/resume";
import type { TabKey } from "@/types/tabs";
import { showToast } from "@/utils/showToast";
import { toastErrors } from "@/utils/toastMessages";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ImageHeader = require("@/assets/images/app-icon/1024.png");

const initialRepublica: Republica = {
  id: "",
  nome: "",
  moradores: [],
  contas: [],
};

interface RepublicImageProps {
  readonly imageUri?: string;
  readonly size?: number;
}

function RepublicImage({ imageUri, size = 50 }: RepublicImageProps) {
  const imageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={{ ...imageStyle, resizeMode: "cover" }}
      />
    );
  }

  return (
    <Image
      source={ImageHeader}
      style={{ ...imageStyle, resizeMode: "cover" }}
    />
  );
}

export default function Home() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { id: idParam } = useLocalSearchParams<{ id?: string }>();
  const {
    fetchRepublicById,
    updatedRepublic,
    showEditModal,
    setShowEditModal,
  } = useRepublic();

  const [tab, setTab] = useState<TabKey>("contas");

  const [republica, setRepublica] = useState<Republica>(initialRepublica);

  const [showAddModal, setShowAddModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRepublic() {
      if (!idParam) {
        showToast.error("ID da república não encontrado");
        router.back();
        return;
      }

      setIsLoading(true);
      try {
        const republicData = await fetchRepublicById(idParam);

        if (republicData) {
          // Mapear RepublicResponse para Republica (se necessário)
          setRepublica({
            id: republicData.id,
            nome: republicData.nome,
            imagemRepublica: republicData.imagemRepublica,
            moradores: [],
            contas: [],
          });
          console.log("República carregada:", republicData);
        } else {
          showToast.error("República não encontrada");
          router.back();
        }
      } catch (err) {
        console.error("Erro ao carregar república:", err);
        showToast.error("Erro ao carregar república");
        router.back();
      } finally {
        setIsLoading(false);
      }
    }

    loadRepublic();
  }, [idParam, fetchRepublicById, router]);

  const toggleFavorite = useCallback(() => {
    setIsFavorited((prev) => {
      const next = !prev;
      showToast.success(
        next
          ? "República adicionada aos favoritos"
          : "República removida dos favoritos"
      );
      return next;
    });
  }, []);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao fazer logout da conta:", error);
      toastErrors.logoutFailed();
    }
  }, [logout, router]);
  const { menuItems, footerItems } = useSideMenu("home", handleSignOut);

  const handleSaveRepublica = async (nome: string, imagem?: string) => {
    const success = await updatedRepublic(republica.id, {
      nome,
      imagemRepublica: imagem,
    });

    // Atualizar estado local apenas se a API teve sucesso
    if (success) {
      setRepublica((prev) => ({ ...prev, nome, imagemRepublica: imagem }));
    }
  };

  const userMenu = useMemo(
    () => ({
      name: user?.nome ?? "Usuário",
      photo: user?.fotoPerfil,
      email: user?.email,
    }),
    [user?.nome, user?.fotoPerfil, user?.email]
  );

  const renderHeader = () => (
    <View className="mt-[32px] flex-row gap-3 border-b border-b-black/10 bg-[#FAFAFA] px-[16px] py-4">
      <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-black">
        <RepublicImage imageUri={republica.imagemRepublica} />
      </View>

      <TouchableOpacity
        onPress={() => setShowEditModal(true)}
        className="flex-1 justify-center"
      >
        <Text className="text-base font-semibold">
          {republica.nome || "República"}
        </Text>
        <Text className="text-sm text-gray-500">
          {republica.moradores?.length || 0} moradores
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={toggleFavorite}
        className="items-center justify-center rounded-full p-2 mb-2"
        accessibilityRole="button"
        accessibilityLabel={
          isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"
        }
      >
        <MaterialCommunityIcons
          name={isFavorited ? "star" : "star-outline"}
          size={22}
          color={isFavorited ? "#f59e0b" : "#6b7280"}
        />
      </TouchableOpacity>

      <MenuButton onPress={() => setIsMenuOpen(true)} />
    </View>
  );

  const renderTabContent = () => {
    switch (tab) {
      case "contas":
        return (
          <AccountsTab
            republica={republica}
            setRepublica={setRepublica}
            onOpenAdd={() => setShowAddModal(true)}
          />
        );
      case "moradores":
        return (
          <ResidentsTab republica={republica} setRepublica={setRepublica} />
        );
      case "resumo":
        return <ResumeTab republica={republica} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-[#FAFAFA] items-center justify-center">
        <ActivityIndicator size="large" color="#000" />
        <Text className="mt-4 text-gray-600">Carregando república...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {renderHeader()}

      <View style={{ padding: 16, flex: 1 }}>
        <Tabs value={tab} onChange={setTab} />
        {renderTabContent()}
      </View>

      <AddAccountModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        republica={republica}
        setRepublica={setRepublica}
      />

      <EditRepublicModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentName={republica.nome}
        currentImage={republica.imagemRepublica}
        onSave={handleSaveRepublica}
      />

      {isMenuOpen && (
        <SideMenu
          onRequestClose={() => setIsMenuOpen(false)}
          user={userMenu}
          menuItems={menuItems}
          footerItems={footerItems}
        />
      )}
    </View>
  );
}
