"use client";

import { useEffect, useState } from "react";

import { getUserTransactions } from "@/lib/actions/transactions";

interface Transaction {
  id: string;
  title: string;
  description: string | null;
  amountInCents: number;
  createdAt: Date;
  userId: string;
  updatedAt: Date;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);

    const result = await getUserTransactions();

    if (result.success) {
      setTransactions(result.data);
    } else {
      setError(result.error || "Erro desconhecido");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return {
    transactions,
    isLoading,
    error,
    refetch: fetchTransactions,
  };
}
