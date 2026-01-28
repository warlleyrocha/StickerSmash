import { AddAccountModal } from "@/components/Modals/AddAccountModal";
import { EditRepublicModal } from "@/components/Modals/EditRepublicModal";
import { MenuButton, SideMenu } from "@/components/SideMenu";
import { useSideMenu } from "@/components/SideMenu/useSideMenu";
import Tabs from "@/components/Tabs";
import { AccountsTab } from "@/components/Tabs/Accounts";
import { ResidentsTab } from "@/components/Tabs/Residents";
import { ResumeTab } from "@/components/Tabs/Resume";

import { useAuth } from "@/contexts";

import { useRepublic } from "@/hooks/useRepublic";
import { useResidents } from "@/hooks/useResidents";

import type { RepublicResponse } from "@/types/republic.types";
import type { TabKey } from "@/types/tabs";

import { showToast } from "@/utils/showToast";
import { toastErrors } from "@/utils/toastMessages";

import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const { residents, fetchResidents } = useResidents();

  const [tab, setTab] = useState<TabKey>("contas");
  const [republic, setRepublic] = useState<RepublicResponse | null>(null);
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
          setRepublic(republicData);
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

  useEffect(() => {
    if (republic?.id) {
      fetchResidents(republic.id);
    }
  }, [republic?.id, fetchResidents]);

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

  const { menuItems, footerItems } = useSideMenu(
    "home",
    handleSignOut,
    republic?.id
  );

  const handleSaveRepublica = async (nome: string, imagem?: string) => {
    if (!republic) return;

    const success = await updatedRepublic(republic.id, {
      nome,
      imagemRepublica: imagem,
    });

    // Atualizar estado local se sucesso
    if (success) {
      setRepublic((prev) =>
        prev ? { ...prev, nome, imagemRepublica: imagem } : null
      );
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

  const renderHeader = () => {
    if (!republic) return null;

    return (
      <View className="mt-[32px] flex-row gap-3 border-b border-b-black/10 bg-[#FAFAFA] px-[16px] py-4">
        <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-black">
          {republic.imagemRepublica ? (
            <Image
              source={{ uri: republic.imagemRepublica }}
              className="h-[50px] w-[50px] rounded-full"
            />
          ) : (
            <Feather name="image" size={48} color="#6b7280" />
          )}
        </View>

        <TouchableOpacity
          onPress={() => setShowEditModal(true)}
          className="flex-1 justify-center"
        >
          <Text className="text-base font-semibold">
            {republic.nome || "República"}
          </Text>
          <Text className="text-sm text-gray-500">0 Morador</Text>
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
  };

  const renderTabContent = () => {
    if (!republic) return null;

    switch (tab) {
      case "contas":
        return <AccountsTab />;
      case "moradores":
        return <ResidentsTab residents={residents} />;
      case "resumo":
        return <ResumeTab />;
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

  if (!republic) {
    return (
      <View className="flex-1 bg-[#FAFAFA] items-center justify-center">
        <MaterialCommunityIcons name="home-alert" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-gray-600">República não encontrada</Text>
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

      {/*
        <AddAccountModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      */}

      <EditRepublicModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        currentName={republic.nome}
        currentImage={republic.imagemRepublica}
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
