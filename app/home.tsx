import React, { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

import { AddAccountModal } from "@/components/Modals/AddAccountModal";
import { EditRepublicModal } from "@/components/Modals/EditRepublicModal";
import { MenuButton, SideMenu } from "@/components/SideMenu";
import Tabs from "@/components/Tabs";
import { AccountsTab } from "@/components/Tabs/Accounts";
import { ResidentsTab } from "@/components/Tabs/Residents";
import { ResumeTab } from "@/components/Tabs/Resume";

import { useAuth } from "@/contexts";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";

import { REPUBLIC_STORAGE_KEY } from "@/constants/storageKeys";
import type { Republica } from "@/types/resume";
import type { TabKey } from "@/types/tabs";
import { useRouter } from "expo-router";

const ImageHeader = require("@/assets/images/android/res/mipmap-xxxhdpi/ic_launcher.png");

const initialRepublica: Republica = {
  nome: "",
  moradores: [],
  contas: [],
};

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<TabKey>("resumo");

  // Usar AsyncStorage para persistir dados
  const { data: republica, setData: setRepublica } = useAsyncStorage<Republica>(
    REPUBLIC_STORAGE_KEY,
    initialRepublica
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const userMenu = {
    name: user?.user?.name ?? "Usuário",
    photo: user?.user?.photo,
    email: user?.user?.email,
  };

  const menuItems = [
    {
      id: "1",
      label: "Início",
      icon: "home-outline" as const,
      onPress: () => router.push("/home"),
    },
    {
      id: "2",
      label: "Meu Perfil",
      icon: "person-outline" as const,
      onPress: () => router.push("/(userProfile)/profile"),
    },
    {
      id: "3",
      label: "Convites",
      icon: "mail-outline" as const,
      onPress: () => router.push("/(userProfile)/invites"),
    },
  ];

  const footerItems = [
    {
      id: "1",
      label: "Sair",
      icon: "log-out-outline" as const,
      onPress: handleSignOut,
      danger: true,
    },
  ];

  // Função para salvar edições da república
  const handleSaveRepublica = (nome: string, imagem?: string) => {
    setRepublica({ ...republica, nome, imagemRepublica: imagem });
  };

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao fazer logout da conta:", error);
      Alert.alert(
        "Erro no Logout",
        "Não foi possível fazer logout da conta. Tente novamente."
      );
    }
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* HEADER */}
      <View className="mt-[32px] flex-row gap-3 border-b border-b-black/10 bg-[#FAFAFA] px-[16px] py-4">
        <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-black">
          {republica.imagemRepublica ? (
            <Image
              source={{ uri: republica.imagemRepublica }}
              style={{
                width: 50,
                height: 50,
                resizeMode: "cover",
                borderRadius: 25,
              }}
            />
          ) : (
            <Image
              source={ImageHeader}
              style={{ width: 50, height: 50, resizeMode: "contain" }}
            />
          )}
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
          onPress={() => setShowAddModal(true)}
          className="self-center rounded-md bg-indigo-600 px-4 py-2"
        >
          <Text className="text-white">+ Nova Conta</Text>
        </TouchableOpacity>

        <MenuButton onPress={() => setMenuVisible(true)} />
      </View>

      {/* CONTENT */}
      <View style={{ padding: 16, flex: 1 }}>
        <Tabs value={tab} onChange={setTab} />

        {/* cada tab controla seu próprio scroll internamente */}
        {tab === "resumo" && <ResumeTab republica={republica} />}

        {tab === "contas" && (
          <AccountsTab republica={republica} setRepublica={setRepublica} />
        )}

        {tab === "moradores" && (
          <ResidentsTab republica={republica} setRepublica={setRepublica} />
        )}
      </View>

      {/* Modais */}
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
      {/* MENU LATERAL */}
      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        user={userMenu}
        menuItems={menuItems}
        footerItems={footerItems}
      />
    </View>
  );
}
