import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const STORAGE_KEY = "@republica_data";

export function useAsyncStorage<T>(initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do AsyncStorage ao montar
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar dados no AsyncStorage sempre que mudarem
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
      }
    };

    // Não salvar durante o carregamento inicial
    if (!isLoading) {
      saveData();
    }
  }, [data, isLoading]);

  return { data, setData, isLoading };
}
