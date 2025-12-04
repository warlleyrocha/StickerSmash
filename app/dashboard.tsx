import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { AccountsTab } from "@/components/Accounts";
import { AddAccountModal } from "@/components/AddAccountModal";
import { ResidentsTab } from "@/components/ResidentsPage";
import { ResumeTab } from "@/components/Resume";
import Tabs from "@/components/Tabs";

import type { Republica } from "@/types/resume";
import type { TabKey } from "@/types/tabs";

const ImageHeader = require("@/assets/images/icon.png");

export const mockRepublica: Republica = {
  moradores: [
    { id: "m1", nome: "Ana", chavePix: "ana@pix" },
    { id: "m2", nome: "Bruno" },
    { id: "m3", nome: "Carla", chavePix: "carla@pix" },
    { id: "m4", nome: "Diego" },
  ],

  contas: [
    {
      id: "c1",
      descricao: "Conta de Luz",
      valor: 200,
      vencimento: "2024-02-10",
      pago: false,
      responsavelId: "m1",
      metodoPagamento: "PIX",
      responsaveis: [
        { moradorId: "m1", valor: 50 },
        { moradorId: "m2", valor: 150 },
      ],
    },
    {
      id: "c2",
      descricao: "Internet",
      valor: 150,
      vencimento: "2024-02-05",
      pago: true,
      pagoEm: "2024-02-06",
      responsavelId: "m3",
      metodoPagamento: "Crédito",
      responsaveis: [{ moradorId: "m3", valor: 150 }],
    },
    {
      id: "c3",
      descricao: "Água",
      valor: 100,
      vencimento: "2024-02-12",
      pago: false,
      responsavelId: "m4",
      metodoPagamento: "PIX",
      responsaveis: [{ moradorId: "m4", valor: 100 }],
    },
  ],
};

export default function Dashboard() {
  const [tab, setTab] = useState<TabKey>("resumo");

  // 🔥 Agora o mock controla completamente a tela
  const [republica, setRepublica] = useState<Republica>(mockRepublica);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <View className="flex-1 bg-[#FAFAFA]">
      {/* HEADER */}
      <View className="mt-[32px] flex-row gap-3 border-b border-b-black/10 bg-[#FAFAFA] px-[16px] py-4">
        <View className="h-[50px] w-[50px] items-center justify-center rounded-full bg-black">
          <Image
            source={ImageHeader}
            style={{ width: 50, height: 50, resizeMode: "contain" }}
          />
        </View>

        <View className="flex-1 justify-center">
          <Text className="text-base font-semibold">Cachorro Quente</Text>
          <Text className="text-sm text-gray-500">
            {republica.moradores.length} moradores
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="self-center rounded-md bg-black px-4 py-2"
        >
          <Text className="text-white">+ Nova Conta</Text>
        </TouchableOpacity>
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

      {/* Modal */}
      <AddAccountModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        republica={republica}
        setRepublica={setRepublica}
      />
    </View>
  );
}
