// utils/inputMasks.ts
// Utilitário para máscaras de input

export function maskPhone(value: string): string {
  // Remove tudo que não for número
  let cleaned = value.replaceAll(/\D/g, "");

  // Máscara para telefone brasileiro (com DDD): (99) 99999-9999 ou (99) 9999-9999
  if (cleaned.length <= 10) {
    // Formato fixo: (99) 9999-9999
    cleaned = cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  } else {
    // Formato celular: (99) 99999-9999
    cleaned = cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  while (cleaned.endsWith("-") || cleaned.endsWith(" ")) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}
