import { useResidents } from "@/src/hooks/useResidents";
import type { RepublicResponse } from "@/src/types/republic.types";
import { useCallback, useEffect, useState } from "react";

export function useRepublicResidents(republics: RepublicResponse[]) {
  const { fetchResidents } = useResidents();
  const [residentsCount, setResidentsCount] = useState<Record<string, number>>(
    {}
  );
  const [loading, setLoading] = useState(false);

  const loadResidentsCount = useCallback(async () => {
    if (republics.length === 0) {
      setResidentsCount({});
      return;
    }

    setLoading(true);
    const counts: Record<string, number> = {};

    try {
      await Promise.all(
        republics.map(async (republic) => {
          try {
            const residents = await fetchResidents(republic.id);
            counts[republic.id] = residents?.length || 0;
          } catch (error) {
            console.error(
              `Erro ao buscar moradores da república ${republic.id}:`,
              error
            );
            counts[republic.id] = 0;
          }
        })
      );

      setResidentsCount(counts);
    } finally {
      setLoading(false);
    }
  }, [republics, fetchResidents]);

  useEffect(() => {
    loadResidentsCount();
  }, [loadResidentsCount]);

  const getResidentsCount = useCallback(
    (republicId: string): number => {
      return residentsCount[republicId] ?? 0;
    },
    [residentsCount]
  );

  return {
    residentsCount,
    getResidentsCount,
    loading,
    refresh: loadResidentsCount,
  };
}
