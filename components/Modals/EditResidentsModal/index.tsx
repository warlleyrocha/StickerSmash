import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditFormData {
  nome: string;
  chavePix: string;
  fotoPerfil?: string;
}

interface EditResidentsModalProps {
  visible: boolean;
  isEditMode: boolean;
  editForm: EditFormData;
  onClose: () => void;
  onSave: () => void;
  onSelectImage: () => void;
  onUpdateField: (field: keyof EditFormData, value: string) => void;
}

/**
 * Modal para adicionar ou editar um morador
 * @param visible - Controla a visibilidade do modal
 * @param isEditMode - Define se está em modo edição (true) ou criação (false)
 * @param editForm - Dados do formulário (nome, chavePix, fotoPerfil)
 * @param onClose - Callback para fechar o modal
 * @param onSave - Callback para salvar as alterações
 * @param onSelectImage - Callback para selecionar imagem de perfil
 * @param onUpdateField - Callback para atualizar campos do formulário
 */
export const EditResidentsModal: React.FC<EditResidentsModalProps> = ({
  visible,
  isEditMode,
  editForm,
  onClose,
  onSave,
  onSelectImage,
  onUpdateField,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
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
                {isEditMode ? "Editar Morador" : "Novo Morador"}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Feather name="x" size={24} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Foto de Perfil */}
            <TouchableOpacity
              onPress={onSelectImage}
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
                onChangeText={(t) => onUpdateField("nome", t)}
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
                onChangeText={(t) => onUpdateField("chavePix", t)}
                placeholder="Email, CPF ou telefone"
                className="rounded-lg border border-gray-300 bg-white px-4 py-3"
              />
            </View>

            {/* Botões */}
            <View className="flex-row gap-3 pb-6">
              <TouchableOpacity
                onPress={onSave}
                className="flex-1 items-center rounded-lg bg-indigo-600 py-3"
              >
                <Text className="font-semibold text-white">Salvar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onClose}
                className="flex-1 items-center rounded-lg border border-gray-300 bg-white py-3"
              >
                <Text className="font-semibold text-gray-700">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
