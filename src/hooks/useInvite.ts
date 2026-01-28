import { inviteService } from "@/src/services/invite.service";
import type {
  Invite,
  InviteRequest,
  PatchInviteStatusResponse,
  StatusInvite,
} from "@/src/types/invite.types";
import { useCallback, useState } from "react";

export function useInvites() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Enviar convite
  const sendInvite = useCallback(async (payload: InviteRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await inviteService.sendInvite(payload);

      return response;
    } catch (err: any) {
      setError(err.message || "Erro ao enviar convite.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar convites da república
  const fetchInvites = useCallback(async (republicaId: string) => {
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
