"use client";

import "../animated-card.css";

import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChartCandlestick,
  FileText,
  NotebookPen,
} from "lucide-react";
import { useEffect, useState } from "react";

import { ExpenseIncomeChart } from "@/components/charts/expense-income-chart";
import { TransactionsChart } from "@/components/charts/transactions-chart";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useAllTransactions } from "@/hooks/use-all-transactions";
import { useInvestments } from "@/hooks/use-investments";

export default function Home() {
  const { transactions, isLoading } = useAllTransactions();
  const { investments, isLoading: isLoadingInvestments } = useInvestments();
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

  const totalInvestimentos =
    investments.reduce((total, inv) => total + inv.amountInCents, 0) / 100;

  const totalTransacoes = transactions.length;

  // Calcular saldo atual (Ganhos - Gastos)
  const saldoAtual = totalGanhos - totalGastos;

  // Formatar valores para exibição
  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace(".", ",")}`;

  if (isLoading || isLoadingInvestments || !isHydrated) {
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
                className="bg-card flex h-[180px] flex-col justify-between rounded-lg border p-4"
              >
                <div className="bg-muted h-12 w-12 animate-pulse rounded-full"></div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 animate-pulse rounded"></div>
                  <div className="bg-muted h-8 animate-pulse rounded"></div>
                  <div className="bg-muted h-3 animate-pulse rounded"></div>
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
        {/* <div className="bg-card flex h-8 w-auto items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex w-auto items-center">
              <Calendar className="mr-2 h-4 w-4" />
              Visualizar
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mt-2">
              <DropdownMenuLabel>Período</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Tudo</DropdownMenuItem>
              <DropdownMenuItem>Última Semana</DropdownMenuItem>
              <DropdownMenuItem>Último Mês</DropdownMenuItem>
              <DropdownMenuItem>Último Ano</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div> */}
        {/* <Button variant="outline" size="sm">
          <FileText className="h-4 w-4" />
          Relatórios
        </Button> */}
        <div className="bg-card flex h-8 items-center justify-center rounded-md border px-3 text-sm font-medium shadow-sm">
          Saldo Atual:{" "}
          <span
            className={`ml-1 ${
              saldoAtual >= 0
                ? "text-green-700 dark:text-green-400"
                : "text-red-700 dark:text-red-400"
            }`}
          >
            {formatCurrency(saldoAtual)}
          </span>
        </div>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-card flex h-[180px] flex-col justify-between rounded-lg border p-4 duration-300 hover:scale-[1.02]">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full shadow-md">
              {" "}
              <ChartCandlestick />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Investidos</p>
              <p className="animate-gradient-x bg-gradient-to-r from-blue-600/70 to-blue-900/70 bg-clip-text text-3xl font-bold text-transparent">
                {formatCurrency(totalInvestimentos)}
              </p>
              <p className="text-muted-foreground text-xs">
                Essa é a soma de tudo que você investiu até agora.
              </p>
            </div>
          </div>
          <div className="bg-card flex h-[180px] flex-col justify-between rounded-lg border p-4 duration-300 hover:scale-[1.02]">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full shadow-md">
              {" "}
              <BanknoteArrowDown />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total de Gastos</p>
              <p className="animate-gradient-x bg-gradient-to-r from-red-600/80 to-red-900/80 bg-clip-text text-3xl font-bold text-transparent">
                {formatCurrency(totalGastos)}
              </p>
              <p className="text-muted-foreground text-xs">
                Essa é a soma de tudo que você gastou até agora.
              </p>
            </div>
          </div>
          <div className="bg-card flex h-[180px] flex-col justify-between rounded-lg border p-4 duration-300 hover:scale-[1.02]">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full shadow-md">
              {" "}
              <BanknoteArrowUp />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total de Ganhos</p>
              <p className="animate-gradient-x bg-gradient-to-r from-green-600/70 to-green-900/70 bg-clip-text text-3xl font-bold text-transparent">
                {formatCurrency(totalGanhos)}
              </p>
              <p className="text-muted-foreground text-xs">
                Essa é a soma de tudo que você ganhou até agora.
              </p>
            </div>
          </div>
          <div className="bg-card flex h-[180px] flex-col justify-between rounded-lg border p-4 duration-300 hover:scale-[1.02]">
            <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full shadow-md">
              {" "}
              <NotebookPen />
            </div>
            <div>
              <p className="text-muted-foreground text-sm">
                Total de Transações
              </p>
              <p className="text-3xl font-bold text-black dark:text-white">
                {totalTransacoes}
              </p>
              <p className="text-muted-foreground text-xs">
                Essa é a soma de todas as suas movimentações bancárias.
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ExpenseIncomeChart />

          <TransactionsChart />
        </div>
      </div>
    </div>
  );
}
