import type { Morador, Republica } from "@/types/resume";
import { showToast } from "@/utils/showToast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from "expo-clipboard";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";
import uuid from "react-native-uuid";

interface UseResidentsProps {
  republica: Republica;
  setRepublica: (rep: Republica) => void;
}

export const useResidents = ({
  republica,
  setRepublica,
}: UseResidentsProps) => {
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [moradorParaEditar, setMoradorParaEditar] = useState<Morador | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState<{
    nome: string;
    fotoPerfil?: string;
    telefone?: string;
    chavePix: string;
  }>({
    nome: "",
    fotoPerfil: "",
    telefone: "",
    chavePix: "",
  });

  const abrirNovoMorador = () => {
    setMoradorParaEditar(null);
    setEditForm({ nome: "", chavePix: "", fotoPerfil: undefined });
    setShowEditModal(true);
  };

  const copiarChavePix = async (morador: Morador) => {
    if (!morador.chavePix) {
      showToast.error("Morador não possui chave PIX cadastrada.");
      return;
    }

    await Clipboard.setStringAsync(morador.chavePix);
    setCopiadoId(morador.id);
    showToast.info("Chave copiada para a área de transferência.");
    setTimeout(() => setCopiadoId(null), 1500);
  };

  const calcularDividaPorMorador = (moradorId: string) => {
    return republica.contas.reduce((total, conta) => {
      const resp = conta.responsaveis.find((r) => r.moradorId === moradorId);
      // Só conta como dívida se o responsável específico não pagou
      if (resp && !resp.pago) {
        return total + resp.valor;
      }
      return total;
    }, 0);
  };

  const quantidadeContasPendentes = (moradorId: string) => {
    return republica.contas.filter((conta) =>
      conta.responsaveis.some((r) => r.moradorId === moradorId && !r.pago)
    ).length;
  };

  const abrirEdicaoMorador = (morador: Morador) => {
    setMoradorParaEditar(morador);
    setEditForm({
      nome: morador.nome,
      chavePix: morador.chavePix ?? "",
      fotoPerfil: morador.fotoPerfil,
    });
    setShowEditModal(true);
  };

  const salvarEdicaoMorador = async () => {
    if (!editForm.nome.trim()) {
      showToast.error("Informe o nome do morador.");
      return;
    }

    let republicaAtualizada: Republica;

    if (moradorParaEditar) {
      // Editar morador existente
      republicaAtualizada = {
        ...republica,
        moradores: republica.moradores.map((m) =>
          m.id === moradorParaEditar.id
            ? {
              ...m,
              nome: editForm.nome.trim(),
              fotoPerfil: editForm.fotoPerfil,
              telefone: editForm.telefone,
              chavePix: editForm.chavePix?.trim() || undefined,
            }
            : m
        ),
      };
      showToast.success("Morador atualizado com sucesso!");
    } else {
      // Adicionar novo morador
      const novo: Morador = {
        id: String(uuid.v4()),
        nome: editForm.nome.trim(),
        fotoPerfil: editForm.fotoPerfil,
        telefone: editForm.telefone?.trim() || undefined,
        chavePix: editForm.chavePix?.trim() || undefined,
      };
      republicaAtualizada = {
        ...republica,
        moradores: [...republica.moradores, novo],
      };
      showToast.success("Morador adicionado com sucesso!");
    }

    // Salvar no AsyncStorage
    try {
      const existing = await AsyncStorage.getItem("republic-data");
      if (existing) {
        const republicArray = JSON.parse(existing);
        const index = republicArray.findIndex(
          (r: Republica) => r.id === republica.id
        );

        if (index !== -1) {
          republicArray[index] = republicaAtualizada;
          await AsyncStorage.setItem(
            "republic-data",
            JSON.stringify(republicArray)
          );
        }
      }
    } catch (error) {
      console.error("Erro ao salvar morador no AsyncStorage:", error);
      showToast.error("Erro ao salvar morador.");
      return;
    }

    // Atualizar estado local
    setRepublica(republicaAtualizada);

    setShowEditModal(false);
    setMoradorParaEditar(null);
    setEditForm({ nome: "", chavePix: "", fotoPerfil: "", telefone: "" });
  };

  const fecharEdicaoMorador = () => {
    setShowEditModal(false);
    setMoradorParaEditar(null);
    setEditForm({ nome: "", chavePix: "", fotoPerfil: "", telefone: "" });
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      showToast.error("Precisamos de permissão para acessar suas fotos!");
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

  const updateEditFormField = <K extends keyof typeof editForm>(
    field: K,
    value: (typeof editForm)[K]
  ) => {
    setEditForm((s) => ({ ...s, [field]: value }));
  };

  const deletarMorador = (morador: Morador) => {
    Alert.alert(
      "Confirmar exclusão",
      `Tem certeza que deseja excluir ${morador.nome}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setRepublica({
              ...republica,
              moradores: republica.moradores.filter((m) => m.id !== morador.id),
            });
            Alert.alert("Sucesso", "Morador excluído com sucesso!");
          },
        },
      ]
    );
  };

  return {
    // Estados
    copiadoId,
    moradorParaEditar,
    showEditModal,
    editForm,

    // Funções de gerenciamento de moradores
    abrirNovoMorador,
    abrirEdicaoMorador,
    salvarEdicaoMorador,
    fecharEdicaoMorador,
    deletarMorador,

    // Funções de cálculo
    calcularDividaPorMorador,
    quantidadeContasPendentes,

    // Funções utilitárias
    copiarChavePix,
    selecionarImagem,
    updateEditFormField,
  };
};
