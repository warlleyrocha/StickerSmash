export enum StatusInvite {
  PENDENTE = "PENDENTE",
  ACEITO = "ACEITO",
  RECUSADO = "RECUSADO",
}

export interface Invite {
  id: string;
  usuarioId: string;
  republicaId: string;
  status: StatusInvite;
  criadoEm: string;
  atualizadoEm: string;
}

export interface InviteFetch {
  id: string;
  usuarioId: string;
  status: StatusInvite;
}

export interface InviteRequest {
  email: string;
  republicaId: string;
}

export interface InviteResponse {
  id: string;
  usuarioId: string;
  republicaId: string;
  status: StatusInvite;
  criadoEm: string;
  atualizadoEm: string;
}

export interface PatchInviteStatusResponse {
  id: string;
  status: StatusInvite;
}
