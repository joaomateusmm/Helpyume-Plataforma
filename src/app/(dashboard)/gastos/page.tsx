"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CopyCheck,
  CopyX,
  Pencil,
  Plus,
  SquareCheck,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { useEssentialExpenses } from "@/hooks/use-essential-expenses";
import { useExpenses } from "@/hooks/use-expenses";
import {
  createEssentialExpense,
  deleteEssentialExpenses,
  registerEssentialExpense,
  updateEssentialExpense,
} from "@/lib/actions/essential-expenses";
import { createExpense, deleteExpenses } from "@/lib/actions/expenses";

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

export default function GastosPage() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmittingEssential, setIsSubmittingEssential] = useState(false);
  const [isRegistering, setIsRegistering] = useState<Record<string, boolean>>(
    {},
  );
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<{
    title: string;
    amount: string;
    description: string;
  } | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedExpenses, setSelectedExpenses] = useState<Set<string>>(
    new Set(),
  );
  const { expenses, isLoading, refetch } = useExpenses();
  const {
    essentialExpenses,
    isLoading: isLoadingEssential,
    refetch: refetchEssential,
  } = useEssentialExpenses();

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

  // Formulário para gastos essenciais (sem data e hora)
  const essentialForm = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: "",
      description: "",
    },
  });

  // Funções para controlar checkboxes
  const handleSelectExpense = (expenseId: string) => {
    setSelectedExpenses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(expenseId)) {
        newSet.delete(expenseId);
      } else {
        newSet.add(expenseId);
      }
      return newSet;
    });
  };

  const handleSelectAllPage = () => {
    const currentPageExpenses = displayedExpenses.map((e) => e.id);
    setSelectedExpenses(new Set(currentPageExpenses));
    toast.success(`${currentPageExpenses.length} gastos selecionados`);
  };

  const handleSelectAll = () => {
    const allExpenseIds = expenses.map((e) => e.id);
    setSelectedExpenses(new Set(allExpenseIds));
    toast.success(`Todos os ${allExpenseIds.length} gastos selecionados`);
  };

  const handleClearSelection = () => {
    setSelectedExpenses(new Set());
    toast.info("Seleção limpa");
  };

  const handleItemsPerPageChange = (value: string) => {
    if (value === "Todos") {
      setItemsPerPage(expenses.length);
    } else {
      setItemsPerPage(parseInt(value));
    }
    // Limpar seleções ao mudar a visualização
    setSelectedExpenses(new Set());
  };

  // Filtrar gastos baseado na quantidade selecionada
  const displayedExpenses =
    itemsPerPage === expenses.length
      ? expenses
      : expenses.slice(0, itemsPerPage);

  const handleDeleteSelected = async () => {
    if (selectedExpenses.size === 0) {
      toast.error("Nenhum gasto selecionado");
      return;
    }

    setIsDeleting(true);
    try {
      const expenseIds = Array.from(selectedExpenses);
      const result = await deleteExpenses(expenseIds);

      if (result.success) {
        toast.success(
          `${result.deletedCount} gasto(s) excluído(s) com sucesso!`,
        );
        setSelectedExpenses(new Set()); // Limpar seleção
        refetch(); // Atualizar a lista
      } else {
        toast.error(result.error || "Erro ao excluir gastos");
      }
    } catch (error) {
      toast.error("Erro inesperado ao excluir gastos");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);

    try {
      const result = await createExpense(data);

      if (result.success) {
        toast.success("Gasto criado com sucesso!");
        form.reset({
          title: "",
          amount: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().slice(0, 5),
        });
        refetch(); // Atualizar a lista de gastos
      } else {
        toast.error(result.error || "Erro ao criar gasto");
      }
    } catch (error) {
      toast.error("Erro inesperado ao criar gasto");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEssential = async (data: TransactionFormData) => {
    setIsSubmittingEssential(true);

    try {
      const result = await createEssentialExpense(data);

      if (result.success) {
        toast.success("Gasto essencial criado com sucesso!");
        essentialForm.reset({
          title: "",
          amount: "",
          description: "",
        });
        refetchEssential(); // Atualizar a lista de gastos essenciais
      } else {
        toast.error(result.error || "Erro ao criar gasto essencial");
      }
    } catch (error) {
      toast.error("Erro inesperado ao criar gasto essencial");
      console.error(error);
    } finally {
      setIsSubmittingEssential(false);
    }
  };

  const handleRegisterEssential = async (essentialExpenseId: string) => {
    setIsRegistering((prev) => ({ ...prev, [essentialExpenseId]: true }));

    try {
      const result = await registerEssentialExpense(essentialExpenseId);

      if (result.success) {
        toast.success("Gasto registrado com sucesso!");
        refetch(); // Atualizar a lista de gastos
      } else {
        toast.error(result.error || "Erro ao registrar gasto");
      }
    } catch (error) {
      toast.error("Erro inesperado ao registrar gasto");
      console.error(error);
    } finally {
      setIsRegistering((prev) => ({ ...prev, [essentialExpenseId]: false }));
    }
  };

  const handleEditEssential = (essential: {
    id: string;
    title: string;
    amountInCents: number;
    description?: string | null;
  }) => {
    setIsEditing(essential.id);
    setEditingData({
      title: essential.title,
      amount: (essential.amountInCents / 100).toFixed(2),
      description: essential.description || "",
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditingData(null);
  };

  const handleSaveEdit = async () => {
    if (!isEditing || !editingData) return;

    try {
      const result = await updateEssentialExpense(isEditing, editingData);

      if (result.success) {
        toast.success("Gasto essencial atualizado com sucesso!");
        setIsEditing(null);
        setEditingData(null);
        refetchEssential();
      } else {
        toast.error(result.error || "Erro ao atualizar gasto essencial");
      }
    } catch (error) {
      toast.error("Erro inesperado ao atualizar gasto essencial");
      console.error(error);
    }
  };

  const handleDeleteEssential = async (essentialExpenseId: string) => {
    try {
      const result = await deleteEssentialExpenses([essentialExpenseId]);

      if (result.success) {
        toast.success("Gasto essencial excluído com sucesso!");
        refetchEssential();
      } else {
        toast.error(result.error || "Erro ao excluir gasto essencial");
      }
    } catch (error) {
      toast.error("Erro inesperado ao excluir gasto essencial");
      console.error(error);
    }
  };

  // Função para verificar autenticação antes de abrir formulário
  const checkAuthAndOpenForm = () => {
    if (!user) {
      toast.error("Você precisa estar logado para criar gastos");
      router.push("/authentication");
      return false;
    }
    return true;
  };

  return (
    <div className="p-6">
      <PageHeader title="Gastos" />

      <div className="mb-6 flex flex-row flex-wrap justify-start gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="w-auto border duration-300 hover:scale-[1.04]"
              size="sm"
              variant="ghost"
              onClick={() => {
                if (!checkAuthAndOpenForm()) return;
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="xs:inline hidden">Criar Gasto Essencial</span>
              <span className="xs:hidden">Gasto Essencial</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <Form {...essentialForm}>
              <form
                onSubmit={essentialForm.handleSubmit(onSubmitEssential)}
                className="space-y-6"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Criar Gasto Essencial</AlertDialogTitle>
                  <AlertDialogDescription>
                    Crie um template de gasto para adicionar rapidamente ao seu
                    histórico.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="space-y-4">
                  {/* Campo Título */}
                  <FormField
                    control={essentialForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Conta de Luz, Aluguel, Internet..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Campo Valor */}
                  <FormField
                    control={essentialForm.control}
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
                    control={essentialForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descrição (opcional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Detalhes sobre o gasto essencial..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    type="button"
                    disabled={isSubmittingEssential}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    type="submit"
                    disabled={isSubmittingEssential}
                  >
                    {isSubmittingEssential
                      ? "Salvando..."
                      : "Criar Gasto Essencial"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="animate-gradient-x w-auto bg-gradient-to-r from-red-600/70 to-red-900/70 py-4 text-white duration-300 hover:scale-[1.04]"
              size="sm"
              variant="default"
              onClick={() => {
                if (!checkAuthAndOpenForm()) return;
              }}
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="xs:inline hidden">Novo Gasto</span>
              <span className="xs:hidden"> Novo Gasto</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-md">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle>Adicionar Novo Gasto</AlertDialogTitle>
                  <AlertDialogDescription>
                    Preencha os dados abaixo para registrar um novo gasto, os
                    valores sempre serão negativos.
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
                            placeholder="Ex: Supermercado, Conta de Luz, Transporte..."
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
                          Data do gasto (padrão: hoje)
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
                          Hora do gasto (padrão: agora)
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
                    {isSubmitting ? "Salvando..." : "Salvar Gasto"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-6">
        <Card>
          {expenses.length > 0 ? (
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <CardTitle>
                  Histórico dos Gastos{" "}
                  <a className="text-muted-foreground text-sm">
                    ({expenses.length})
                  </a>
                </CardTitle>
                {selectedExpenses.size > 0 && (
                  <span className="text-muted-foreground text-sm">
                    ({selectedExpenses.size} selecionado
                    {selectedExpenses.size !== 1 ? "s" : ""})
                  </span>
                )}
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                {selectedExpenses.size > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="border bg-red-700 duration-100 hover:active:scale-95"
                        variant="destructive"
                        size="sm"
                        disabled={isDeleting}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        <span className="xs:inline hidden">
                          {isDeleting
                            ? "Excluindo..."
                            : `Excluir (${selectedExpenses.size})`}
                        </span>
                        <span className="xs:hidden">
                          {isDeleting ? "..." : "Excluir"}
                        </span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir {selectedExpenses.size}{" "}
                          gasto(s) selecionado(s)? Esta ação não pode ser
                          desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="shadow-md"
                          disabled={isDeleting}
                        >
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteSelected}
                          disabled={isDeleting}
                          className="bg-destructive hover:bg-destructive/90 text-white shadow-md"
                        >
                          {isDeleting ? "Excluindo..." : "Sim, Excluir"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  className="duration-100 hover:active:scale-95"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAllPage}
                >
                  <SquareCheck className="mr-2 h-4 w-4" />
                  <span className="xs:inline hidden">Marcar Página</span>
                  <span className="xs:hidden">Página</span>
                </Button>
                <Button
                  className="duration-100 hover:active:scale-95"
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                >
                  <CopyCheck className="mr-2 h-4 w-4" />
                  <span className="xs:inline hidden">Marcar Todos</span>
                  <span className="xs:hidden">Todos</span>
                </Button>
              </div>
            </CardHeader>
          ) : (
            <CardHeader>
              <CardTitle>Histórico dos Gastos</CardTitle>
            </CardHeader>
          )}

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
                <div className="bg-muted h-12 animate-pulse rounded-lg" />
              </div>
            ) : expenses.length > 0 ? (
              <Accordion
                className="rounded-lg border px-4"
                type="single"
                collapsible
              >
                {displayedExpenses.map((expense, index) => (
                  <AccordionItem key={expense.id} value={`item-${index}`}>
                    <AccordionTrigger>
                      <Checkbox
                        checked={selectedExpenses.has(expense.id)}
                        onCheckedChange={() => handleSelectExpense(expense.id)}
                      />
                      <div className="flex w-full justify-between">
                        <p>{expense.title}</p>
                        <p className="font-semibold text-red-700 dark:text-red-400">
                          R$ -
                          {(expense.amountInCents / 100)
                            .toFixed(2)
                            .replace(".", ",")}
                        </p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex w-full justify-between">
                        <p className="text-muted-foreground">
                          {expense.description || "Sem descrição"}
                        </p>
                        <p className="text-muted-foreground mr-8">
                          {new Date(expense.createdAt).toLocaleDateString(
                            "pt-BR",
                          )}{" "}
                          -{" "}
                          {new Date(expense.createdAt).toLocaleTimeString(
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
              <div className="text-center">
                <div className="my-6 flex justify-center">
                  <Image
                    src="/assets/illustration.svg"
                    alt="Ilustração boneco de estado vazio"
                    width={300}
                    height={300}
                    className="opacity-50"
                  />
                </div>
                <p className="text-muted-foreground">
                  Nenhum gasto encontrado.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Adicione seu primeiro gasto usando o botão &quot;Novo
                  Gasto&quot; acima.
                </p>
              </div>
            )}
            {expenses.length > 0 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  <p>
                    Visualize e gerencie todos os seus gastos em um só lugar.
                  </p>
                  <p className="mt-1">
                    Exibindo {displayedExpenses.length} de {expenses.length}{" "}
                    gastos
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedExpenses.size > 0 && (
                    <Button
                      className="px-3 py-1 duration-100 hover:active:scale-95"
                      variant="outline"
                      size="sm"
                      onClick={handleClearSelection}
                    >
                      <CopyX className="h-4 w-4" />
                    </Button>
                  )}
                  <div className="bg-background rounded-md border px-2 py-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="border-none outline-none focus:border-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0">
                        {itemsPerPage === expenses.length
                          ? "Todos"
                          : itemsPerPage}
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Vizualizar</DropdownMenuLabel>
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
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seus Gastos Essenciais</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingEssential ? (
              <div className="flex gap-4">
                <div className="bg-muted h-24 w-[160px] animate-pulse rounded-lg" />
                <div className="bg-muted h-24 w-[160px] animate-pulse rounded-lg" />
              </div>
            ) : essentialExpenses.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {essentialExpenses.map((essential) => (
                  <div
                    key={essential.id}
                    className="group relative flex h-auto w-[180px] flex-col items-center justify-between gap-3 rounded-lg border p-3 transition-all hover:shadow-md"
                  >
                    {/* Botões de ação no canto superior direito */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        onClick={() => handleEditEssential(essential)}
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-100/10"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-gray-100/10"
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmar Exclusão
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o gasto essencial
                              &quot;{essential.title}&quot;? Esta ação não pode
                              ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteEssential(essential.id)
                              }
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    {/* Conteúdo do card */}
                    <div className="flex flex-col items-center">
                      <p className="text-center font-medium">
                        {essential.title}
                      </p>
                      <p className="text-muted-foreground text-center text-xs">
                        {essential.description || "Gasto essencial"}
                      </p>
                      <p className="font-semibold text-red-700 dark:text-red-400">
                        R${" "}
                        {(essential.amountInCents / 100)
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>

                    {/* Botão de registrar */}
                    <Button
                      onClick={() => handleRegisterEssential(essential.id)}
                      disabled={isRegistering[essential.id]}
                      size="sm"
                      className="w-28"
                    >
                      {isRegistering[essential.id] ? (
                        "Registrando..."
                      ) : (
                        <>
                          <Plus className="mr-1 h-3 w-3" /> Registrar
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nenhum gasto essencial criado ainda.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Crie seu primeiro gasto essencial usando o botão acima.
                </p>
              </div>
            )}
          </CardContent>
          {essentialExpenses.length > 0 && (
            <p className="text-muted-foreground ml-6 pb-2 text-xs">
              Crie seus gastos fixos do mês e adicione-os com apenas 1 clique.
            </p>
          )}
        </Card>
      </div>

      {/* Modal de Edição */}
      <AlertDialog open={!!isEditing} onOpenChange={handleCancelEdit}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Gasto Essencial</AlertDialogTitle>
            <AlertDialogDescription>
              Atualize as informações do seu gasto essencial.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {editingData && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título *</label>
                <Input
                  value={editingData.title}
                  onChange={(e) =>
                    setEditingData({ ...editingData, title: e.target.value })
                  }
                  placeholder="Ex: Conta de Luz, Aluguel, Internet..."
                />
              </div>

              <div>
                <label className="text-sm font-medium">Valor (R$) *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingData.amount}
                  onChange={(e) =>
                    setEditingData({ ...editingData, amount: e.target.value })
                  }
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={editingData.description}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Detalhes sobre o gasto essencial..."
                />
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelEdit}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveEdit}>
              Salvar Alterações
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
