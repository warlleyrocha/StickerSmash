import EmptyRepublic from "@/components/CardsProfile/EmptyRepublic";
import IncompleteProfile from "@/components/CardsProfile/IncompleteProfile";
import RepublicList from "@/components/CardsProfile/RepublicList";
import { EditProfileModal } from "@/components/Modals/EditProfileModal";
import RepublicCard from "@/components/RepublicCard";
import { MenuButton, SideMenu } from "@/components/SideMenu";
import { useSideMenu } from "@/components/SideMenu/useSideMenu";
import { useAuth } from "@/contexts";
import { useRepublic } from "@/hooks/useRepublic";
import { maskPhone } from "@/utils/inputMasks";
import { showToast } from "@/utils/showToast";
import { toastErrors } from "@/utils/toastMessages";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";

export default function SetupProfile() {
  const router = useRouter();
  const { user, logout, completeProfile, updateUser } = useAuth();
  const { republics, fetchRepublics } = useRepublic();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleSignOut = useCallback(async () => {
    try {
      await logout();
      router.replace("/");
    } catch (error) {
      console.error("❌ Erro ao fazer logout:", error);
      toastErrors.logoutFailed();
    }
  }, [logout, router]);

  const handleSaveProfile = async (
    name: string,
    pixKey?: string,
    photo?: string,
    phone?: string
  ) => {
    const isCompletingProfile = !user?.perfilCompleto;

    // Validações obrigatórias APENAS ao completar perfil pela primeira vez
    if (isCompletingProfile && (!phone || !pixKey)) {
      Alert.alert(
        "Campos Obrigatórios",
        "Por favor, preencha o telefone e a chave Pix."
      );
      return;
    }

    try {
      console.log(
        isCompletingProfile
          ? "💾 Completando perfil..."
          : "💾 Atualizando perfil..."
      );

      if (isCompletingProfile) {
        await completeProfile({
          nome: name,
          telefone: phone!,
          chavePix: pixKey!,
          fotoPerfil: photo,
        });
      } else {
        await updateUser({
          nome: name,
          telefone: phone,
          chavePix: pixKey,
          fotoPerfil: photo,
        });
      }

      setShowEditProfileModal(false);
      showToast.success(
        isCompletingProfile
          ? "Perfil salvo com sucesso!"
          : "Perfil atualizado com sucesso!"
      );
    } catch (error) {
      console.log("Erro ao salvar o perfil:", error);
      toastErrors.profileUpdateFailed();
    }
  };

  const handleCreateRepublic = () => {
    router.push("/register/republic");
  };

  const { menuItems, footerItems } = useSideMenu("profile", handleSignOut);

  useEffect(() => {
    fetchRepublics();
  }, [fetchRepublics]);

  console.log("📝 Dados da república do DB:", republics);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRepublics();
    setRefreshing(false);
  }, [fetchRepublics]);

  // Funções de callback para RepublicList
  const handleEditRepublic = (id: string) => {
    // lógica para editar república
    // Exemplo: navegar para tela de edição
    router.push("/");
  };
  const handleSelectRepublic = (id: string) => {
    // lógica para selecionar república
    // Exemplo: navegar para detalhes
    console.log("República selecionada:", id);
    router.push(`/(userProfile)/(republics)/${id}`);
  };

  // Mapeia os dados do AsyncStorage (novo formato) para o formato esperado pelo RepublicList
  const republicasFormatadas = republics
    .filter((rep: any) => rep?.id && rep?.nome)
    .map((rep: any, idx: number) => ({
      id: rep.id ?? String(idx),
      nome: rep.nome ?? "Sem nome",
      imagem: rep.imagemRepublica ?? null,
      moradores: Array.isArray(rep.moradores) ? rep.moradores.length : 1,
    }));

  const renderContent = () => {
    if (!user?.perfilCompleto) {
      return (
        <IncompleteProfile onContinue={() => setShowEditProfileModal(true)} />
      );
    }
    if (user.perfilCompleto && republicasFormatadas.length === 0) {
      return (
        <EmptyRepublic
          onCreateRepublic={handleCreateRepublic}
          onViewInvites={() => router.push("/(userProfile)/invites")}
        />
      );
    }
    // Exibe lista de repúblicas
    return (
      <RepublicList
        republicas={republicasFormatadas}
        onEditRepublic={handleEditRepublic}
        onSelectRepublic={handleSelectRepublic}
        onCreateRepublic={handleCreateRepublic}
        RepublicCard={RepublicCard}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    );
  };

  // Se não tem usuário, não renderiza nada (loading do Context)
  if (!user) {
    return null;
  }

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* HEADER */}
      <View className="mt-[24px] flex-row items-center gap-3 border-b border-b-black/10 bg-[#FAFAFA] px-[16px] py-4">
        <View className="h-[50px] w-[50px] items-center justify-center overflow-hidden rounded-full bg-gray-200">
          {user.fotoPerfil ? (
            <Image
              source={{ uri: user.fotoPerfil }}
              style={{ width: 50, height: 50, borderRadius: 25 }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-xl font-bold text-gray-500">
              {user.nome.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        <TouchableOpacity
          className="flex-1"
          onPress={() => setShowEditProfileModal(true)}
        >
          <Text className="text-base font-semibold">{user.nome}</Text>
          <Text className="text-sm text-gray-500">Configurar perfil</Text>
        </TouchableOpacity>

        <MenuButton onPress={() => setIsMenuOpen(true)} />
      </View>

      {/* CONTENT */}
      {renderContent()}

      {/* MENU LATERAL */}
      {isMenuOpen && (
        <SideMenu
          key={`sidemenu-${user.chavePix}-${user.telefone}`}
          onRequestClose={() => setIsMenuOpen(false)}
          user={{
            name: user.nome,
            photo: user.fotoPerfil,
            email: user.email,
            pixKey: user.chavePix,
            phone: maskPhone(user.telefone ?? ""),
          }}
          menuItems={menuItems}
          footerItems={footerItems}
        />
      )}

      {/* MODAL CONFIGURAR PERFIL */}
      <EditProfileModal
        key={`editmodal-${user.chavePix}-${user.telefone}`}
        visible={showEditProfileModal}
        onClose={() => setShowEditProfileModal(false)}
        currentName={user.nome}
        currentPixKey={user.chavePix}
        currentPhoto={user.fotoPerfil}
        currentPhone={maskPhone(user.telefone ?? "")}
        onSave={handleSaveProfile}
      />
    </View>
  );
}
