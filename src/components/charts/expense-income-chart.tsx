"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import { useAllTransactions } from "@/hooks/use-all-transactions";

import { Button } from "../ui/button";

const chartConfig = {
  gastos: {
    label: "Gastos",
    theme: {
      light: "hsl(0 70% 50%)",
      dark: "hsl(0 75% 60%)",
    },
  },
  ganhos: {
    label: "Ganhos",
    theme: {
      light: "hsl(145 65% 45%)",
      dark: "hsl(150 70% 55%)",
    },
  },
} satisfies ChartConfig;

interface ChartDataPoint {
  date: string;
  gastos: number;
  ganhos: number;
}

export function ExpenseIncomeChart() {
  const { transactions, isLoading } = useAllTransactions();
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("gastos");
  const [selectedMonth, setSelectedMonth] = React.useState(
    new Date().getMonth(),
  );
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

  // Processar transações e agrupar por data
  const chartData = React.useMemo(() => {
    // Usar o mês selecionado ao invés do mês atual
    const currentMonth = selectedMonth;

    // Calcular quantos dias tem o mês atual
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Criar um objeto com todos os dias do mês inicializados com 0
    const groupedByDate: Record<string, ChartDataPoint> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const month = String(currentMonth + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateStr = `${currentYear}-${month}-${dayStr}`;
      groupedByDate[dateStr] = {
        date: dateStr,
        gastos: 0,
        ganhos: 0,
      };
    }

    // Adicionar os valores das transações
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      // Só considerar transações do mês atual
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        // Usar data local sem conversão de timezone
        const year = transactionDate.getFullYear();
        const month = String(transactionDate.getMonth() + 1).padStart(2, "0");
        const day = String(transactionDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;

        const amount = transaction.amountInCents / 100;
        if (transaction.type === "expense") {
          groupedByDate[dateStr].gastos += amount;
        } else {
          groupedByDate[dateStr].ganhos += amount;
        }
      }
    });

    // Converter para array e ordenar por data
    return Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [transactions, selectedMonth, currentYear]);

  // Calcular totais
  const total = React.useMemo(
    () => ({
      gastos: chartData.reduce((acc, curr) => acc + curr.gastos, 0),
      ganhos: chartData.reduce((acc, curr) => acc + curr.ganhos, 0),
    }),
    [chartData],
  );

  if (isLoading) {
    return (
      <Card className="py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-6">
            <CardTitle>Gastos vs Ganhos</CardTitle>
            <CardDescription>Carregando dados...</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-6 sm:p-6">
          <div className="bg-muted h-[250px] w-full animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-6">
          <CardTitle>Gastos vs Ganhos</CardTitle>
          <CardDescription>
            Movimentações financeiras de {months[selectedMonth]} de{" "}
            {currentYear}
          </CardDescription>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="w-auto">
                {months[selectedMonth]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="shadow-lg">
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
        <div className="flex">
          {["gastos", "ganhos"].map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground flex items-center gap-2 text-xs">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor:
                        key === "gastos"
                          ? "hsl(0 70% 50%)"
                          : "hsl(145 65% 45%)",
                    }}
                  />
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  R$ {total[chart].toFixed(2).replace(".", ",")}
                </span>
              </button>
            );
          })}
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
            <Bar
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
