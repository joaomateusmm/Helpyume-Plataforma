"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheck,
  CopyX,
  Filter,
  Plus,
  SquareCheck,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useTransactions } from "@/hooks/use-transactions";
import {
  createTransaction,
  deleteTransactions,
} from "@/lib/actions/transactions";

// Schema de validação
const transactionSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(100, "Título muito longo"),
  amount: z.string().min(1, "Valor é obrigatório"),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function GanhosPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<Set<string>>(
    new Set(),
  );
  const { transactions, isLoading, refetch } = useTransactions();
  const { user } = useCurrentUser();

  // Debug temporário
  console.log("Usuário logado no componente:", user);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0], // Data atual no formato YYYY-MM-DD
      time: new Date().toTimeString().slice(0, 5), // Hora atual no formato HH:MM
    },
  });

  // Funções para controlar checkboxes
  const handleSelectTransaction = (transactionId: string) => {
    setSelectedTransactions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(transactionId)) {
        newSet.delete(transactionId);
      } else {
        newSet.add(transactionId);
      }
      return newSet;
    });
  };

  const handleSelectAllPage = () => {
    const currentPageTransactions = transactions.map((t) => t.id);
    setSelectedTransactions(new Set(currentPageTransactions));
    toast.success(`${currentPageTransactions.length} transações selecionadas`);
  };

  const handleSelectAll = () => {
    const allTransactionIds = transactions.map((t) => t.id);
    setSelectedTransactions(new Set(allTransactionIds));
    toast.success(
      `Todas as ${allTransactionIds.length} transações selecionadas`,
    );
  };

  const handleClearSelection = () => {
    setSelectedTransactions(new Set());
    toast.info("Seleção limpa");
  };

  const handleDeleteSelected = async () => {
    if (selectedTransactions.size === 0) {
      toast.error("Nenhuma transação selecionada");
      return;
    }

    setIsDeleting(true);
    try {
      const transactionIds = Array.from(selectedTransactions);
      const result = await deleteTransactions(transactionIds);

      if (result.success) {
        toast.success(
          `${result.deletedCount} transação(ões) excluída(s) com sucesso!`,
        );
        setSelectedTransactions(new Set()); // Limpar seleção
        refetch(); // Atualizar a lista
      } else {
        toast.error(result.error || "Erro ao excluir transações");
      }
    } catch (error) {
      toast.error("Erro inesperado ao excluir transações");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createTransaction(data);

      if (result.success) {
        toast.success("Transação criada com sucesso!");
        form.reset({
          title: "",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().slice(0, 5),
        });
        refetch(); // Atualizar a lista de transações
      } else {
        toast.error(result.error || "Erro ao criar transação");
      }
    } catch (error) {
      toast.error("Erro inesperado ao criar transação");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Ganhos">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="animate-gradient-x ml-1 bg-gradient-to-r from-pink-700/70 to-purple-800/70 py-4 text-white duration-300 hover:scale-[1.04]"
              size="sm"
              variant="default"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Adicionar Nova Transação de Ganho
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Preencha os dados abaixo para registrar uma nova receita.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  {/* Campo Título */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Freelance, Salário, Venda..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Valor */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0,00"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Digite o valor sem o sinal de R$
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Descrição */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Detalhes sobre a transação..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Data */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormDescription>
                          Data da transação (padrão: hoje)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Hora */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormDescription>
                          Hora da transação (padrão: agora)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel type="button" disabled={isSubmitting}>
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Salvar Transação"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <CardTitle>Histórico dos Ganhos</CardTitle>
              {selectedTransactions.size > 0 && (
                <span className="text-muted-foreground text-sm">
                  ({selectedTransactions.size} selecionada
                  {selectedTransactions.size !== 1 ? "s" : ""})
                </span>
              )}
            </div>
            <div>
              {selectedTransactions.size > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="mx-1 border bg-red-700 duration-100 hover:active:scale-95"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      {isDeleting
                        ? "Excluindo..."
                        : `Excluir (${selectedTransactions.size})`}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir{" "}
                        {selectedTransactions.size} transação(ões)
                        selecionada(s)? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSelected}
                        disabled={isDeleting}
                        className="border bg-white hover:bg-gray-200"
                      >
                        {isDeleting ? "Excluindo..." : "Sim, Excluir"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              <Button
                className="mx-1 duration-100 hover:active:scale-95"
                variant="outline"
                size="sm"
                onClick={handleSelectAllPage}
              >
                <SquareCheck className="mr-2 h-4 w-4" />
                Marcar Página
              </Button>
              <Button
                className="mx-1 duration-100 hover:active:scale-95"
                variant="outline"
                size="sm"
                onClick={handleSelectAll}
              >
                <CopyCheck className="mr-2 h-4 w-4" />
                Marcar Todos
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
              </div>
            ) : transactions.length > 0 ? (
              <Accordion
                className="rounded-lg border px-4"
                type="single"
                collapsible
              >
                {transactions.map((transaction, index) => (
                  <AccordionItem key={transaction.id} value={`item-${index}`}>
                    <AccordionTrigger>
                      <Checkbox
                        checked={selectedTransactions.has(transaction.id)}
                        onCheckedChange={() =>
                          handleSelectTransaction(transaction.id)
                        }
                      />
                      <div className="flex w-full justify-between">
                        <p>{transaction.title}</p>
                        <p className="font-semibold text-green-400">
                          R${" "}
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
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhuma transação de ganho encontrada.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Adicione sua primeira transação usando o botão &quot;Nova
                  Transação&quot; acima.
                </p>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                Visualize e gerencie todas as suas transações de ganhos em um só
                lugar.
              </p>
              <div className="flex items-center gap-2">
                {selectedTransactions.size > 0 && (
                  <Button
                    className="px-3 py-1 duration-100 hover:active:scale-95"
                    variant="outline"
                    size="sm"
                    onClick={handleClearSelection}
                  >
                    <CopyX className="h-4 w-4" />
                  </Button>
                )}
                <div className="rounded-md border bg-[#0A0A0A] px-2 py-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="border-none outline-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                      10
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Vizualizar</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>10</DropdownMenuItem>
                      <DropdownMenuItem>20</DropdownMenuItem>
                      <DropdownMenuItem>30</DropdownMenuItem>
                      <DropdownMenuItem>Todos</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aqui você pode adicionar mais componentes para a página de ganhos */}
      </div>
    </div>
  );
}
