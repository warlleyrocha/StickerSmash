import { api } from "@/services/api";
import {
  CreateResidentRequest,
  ResidentResponse,
} from "@/types/resident.types";
import { AxiosError } from "axios";

export const residentService = {
  // Método para criar um novo morador
  createResident: async (
    data: CreateResidentRequest
  ): Promise<ResidentResponse> => {
    try {
      const response = await api.post<ResidentResponse>("/moradores", data);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 400:
            throw new Error("Requisição inválida.");
          case 401:
            throw new Error("Não autenticado.");
          case 500:
            throw new Error("Erro interno do servidor.");
          default:
            throw new Error("Erro ao criar morador.");
        }
      }
      throw error;
    }
  },

  // Método para obter a lista de moradores
  getResidents: async (id: string): Promise<ResidentResponse[]> => {
    try {
      const response = await api.get<ResidentResponse[]>(
        `/moradores/republica/${id}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 400:
            throw new Error("ID da república inválido.");
          case 401:
            throw new Error("Não autenticado.");
          case 404:
            throw new Error("República não encontrada.");
          case 500:
            throw new Error("Erro interno do servidor.");
          default:
            throw new Error("Erro ao obter moradores.");
        }
      }
      throw error;
    }
  },
};
