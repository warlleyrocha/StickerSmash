import Header from "@/components/Header";
import { EditRepublicModal } from "@/components/Modals/EditRepublicModal";
import { InviteModal } from "@/components/Modals/InviteModal";
import LoadingScreen from "@/components/ui/loading-screen";

import { useAuth } from "@/contexts/AuthContext";

import { useInvites } from "@/hooks/useInvite";
import { useRepublic } from "@/hooks/useRepublic";
import { useRepublicResidents } from "@/hooks/useRepublicResidents";

import type { RepublicResponse } from "@/types/republic.types";

import { showToast } from "@/utils/showToast";

import { Feather } from "@expo/vector-icons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ControlPanel = () => {
  const { user, loading } = useAuth();

  const {
    republics,
    fetchRepublics,
    deleteRepublic,
    updatedRepublic,
    showEditModal,
    setShowEditModal,
  } = useRepublic();

  const { getResidentsCount } = useRepublicResidents(republics);

  const [inviteRepublicId, setInviteRepublicId] = useState<string | undefined>(
    undefined
  );

  const { sendInvite, loading: inviteLoading, error } = useInvites();

  const [modalOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRepublic, setSelectedRepublic] =
    useState<RepublicResponse | null>(null);

  useEffect(() => {
    fetchRepublics();
  }, [fetchRepublics]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRepublics();
    setRefreshing(false);
  };

  const handleDeleteRepublic = async (republicId: string) => {
    if (!deleteRepublic) {
      showToast.error("Função de exclusão não disponível");
      return;
    }
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta república?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const success = await deleteRepublic(republicId);
            return success;
          },
        },
      ]
    );
  };

  const handleEditRepublic = (republic: RepublicResponse) => {
    setSelectedRepublic(republic);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedRepublic(null);
  };

  const handleSaveEdit = async (name: string, image?: string) => {
    if (!selectedRepublic) return;

    const success = await updatedRepublic(selectedRepublic.id, {
      nome: name,
      imagemRepublica: image,
    });

    if (success) {
      handleCloseModal();
    }
  };

  if (loading)
    return <LoadingScreen message="Carregando painel de controle..." />;

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <MaterialCommunityIcons
          name="account-alert"
          size={64}
          color="#9CA3AF"
        />
        <Text className="mt-4 text-lg font-medium text-gray-600">
          Usuário não encontrado
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Header title="Painel de Controle" />

      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {republics.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialCommunityIcons
              name="home-search"
              size={64}
              color="#D1D5DB"
            />
            <Text className="mt-4 text-base text-gray-500">
              Nenhuma república cadastrada
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {republics.map((republic) => (
              <View
                key={republic.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <View className="flex-row items-center">
                  {/* Imagem da República */}
                  <Image
                    className="h-[70px] w-[70px] rounded-lg bg-gray-100"
                    source={{ uri: republic.imagemRepublica }}
                    resizeMode="cover"
                  />

                  {/* Informações */}
                  <View className="flex-1 ml-3">
                    <Text className="text-lg font-semibold text-gray-900">
                      {republic.nome}
                    </Text>

                    <View className="mt-1 flex-row items-center">
                      <MaterialCommunityIcons
                        name="account-group"
                        size={14}
                        color="#6B7280"
                      />
                      <Text className="ml-1 text-sm text-gray-500">
                        {getResidentsCount(republic.id)}{" "}
                        {getResidentsCount(republic.id) === 1
                          ? "morador"
                          : "moradores"}
                      </Text>
                    </View>
                  </View>

                  {/* Ações */}
                  <View className="flex-row items-center gap-2 pr-4">
                    <TouchableOpacity
                      onPress={() => {
                        setInviteRepublicId(republic.id);
                        setModalOpen(true);
                      }}
                    >
                      <Feather name="user-plus" size={20} color="#6B7280" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleEditRepublic(republic)}
                      className="h-10 w-10 items-center justify-center rounded-lg bg-blue-50"
                    >
                      <MaterialCommunityIcons
                        name="pencil"
                        size={20}
                        color="#3B82F6"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDeleteRepublic(republic.id)}
                      className="h-10 w-10 items-center justify-center rounded-lg bg-red-50"
                    >
                      <MaterialCommunityIcons
                        name="delete-outline"
                        size={20}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg"
        onPress={() => console.log("Adicionar nova república")}
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>

      <EditRepublicModal
        visible={showEditModal}
        onClose={handleCloseModal}
        currentName={selectedRepublic?.nome || ""}
        currentImage={selectedRepublic?.imagemRepublica}
        onSave={handleSaveEdit}
      />

      <InviteModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setInviteRepublicId(undefined);
        }}
        republicaId={inviteRepublicId!}
        sendInvite={sendInvite}
        loading={inviteLoading}
        error={error}
      />
    </View>
  );
};

export default ControlPanel;
