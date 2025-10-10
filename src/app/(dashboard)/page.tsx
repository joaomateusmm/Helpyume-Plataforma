"use client";

import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChartCandlestick,
  FileText,
  NotebookPen,
} from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useAllTransactions } from "@/hooks/use-all-transactions";

export default function Home() {
  const { transactions, isLoading } = useAllTransactions();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Calcular valores das transações
  const totalGastos =
    transactions
      .filter((t) => t.type === "expense")
      .reduce((total, t) => total + t.amountInCents, 0) / 100;

  const totalGanhos =
    transactions
      .filter((t) => t.type === "income")
      .reduce((total, t) => total + t.amountInCents, 0) / 100;

  const totalTransacoes = transactions.length;

  // Formatar valores para exibição
  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace(".", ",")}`;

  if (isLoading || !isHydrated) {
    return (
      <div className="p-6">
        <PageHeader title="Dashboard">
          <Button variant="outline" size="sm">
            <FileText className="mr-2 h-4 w-4" />
            Relatórios
          </Button>
        </PageHeader>
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4"
              >
                <div className="h-12 w-12 animate-pulse rounded-full bg-[#292929]"></div>
                <div className="space-y-2">
                  <div className="h-4 animate-pulse rounded bg-[#292929]"></div>
                  <div className="h-8 animate-pulse rounded bg-[#292929]"></div>
                  <div className="h-3 animate-pulse rounded bg-[#292929]"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader title="Dashboard">
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Relatórios
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-gradient-x animate-text-gradient ml-1 flex h-[180px] flex-col justify-between rounded-lg border bg-gradient-to-tr from-pink-800/80 via-pink-700/20 to-[#292929] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929] shadow-lg">
              {" "}
              <ChartCandlestick />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Investidos</p>
              <p className="text-3xl font-bold text-gray-50">R$ 0,00</p>
              <p className="text-xs text-gray-300">
                Essa é a soma de tudo que você investiu até agora.
              </p>
            </div>
          </div>
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <BanknoteArrowDown />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Gastos</p>
              <p className="text-3xl font-bold text-red-400">
                {formatCurrency(totalGastos)}
              </p>
              <p className="text-xs text-gray-300">
                Essa é a soma de tudo que você gastou até agora.
              </p>
            </div>
          </div>
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <BanknoteArrowUp />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Ganhos</p>
              <p className="text-3xl font-bold text-green-400">
                {formatCurrency(totalGanhos)}
              </p>
              <p className="text-xs text-gray-300">
                Essa é a soma de tudo que você ganhou até agora.
              </p>
            </div>
          </div>
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <NotebookPen />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Transações</p>
              <p className="text-3xl font-bold text-yellow-300">
                {totalTransacoes}
              </p>
              <p className="text-xs text-gray-300">
                Essa é a soma de todas as suas movimentações bancárias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
