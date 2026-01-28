// hooks/useRepublicList.ts
import { useCallback, useState } from "react";
import { republicService } from "../services/republic.service";
import type { RepublicResponse } from "../types/republic.types";
import { Alert } from "react-native";

export function useRepublicList() {
  const [republics, setRepublics] = useState<RepublicResponse[]>([]);

  // Função para buscar repúblicas
  const fetchRepublics = useCallback(async () => {
    try {
      const data = await republicService.getRepublics();
      setRepublics(data);
    } catch (error) {
      console.error("Erro ao buscar repúblicas:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar as repúblicas. Tente novamente."
      );
      setRepublics([]);
    } finally {
      console.log("Busca de repúblicas finalizada.");
    }
  }, []);

  // Função para buscar repúblicas por ID
  const fetchRepublicById = useCallback(async (id: string) => {
    try {
      const republic = await republicService.getRepublicById(id);
      return republic;
    } catch (error) {
      console.error("Erro ao buscar república por ID:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar a república. Tente novamente."
      );
      return null;
    }
  }, []);

  return {
    republics,
    setRepublics,
    fetchRepublics,
    fetchRepublicById,
  };
}
