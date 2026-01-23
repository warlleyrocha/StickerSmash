import { api } from "@/services/api";
import {
  InviteFetch,
  InviteRequest,
  InviteResponse,
  PatchInviteStatusResponse,
  StatusInvite,
} from "@/types/invite.types";
import { AxiosError } from "axios";

export const inviteService = {
  // Método para enviar um convite
  sendInvite: async (data: InviteRequest): Promise<InviteResponse> => {
    try {
      const response = await api.post<InviteResponse>("/convites", data);
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
            throw new Error("Erro ao enviar convite.");
        }
      }
      throw error;
    }
  },

  // Método para listar convites de uma república
  getInvitesByRepublicId: async (
    republicaId: string
  ): Promise<InviteFetch[]> => {
    try {
      const response = await api.get<InviteFetch[]>(
        `/convites/republica/${republicaId}`
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        switch (error.response?.status) {
          case 401:
            throw new Error("Não autenticado.");
          case 500:
            throw new Error("Erro interno do servidor.");
          default:
            throw new Error("Erro ao obter convites.");
        }
      }
      throw error;
    }
  },

  // Método para aceitar ou recusar convite
  patchInviteStatus: async (
    inviteId: string,
    status: StatusInvite
  ): Promise<PatchInviteStatusResponse> => {
    try {
      const response = await api.patch<PatchInviteStatusResponse>(
        `/convites/${inviteId}`,
        { status }
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
            throw new Error("Erro ao atualizar status do convite.");
        }
      }
      throw error;
    }
  },
};
