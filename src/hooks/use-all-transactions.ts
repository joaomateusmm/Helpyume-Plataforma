"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserExpenses } from "@/lib/actions/expenses";
import { getUserTransactions } from "@/lib/actions/transactions";

interface Transaction {
  id: string;
  userId: string;
  amountInCents: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  type: "income" | "expense"; // Para diferenciar ganhos de gastos
}

export function useAllTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Buscar ganhos e gastos em paralelo
      const [incomeResult, expenseResult] = await Promise.all([
        getUserTransactions(),
        getUserExpenses(),
      ]);

      const allTransactions: Transaction[] = [];

      // Adicionar ganhos
      if (incomeResult.success) {
        const incomes = incomeResult.data.map((transaction) => ({
          ...transaction,
          type: "income" as const,
        }));
        allTransactions.push(...incomes);
      }

      // Adicionar gastos
      if (expenseResult.success) {
        const expenses = expenseResult.data.map((expense) => ({
          ...expense,
          type: "expense" as const,
        }));
        allTransactions.push(...expenses);
      }

      // Ordenar por data de criação (mais recente primeiro)
      allTransactions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      setTransactions(allTransactions);

      // Se alguma das requisições falhou, mostrar erro
      if (!incomeResult.success || !expenseResult.success) {
        setError("Erro ao carregar algumas transações");
      }
    } catch (err) {
      console.error("Erro ao buscar transações:", err);
      setError("Erro inesperado ao carregar transações");
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  const refetch = useCallback(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  return {
    transactions,
    isLoading,
    error,
    refetch,
  };
}
