"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { expense } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export interface CreateExpenseData {
  title: string;
  amount: string;
  description?: string;
  date?: string;
  time?: string;
}

export async function createExpense(data: CreateExpenseData) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para gastos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Combinar data e hora para criar timestamp
    const dateTime =
      data.date && data.time
        ? new Date(`${data.date}T${data.time}:00`)
        : new Date();

    // Inserir no banco de dados
    const [newExpense] = await db
      .insert(expense)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description || null,
        amountInCents: amountInCents,
        createdAt: dateTime,
        updatedAt: new Date(),
      })
      .returning();

    // Revalidar a página para atualizar a lista
    revalidatePath("/gastos");

    return {
      success: true,
      data: newExpense,
    };
  } catch (error) {
    console.error("Erro ao criar gasto:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getUserExpenses() {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar gastos do usuário
    const expenses = await db
      .select()
      .from(expense)
      .where(eq(expense.userId, user.id))
      .orderBy(desc(expense.createdAt));

    return {
      success: true,
      data: expenses,
    };
  } catch (error) {
    console.error("Erro ao buscar gastos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: [],
    };
  }
}

export async function deleteExpenses(expenseIds: string[]) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!expenseIds || expenseIds.length === 0) {
      throw new Error("Nenhum gasto selecionado para exclusão");
    }

    // Verificar se os gastos pertencem ao usuário antes de deletar
    const expensesToDelete = await db
      .select({ id: expense.id })
      .from(expense)
      .where(and(eq(expense.userId, user.id), inArray(expense.id, expenseIds)));

    if (expensesToDelete.length !== expenseIds.length) {
      throw new Error(
        "Alguns gastos não foram encontrados ou não pertencem ao usuário",
      );
    }

    // Deletar os gastos
    await db
      .delete(expense)
      .where(and(eq(expense.userId, user.id), inArray(expense.id, expenseIds)));

    // Revalidar a página para atualizar a lista
    revalidatePath("/gastos");

    return {
      success: true,
      deletedCount: expenseIds.length,
    };
  } catch (error) {
    console.error("Erro ao deletar gastos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
