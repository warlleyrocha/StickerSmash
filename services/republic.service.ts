import { api } from "@/services/api";
import { RepublicPost, RepublicResponse } from "@/types/republic.types";
import { AxiosError } from "axios";

export const republicService = {
  // Método para criar uma nova república
  createRepublic: async (data: RepublicPost): Promise<RepublicResponse> => {
    try {
      const response = await api.post<RepublicResponse>("/republicas", data);
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
            throw new Error("Erro ao criar república.");
        }
      }
      throw error;
    }
  },

  //Método para obter a lista de repúblicas
  getRepublics: async (): Promise<RepublicResponse[]> => {
    console.log("🌐 Chamando GET /republicas...");
    try {
      const response = await api.get<RepublicResponse[]>("/republicas");
      console.log("📦 Resposta da API:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Erro no getRepublics:", error);
      if (error instanceof AxiosError) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        switch (error.response?.status) {
          case 401:
            throw new Error("Não autenticado.");
          case 500:
            throw new Error("Erro interno do servidor.");
          default:
            throw new Error("Erro ao obter repúblicas.");
        }
      }
      throw error;
    }
  },

  // Método para obter detalhes de uma república específica
  getRepublicById: async (id: string): Promise<RepublicResponse> => {
    try {
      const response = await api.get<RepublicResponse>(`/republicas/${id}`);

      console.log("📦 Resposta da API:", response.data);

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
            throw new Error("Erro ao obter detalhes da república.");
        }
      }
      throw error;
    }
  },

  // Método para atualizar uma república
  updateRepublic: async (
    id: string,
    data: Partial<RepublicPost>
  ): Promise<RepublicResponse> => {
    try {
      const response = await api.patch<RepublicResponse>(
        `/republicas/${id}`,
        data
      );
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
            throw new Error("Erro ao atualizar república.");
        }
      }
      throw error;
    }
  },
};
