import type { Morador, Republica } from "@/types/resume";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ResidentsTabProps {
  republica: Republica;
  setRepublica: (rep: Republica) => void;
}

export const ResidentsTab: React.FC<ResidentsTabProps> = ({
  republica,
  setRepublica,
}) => {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [moradorParaEditar, setMoradorParaEditar] = useState<Morador | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{
    nome: string;
    chavePix: string;
    fotoPerfil?: string;
  }>({
    nome: "",
    chavePix: "",
    fotoPerfil: undefined,
  });

  const abrirNovoMorador = () => {
    setMoradorParaEditar(null);
    setEditForm({ nome: "", chavePix: "", fotoPerfil: undefined });
    setShowEditModal(true);
  };

  const copiarChavePix = async (morador: Morador) => {
    if (!morador.chavePix) {
      Alert.alert("Erro", "Morador não possui chave PIX cadastrada.");
      return;
    }

    await Clipboard.setStringAsync(morador.chavePix);
    setCopiadoId(morador.id);
    Alert.alert("Copiado", "Chave PIX copiada para a área de transferência.");
    setTimeout(() => setCopiadoId(null), 1500);
  };

  const calcularDividaPorMorador = (moradorId: string) => {
    return republica.contas
      .filter((conta) => !conta.pago)
      .reduce((total, conta) => {
        const resp = conta.responsaveis.find((r) => r.moradorId === moradorId);
        return total + (resp?.valor || 0);
      }, 0);
  };

  const quantidadeContasPendentes = (moradorId: string) => {
    return republica.contas.filter(
      (conta) =>
        !conta.pago && conta.responsaveis.some((r) => r.moradorId === moradorId)
    ).length;
  };

  const abrirEdicaoMorador = (morador: Morador) => {
    setMoradorParaEditar(morador);
    setEditForm({
      nome: morador.nome,
      chavePix: morador.chavePix || "",
      fotoPerfil: morador.fotoPerfil,
    });
    setShowEditModal(true);
  };

  const salvarEdicaoMorador = () => {
    if (!editForm.nome.trim()) {
      Alert.alert("Erro", "Informe o nome do morador.");
      return;
    }

    if (moradorParaEditar) {
      // Editar morador existente
      setRepublica({
        ...republica,
        moradores: republica.moradores.map((m) =>
          m.id === moradorParaEditar.id
            ? {
                ...m,
                nome: editForm.nome.trim(),
                chavePix: editForm.chavePix?.trim() || undefined,
                fotoPerfil: editForm.fotoPerfil,
              }
            : m
        ),
      });
      Alert.alert("Sucesso", "Morador atualizado com sucesso!");
    } else {
      // Adicionar novo morador
      const novo: Morador = {
        id: Date.now().toString(),
        nome: editForm.nome.trim(),
        chavePix: editForm.chavePix?.trim() || undefined,
        fotoPerfil: editForm.fotoPerfil,
      };
      setRepublica({
        ...republica,
        moradores: [...republica.moradores, novo],
      });
      Alert.alert("Sucesso", "Morador adicionado com sucesso!");
    }

    setShowEditModal(false);
    setMoradorParaEditar(null);
    setEditForm({ nome: "", chavePix: "", fotoPerfil: undefined });
  };

  const fecharEdicaoMorador = () => {
    setShowEditModal(false);
    setMoradorParaEditar(null);
    setEditForm({ nome: "", chavePix: "", fotoPerfil: undefined });
  };

  const selecionarImagem = async () => {
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
      setEditForm((s) => ({ ...s, fotoPerfil: result.assets[0].uri }));
    }
  };

  const renderMorador = ({ item: morador }: { item: Morador }) => {
    const divida = calcularDividaPorMorador(morador.id);
    const qtd = quantidadeContasPendentes(morador.id);
    const isPendente = divida > 0;

    return (
      <TouchableOpacity
        onPress={() => abrirEdicaoMorador(morador)}
        activeOpacity={0.7}
      >
        <View className="rounded-lg bg-white p-4 shadow-sm">
          {/* header */}
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                {morador.fotoPerfil ? (
                  <Image
                    source={{ uri: morador.fotoPerfil }}
                    className="h-12 w-12 rounded-full"
                  />
                ) : (
                  <Feather name="user" size={20} color="#4f46e5" />
                )}
              </View>

              <View>
                <Text className="text-lg font-semibold">{morador.nome}</Text>
                <Text className="text-sm text-gray-500">
                  {qtd} {qtd === 1 ? "conta pendente" : "contas pendentes"}
                </Text>
              </View>
            </View>

            <View>
              <View
                className={`rounded-md border px-3 py-1 ${
                  isPendente ? "border-orange-600" : "border-green-600"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isPendente ? "text-orange-600" : "text-green-600"
                  }`}
                >
                  {isPendente ? "Pendente" : "Em dia"}
                </Text>
              </View>
            </View>
          </View>

          {/* conteúdo */}
          <View className="mt-3 space-y-3">
            <View className="mt-2 flex-row justify-between rounded-lg bg-gray-50 p-3">
              <Text className="mb-1 text-sm text-gray-600">Valor Pendente</Text>
              <Text
                className={
                  isPendente
                    ? "font-semibold text-orange-600"
                    : "font-semibold text-green-600"
                }
              >
                R$ {divida.toFixed(2)}
              </Text>
            </View>

            {morador.chavePix ? (
              <View className="mt-4">
                <Text className="mb-2 text-sm text-gray-600">Chave PIX</Text>

                <View className="flex-row items-center gap-2">
                  <View className="flex-1 rounded bg-gray-50 p-2">
                    <Text className="text-sm">{morador.chavePix}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      copiarChavePix(morador);
                    }}
                    className="rounded-md border border-indigo-600 px-3 py-2"
                  >
                    {copiadoId === morador.id ? (
                      <Ionicons name="checkmark" size={18} color="#16a34a" />
                    ) : (
                      <Feather name="copy" size={18} color="#374151" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderItemSeparator = () => <View className="h-4" />;

  return (
    <View className="space-y-4">
      {/* botão adicionar */}
      <TouchableOpacity
        onPress={abrirNovoMorador}
        className="mb-5 mt-2 items-center rounded-md bg-indigo-600 py-3"
      >
        <View className="flex-row items-center">
          <Feather name="plus" size={16} color="#fff" />
          <Text className="ml-2 font-medium text-white">Adicionar Morador</Text>
        </View>
      </TouchableOpacity>

      {/* lista de moradores */}
      <FlatList
        data={republica.moradores}
        keyExtractor={(m) => m.id}
        renderItem={renderMorador}
        ItemSeparatorComponent={renderItemSeparator}
        contentContainerStyle={{ paddingBottom: 130 }}
      />

      {/* Modal de Edição de Morador */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={fecharEdicaoMorador}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="rounded-t-2xl bg-white px-6 py-6">
              {/* Header */}
              <View className="mb-6 flex-row items-center justify-between">
                <Text className="text-xl font-semibold">
                  {moradorParaEditar ? "Editar Morador" : "Novo Morador"}
                </Text>
                <TouchableOpacity onPress={fecharEdicaoMorador}>
                  <Feather name="x" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              {/* Foto de Perfil */}
              <TouchableOpacity
                onPress={selecionarImagem}
                className="mb-6 items-center"
              >
                <View className="h-28 w-28 items-center justify-center rounded-full bg-indigo-100">
                  {editForm.fotoPerfil ? (
                    <Image
                      source={{ uri: editForm.fotoPerfil }}
                      className="h-28 w-28 rounded-full"
                    />
                  ) : (
                    <Feather name="user" size={56} color="#4f46e5" />
                  )}
                </View>
                <Text className="mt-2 text-sm text-indigo-600">
                  Toque para alterar a foto
                </Text>
              </TouchableOpacity>

              {/* Nome */}
              <View className="mb-4">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Nome
                </Text>
                <TextInput
                  value={editForm.nome}
                  onChangeText={(t) => setEditForm((s) => ({ ...s, nome: t }))}
                  placeholder="Nome do morador"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                />
              </View>

              {/* Chave PIX */}
              <View className="mb-6">
                <Text className="mb-2 text-sm font-semibold text-gray-700">
                  Chave PIX (opcional)
                </Text>
                <TextInput
                  value={editForm.chavePix}
                  onChangeText={(t) =>
                    setEditForm((s) => ({ ...s, chavePix: t }))
                  }
                  placeholder="Email, CPF ou telefone"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-3"
                />
              </View>

              {/* Botões */}
              <View className="flex-row gap-3 pb-6">
                <TouchableOpacity
                  onPress={salvarEdicaoMorador}
                  className="flex-1 items-center rounded-lg bg-indigo-600 py-3"
                >
                  <Text className="font-semibold text-white">Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={fecharEdicaoMorador}
                  className="flex-1 items-center rounded-lg border border-gray-300 bg-white py-3"
                >
                  <Text className="font-semibold text-gray-700">Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default ResidentsTab;
