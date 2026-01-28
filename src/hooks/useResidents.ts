import { residentService } from "@/src/services/resident.service";
import { ResidentResponse } from "@/src/types/resident.types";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

type UseResidentState = {
  residents: ResidentResponse[];
  isLoading: boolean;
};

type UseResidentActions = {
  fetchResidents: (republicId: string) => Promise<ResidentResponse[] | null>;
  setResidents: (residents: ResidentResponse[]) => void;
};

type UseResidentReturn = UseResidentState & UseResidentActions;

export function useResidents(): UseResidentReturn {
  const [residents, setResidents] = useState<ResidentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchResidents = useCallback(async (republicId: string) => {
    setIsLoading(true);
    try {
      const residentsData = await residentService.getResidents(republicId);
      setResidents(residentsData);
      return residentsData;
    } catch (error) {
      console.error("Erro ao buscar moradores:", error);
      Alert.alert(
        "Erro",
        "Não foi possível carregar os moradores. Tente novamente."
      );
      return null;
    } finally {
      setIsLoading(false); // Adicione isso para sempre desligar o loading
    }
  }, []);

  return {
    // State
    residents,
    isLoading,
    // Actions
    fetchResidents,
    setResidents,
  };
}
