import { inviteService } from "@/services/invite.service";
import type {
  InviteFetch,
  InviteRequest,
  PatchInviteStatusResponse,
  StatusInvite,
} from "@/types/invite.types";
import { useCallback, useState } from "react";

export function useInvites(republicaId?: string) {
  const [invites, setInvites] = useState<InviteFetch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar convites da república
  const fetchInvites = useCallback(async () => {
    if (!republicaId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await inviteService.getInvitesByRepublicId(republicaId);
      setInvites(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Erro ao buscar convites.");
    } finally {
      setLoading(false);
    }
  }, [republicaId]);

  // Enviar convite
  const sendInvite = useCallback(async (payload: InviteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inviteService.sendInvite(payload);
      // Opcionalmente já insere na lista
      setInvites((prev) => [
        ...prev,
        {
          id: response.id,
          usuarioId: response.usuarioId,
          status: response.status,
        },
      ]);
      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao enviar convite.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Aceitar / recusar convite
  const updateInviteStatus = useCallback(
    async (
      inviteId: string,
      status: StatusInvite
    ): Promise<PatchInviteStatusResponse> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await inviteService.patchInviteStatus(inviteId, status);

        // Atualiza no estado
        setInvites((prev) =>
          prev.map((i) =>
            i.id === inviteId ? { ...i, status: updated.status } : i
          )
        );

        return updated;
      } catch (err: any) {
        setError(err.message || "Erro ao atualizar convite.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    invites,
    loading,
    error,
    fetchInvites,
    sendInvite,
    updateInviteStatus,
  };
}
