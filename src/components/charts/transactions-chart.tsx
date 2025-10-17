"use client";

import { TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTransactions } from "@/hooks/use-all-transactions";

import { Button } from "../ui/button";

const chartConfig = {
  total: {
    label: "Total Movimentado",
    theme: {
      light: "hsl(0, 0%, 10%)",
      dark: "hsl(0, 0%, 10%)",
    },
  },
} satisfies ChartConfig;

export function TransactionsChart() {
  const { transactions, isLoading } = useAllTransactions();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentYear = new Date().getFullYear();

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];

  const chartData = useMemo(() => {
    // Usar o mês selecionado ao invés do mês atual
    const currentMonth = selectedMonth;

    // Descobrir quantos dias tem no mês atual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Criar um mapa para armazenar o total movimentado por dia (usando data completa)
    const dailyTotals = new Map<string, number>();

    // Processar todas as transações
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);

      // Verificar se a transação é do mês atual
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        // Usar data local sem conversão de timezone
        const year = transactionDate.getFullYear();
        const month = String(transactionDate.getMonth() + 1).padStart(2, "0");
        const day = String(transactionDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const currentTotal = dailyTotals.get(dateStr) || 0;

        // Somar o valor absoluto (total movimentado, não importa se é gasto ou ganho)
        dailyTotals.set(
          dateStr,
          currentTotal + Math.abs(transaction.amountInCents),
        );
      }
    });

    // Criar array com todos os dias do mês
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const month = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateStr = `${currentYear}-${month}-${dayStr}`;

      data.push({
        date: dateStr,
        total: (dailyTotals.get(dateStr) || 0) / 100, // Converter centavos para reais
      });
    }

    return data;
  }, [transactions, selectedMonth, currentYear]);

  // Calcular total geral do mês
  const monthTotal = chartData.reduce((sum, day) => sum + day.total, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Total Movimentado no Mês
            </CardTitle>
            <CardDescription>
              {months[selectedMonth]} de {currentYear}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">{months[selectedMonth]}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-3 shadow-lg">
              <DropdownMenuLabel>Mês a ser Visualizado</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {months.map((month, index) => (
                <DropdownMenuItem
                  key={month}
                  onClick={() => setSelectedMonth(index)}
                  className={
                    selectedMonth === index ? "bg-accent font-semibold" : ""
                  }
                >
                  {month}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:p-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // Extrair dia e mês da string sem conversão de timezone
                const [year, month, day] = value.split("-");
                const date = new Date(
                  parseInt(year),
                  parseInt(month) - 1,
                  parseInt(day),
                );
                return date.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  labelFormatter={(value) => {
                    // Extrair ano, mês e dia da string sem conversão de timezone
                    const [year, month, day] = value.split("-");
                    const date = new Date(
                      parseInt(year),
                      parseInt(month) - 1,
                      parseInt(day),
                    );
                    return date.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                  formatter={(value) => {
                    return `R$ ${Number(value).toFixed(2).replace(".", ",")}`;
                  }}
                />
              }
            />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Volume total: R$ {monthTotal.toFixed(2).replace(".", ",")}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Mostrando o total de todas as movimentações financeiras do mês atual
        </div>
      </CardFooter>
    </Card>
  );
}
