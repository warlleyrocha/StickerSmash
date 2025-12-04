import Header from "@/components/Header";
import InputField from "@/components/ui/input-field";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Resident {
  id: string;
  name: string;
  pixKey: string;
}

export default function Residents() {
  const router = useRouter();
  const [residentName, setResidentName] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [residents, setResidents] = useState<Resident[]>([]);

  const handleAddResident = () => {
    if (residentName.trim() && pixKey.trim()) {
      setResidents([
        ...residents,
        { id: Date.now().toString(), name: residentName, pixKey: pixKey },
      ]);
      setResidentName("");
      setPixKey("");
    }
  };

  const handleRemoveResident = (id: string) => {
    setResidents(residents.filter((resident) => resident.id !== id));
  };

  const handlePress = () => {
    router.push("/dashboard");
  };

  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Cabeçalho */}
        <Header title="Registrar Moradores" />

        {/* Formulário */}
        <View className="mb-6 flex-col gap-3">
          <InputField
            label="Nome"
            placeholder="Digite o nome do morador"
            value={residentName}
            onChangeText={setResidentName}
          />
          <InputField
            label="Chave PIX"
            placeholder="Digite a chave PIX"
            value={pixKey}
            onChangeText={setPixKey}
          />

          <TouchableOpacity
            className="mt-2 items-center justify-center rounded-lg bg-blue-500 px-4 py-3"
            onPress={handleAddResident}
          >
            <Text className="text-lg font-semibold text-white">
              + Adicionar Morador
            </Text>
          </TouchableOpacity>
        </View>

        {/* Lista */}
        {residents.length > 0 && (
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900">
              Moradores ({residents.length})
            </Text>

            <FlatList
              data={residents}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="mb-3 flex-col rounded-lg bg-gray-50 px-4 py-3">
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="flex-1 font-semibold text-gray-900">
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveResident(item.id)}
                    >
                      <Text className="text-lg text-red-500">×</Text>
                    </TouchableOpacity>
                  </View>
                  <Text className="text-sm text-gray-600">
                    PIX: {item.pixKey}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </ScrollView>

      {/* Botão fixo no rodapé */}
      <View className="pb-6">
        <TouchableOpacity
          className="w-full rounded-lg bg-blue-500 px-4 py-3"
          onPress={handlePress}
        >
          <Text className="text-center text-lg font-semibold text-white">
            Registrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
