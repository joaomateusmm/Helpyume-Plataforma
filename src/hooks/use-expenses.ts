"use client";

import { useEffect, useState } from "react";

import { getUserExpenses } from "@/lib/actions/expenses";

export interface Expense {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  amountInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserExpenses();

      if (result.success) {
        setExpenses(result.data);
      } else {
        setError(result.error || "Erro ao carregar gastos");
        setExpenses([]);
      }
    } catch (err) {
      console.error("Erro ao buscar gastos:", err);
      setError("Erro inesperado ao carregar gastos");
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const refetch = () => {
    fetchExpenses();
  };

  return {
    expenses,
    isLoading,
    error,
    refetch,
  };
}
