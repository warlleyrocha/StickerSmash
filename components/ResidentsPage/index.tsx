import type { Morador, Republica } from "@/types/resume";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { EditResidentsModal } from "../EditResidentsModal";
import { ResidentCard } from "./ResidentCard";
import { useResidentsPage } from "./useResidentsPage";

interface ResidentsTabProps {
  republica: Republica;
  setRepublica: (rep: Republica) => void;
}

export const ResidentsTab: React.FC<ResidentsTabProps> = ({
  republica,
  setRepublica,
}) => {
  const {
    copiadoId,
    moradorParaEditar,
    showEditModal,
    editForm,
    abrirNovoMorador,
    abrirEdicaoMorador,
    salvarEdicaoMorador,
    fecharEdicaoMorador,
    deletarMorador,
    calcularDividaPorMorador,
    quantidadeContasPendentes,
    copiarChavePix,
    selecionarImagem,
    updateEditFormField,
  } = useResidentsPage({ republica, setRepublica });

  const renderMorador = ({ item: morador }: { item: Morador }) => {
    const divida = calcularDividaPorMorador(morador.id);
    const qtd = quantidadeContasPendentes(morador.id);

    return (
      <ResidentCard
        morador={morador}
        divida={divida}
        qtdContasPendentes={qtd}
        copiadoId={copiadoId}
        onPress={abrirEdicaoMorador}
        onCopyPix={copiarChavePix}
        onDelete={deletarMorador}
      />
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
      <EditResidentsModal
        visible={showEditModal}
        isEditMode={!!moradorParaEditar}
        editForm={editForm}
        onClose={fecharEdicaoMorador}
        onSave={salvarEdicaoMorador}
        onSelectImage={selecionarImagem}
        onUpdateField={updateEditFormField}
      />
    </View>
  );
};

export default ResidentsTab;
