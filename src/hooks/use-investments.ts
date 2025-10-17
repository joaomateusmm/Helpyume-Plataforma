"use client";

import { useEffect, useState } from "react";

import {
  getEssentialInvestments,
  getUserInvestments,
} from "@/lib/actions/investments";

export interface Investment {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  amountInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useInvestments() {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvestments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getUserInvestments();

      if (result.success) {
        setInvestments(result.data);
      } else {
        setError(result.error || "Erro ao carregar investimentos");
        setInvestments([]);
      }
    } catch (err) {
      console.error("Erro ao buscar investimentos:", err);
      setError("Erro inesperado ao carregar investimentos");
      setInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const refetch = () => {
    fetchInvestments();
  };

  return {
    investments,
    isLoading,
    error,
    refetch,
  };
}

export interface EssentialInvestment {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  amountInCents: number;
  createdAt: Date;
  updatedAt: Date;
}

export function useEssentialInvestments() {
  const [essentialInvestments, setEssentialInvestments] = useState<
    EssentialInvestment[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEssentialInvestments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getEssentialInvestments();

      if (result.success) {
        setEssentialInvestments(result.data);
      } else {
        setError(result.error || "Erro ao carregar investimentos essenciais");
        setEssentialInvestments([]);
      }
    } catch (err) {
      console.error("Erro ao buscar investimentos essenciais:", err);
      setError("Erro inesperado ao carregar investimentos essenciais");
      setEssentialInvestments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEssentialInvestments();
  }, []);

  const refetch = () => {
    fetchEssentialInvestments();
  };

  return {
    essentialInvestments,
    isLoading,
    error,
    refetch,
  };
}
