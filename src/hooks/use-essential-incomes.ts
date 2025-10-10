"use client";

import { useEffect, useState } from "react";

import { getUserEssentialIncomes } from "@/lib/actions/essential-incomes";

export interface EssentialIncome {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  amountInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useEssentialIncomes() {
  const [essentialIncomes, setEssentialIncomes] = useState<EssentialIncome[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEssentialIncomes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserEssentialIncomes();

      if (result.success) {
        setEssentialIncomes(result.data);
      } else {
        setError(result.error || "Erro ao carregar ganhos essenciais");
        setEssentialIncomes([]);
      }
    } catch (err) {
      console.error("Erro ao buscar ganhos essenciais:", err);
      setError("Erro inesperado ao carregar ganhos essenciais");
      setEssentialIncomes([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEssentialIncomes();
  }, []);

  const refetch = () => {
    fetchEssentialIncomes();
  };

  return {
    essentialIncomes,
    isLoading,
    error,
    refetch,
  };
}
