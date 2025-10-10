"use client";

import { Calendar, Download, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAllTransactions } from "@/hooks/use-all-transactions";

export default function TransacoesPage() {
  const { transactions, isLoading, error } = useAllTransactions();
  const [itemsPerPage, setItemsPerPage] = useState<number | string>(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleItemsPerPageChange = (value: string) => {
    if (value === "Todos") {
      setItemsPerPage(filteredTransactions.length || transactions.length);
    } else {
      setItemsPerPage(parseInt(value));
    }
  };

  // Filtrar transações baseado no termo de busca
  const filteredTransactions = transactions.filter((transaction) => {
    if (!searchTerm.trim()) return true;

    const search = searchTerm.toLowerCase();
    const title = transaction.title.toLowerCase();
    const description = (transaction.description || "").toLowerCase();
    const amount = (transaction.amountInCents / 100).toFixed(2);

    return (
      title.includes(search) ||
      description.includes(search) ||
      amount.includes(search)
    );
  });

  const displayedTransactions =
    itemsPerPage === "Todos" ||
    Number(itemsPerPage) >= filteredTransactions.length
      ? filteredTransactions
      : filteredTransactions.slice(0, Number(itemsPerPage));
  return (
    <div className="p-6">
      <PageHeader title="Transações">
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{transactions.length}</p>
              <p className="text-muted-foreground text-xs">
                Ganhos e gastos consolidados
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Volume Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                R${" "}
                {(
                  transactions.reduce(
                    (total, t) =>
                      total +
                      (t.type === "income"
                        ? t.amountInCents
                        : -t.amountInCents),
                    0,
                  ) / 100
                )
                  .toFixed(2)
                  .replace(".", ",")}
              </p>
              <p className="text-muted-foreground text-xs">
                Saldo líquido de todas as transações
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Última Transação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {transactions.length > 0
                  ? new Date(transactions[0].createdAt).toLocaleDateString(
                      "pt-BR",
                    )
                  : "Nenhuma"}
              </p>
              <p className="text-muted-foreground text-xs">
                {transactions.length > 0
                  ? transactions[0].title
                  : "Sem transações"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex gap-2">
                Histórico de Transações{" "}
                <span className="text-muted-foreground text-sm font-normal">
                  (
                  {Number(itemsPerPage) >= filteredTransactions.length
                    ? filteredTransactions.length
                    : displayedTransactions.length}{" "}
                  de {filteredTransactions.length}
                  {searchTerm &&
                  filteredTransactions.length !== transactions.length
                    ? ` - filtrado de ${transactions.length}`
                    : ""}
                  )
                </span>
              </div>
              <div className="flex max-w-lg items-center gap-2 rounded-md border">
                <Search className="ml-4 h-4 w-4" />
                <Input
                  placeholder="Busque transações por valor, título ou descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="-ml-1 w-84 border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchTerm && (
              <div className="mb-4">
                <p className="text-muted-foreground text-sm">
                  {filteredTransactions.length} resultado
                  {filteredTransactions.length !== 1 ? "s" : ""} encontrado
                  {filteredTransactions.length !== 1 ? "s" : ""} para &ldquo;
                  {searchTerm}&rdquo;
                </p>
              </div>
            )}
            {isLoading ? (
              <div className="space-y-3">
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-red-500">{error}</p>
              </div>
            ) : displayedTransactions.length > 0 ? (
              <Accordion
                className="rounded-lg border px-4"
                type="single"
                collapsible
              >
                {displayedTransactions.map((transaction, index) => (
                  <AccordionItem key={transaction.id} value={`item-${index}`}>
                    <AccordionTrigger>
                      <div className="flex w-full justify-between">
                        <div className="flex items-center gap-2">
                          <span>{transaction.title}</span>
                        </div>
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          R$ {transaction.type === "income" ? "+" : "-"}
                          {(transaction.amountInCents / 100)
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex w-full justify-between">
                        <p className="text-muted-foreground">
                          {transaction.description || "Sem descrição"}
                        </p>
                        <p className="text-muted-foreground mr-8">
                          {new Date(transaction.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}{" "}
                          -{" "}
                          {new Date(transaction.createdAt).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center">
                <div className="my-6 flex justify-center">
                  <Image
                    src="/assets/illustration.svg"
                    alt="Ilustração boneco de estado vazio"
                    width={200}
                    height={200}
                    className="opacity-50"
                  />
                </div>
                <p className="text-muted-foreground">
                  Nenhuma transação encontrada.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Suas transações de ganhos e gastos aparecerão aqui.
                </p>
              </div>
            )}
            {filteredTransactions.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-muted-foreground text-xs">
                  Visualize e gerencie todas as suas transações financeiras em
                  um só lugar. Esta página consolida tanto ganhos quanto gastos.
                </p>
                <div className="mt-2 rounded-md border bg-[#0A0A0A] px-2 py-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-none outline-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                      {Number(itemsPerPage) >= filteredTransactions.length
                        ? "Todos"
                        : itemsPerPage}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Visualizar</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleItemsPerPageChange("10")}
                      >
                        10
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleItemsPerPageChange("20")}
                      >
                        20
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleItemsPerPageChange("30")}
                      >
                        30
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleItemsPerPageChange("Todos")}
                      >
                        Todos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
