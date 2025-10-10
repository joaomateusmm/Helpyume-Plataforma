"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserEssentialExpenses } from "@/lib/actions/essential-expenses";

interface EssentialExpense {
  id: string;
  userId: string;
  amountInCents: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function useEssentialExpenses() {
  const [essentialExpenses, setEssentialExpenses] = useState<
    EssentialExpense[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEssentialExpenses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserEssentialExpenses();

      if (result.success) {
        setEssentialExpenses(result.data);
      } else {
        setError(result.error || "Erro ao carregar gastos essenciais");
        setEssentialExpenses([]);
      }
    } catch (err) {
      console.error("Erro ao buscar gastos essenciais:", err);
      setError("Erro inesperado ao carregar gastos essenciais");
      setEssentialExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEssentialExpenses();
  }, [fetchEssentialExpenses]);

  const refetch = useCallback(() => {
    fetchEssentialExpenses();
  }, [fetchEssentialExpenses]);

  return {
    essentialExpenses,
    isLoading,
    error,
    refetch,
  };
}
