import type { Republica } from "@/types/resume";
import { useMemo } from "react";

/**
 * Hook para gerenciar a lógica de cálculo do resumo da república
 * @param republica - Dados da república (contas e moradores)
 * @returns Objeto com todos os valores calculados para exibição
 */
export function useResume(republica: Republica) {
  // Calcula o total de todas as contas
  const totalContas = useMemo(
    () => republica.contas.reduce((acc, conta) => acc + conta.valor, 0),
    [republica.contas]
  );

  // Calcula o total de contas já pagas
  const contasPagas = useMemo(
    () =>
      republica.contas
        .filter((c) => c.pago)
        .reduce((acc, conta) => acc + conta.valor, 0),
    [republica.contas]
  );

  // Calcula o total de contas pendentes
  const contasPendentes = useMemo(
    () => totalContas - contasPagas,
    [totalContas, contasPagas]
  );

  // Quantidade de contas pagas
  const quantidadeContasPagas = useMemo(
    () => republica.contas.filter((c) => c.pago).length,
    [republica.contas]
  );

  // Quantidade de contas pendentes
  const quantidadeContasPendentes = useMemo(
    () => republica.contas.filter((c) => !c.pago).length,
    [republica.contas]
  );

  /**
   * Calcula a dívida individual de cada morador
   * Considera apenas valores não pagos pelos responsáveis
   */
  const dividas = useMemo(() => {
    const dividasMap: Record<string, number> = {};

    // Inicializa todas as dívidas com 0
    for (const morador of republica.moradores) {
      dividasMap[morador.id] = 0;
    }

    // Calcula as dívidas baseado nos responsáveis que não pagaram
    for (const conta of republica.contas) {
      for (const resp of conta.responsaveis) {
        // Só conta como dívida se o responsável específico não pagou
        if (!resp.pago) {
          dividasMap[resp.moradorId] =
            (dividasMap[resp.moradorId] || 0) + resp.valor;
        }
      }
    }

    return dividasMap;
  }, [republica.contas, republica.moradores]);

  return {
    totalContas,
    contasPagas,
    contasPendentes,
    quantidadeContasPagas,
    quantidadeContasPendentes,
    quantidadeTotalContas: republica.contas.length,
    dividas,
  };
}
