"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { essentialExpense, expense } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export interface CreateEssentialExpenseData {
  title: string;
  amount: string;
  description?: string;
}

export interface RegisterEssentialExpenseData {
  essentialExpenseId: string;
}

export async function createEssentialExpense(data: CreateEssentialExpenseData) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para gastos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Inserir no banco de dados
    const [newEssentialExpense] = await db
      .insert(essentialExpense)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description || null,
        amountInCents: amountInCents,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Revalidar a página para atualizar a lista
    revalidatePath("/gastos");

    return {
      success: true,
      data: newEssentialExpense,
    };
  } catch (error) {
    console.error("Erro ao criar gasto essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getUserEssentialExpenses() {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar gastos essenciais do usuário
    const essentialExpenses = await db
      .select()
      .from(essentialExpense)
      .where(eq(essentialExpense.userId, user.id))
      .orderBy(desc(essentialExpense.createdAt));

    return {
      success: true,
      data: essentialExpenses,
    };
  } catch (error) {
    console.error("Erro ao buscar gastos essenciais:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: [],
    };
  }
}

export async function registerEssentialExpense(essentialExpenseId: string) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar o gasto essencial
    const [essentialExpenseData] = await db
      .select()
      .from(essentialExpense)
      .where(
        and(
          eq(essentialExpense.id, essentialExpenseId),
          eq(essentialExpense.userId, user.id),
        ),
      );

    if (!essentialExpenseData) {
      throw new Error("Gasto essencial não encontrado");
    }

    // Criar um novo gasto baseado no gasto essencial
    const [newExpense] = await db
      .insert(expense)
      .values({
        userId: user.id,
        title: essentialExpenseData.title,
        description: essentialExpenseData.description,
        amountInCents: essentialExpenseData.amountInCents,
        createdAt: new Date(),
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
    console.error("Erro ao registrar gasto essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function updateEssentialExpense(
  essentialExpenseId: string,
  data: CreateEssentialExpenseData,
) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para gastos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Atualizar o gasto essencial
    const [updatedEssentialExpense] = await db
      .update(essentialExpense)
      .set({
        title: data.title,
        description: data.description || null,
        amountInCents: amountInCents,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(essentialExpense.id, essentialExpenseId),
          eq(essentialExpense.userId, user.id),
        ),
      )
      .returning();

    if (!updatedEssentialExpense) {
      throw new Error("Gasto essencial não encontrado");
    }

    // Revalidar a página para atualizar a lista
    revalidatePath("/gastos");

    return {
      success: true,
      data: updatedEssentialExpense,
    };
  } catch (error) {
    console.error("Erro ao atualizar gasto essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function deleteEssentialExpenses(essentialExpenseIds: string[]) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!essentialExpenseIds || essentialExpenseIds.length === 0) {
      throw new Error("Nenhum gasto essencial selecionado para exclusão");
    }

    // Verificar se os gastos essenciais pertencem ao usuário antes de deletar
    const essentialExpensesToDelete = await db
      .select({ id: essentialExpense.id })
      .from(essentialExpense)
      .where(
        and(
          eq(essentialExpense.userId, user.id),
          inArray(essentialExpense.id, essentialExpenseIds),
        ),
      );

    if (essentialExpensesToDelete.length !== essentialExpenseIds.length) {
      throw new Error(
        "Alguns gastos essenciais não foram encontrados ou não pertencem ao usuário",
      );
    }

    // Deletar os gastos essenciais
    await db
      .delete(essentialExpense)
      .where(
        and(
          eq(essentialExpense.userId, user.id),
          inArray(essentialExpense.id, essentialExpenseIds),
        ),
      );

    // Revalidar a página para atualizar a lista
    revalidatePath("/gastos");

    return {
      success: true,
      deletedCount: essentialExpenseIds.length,
    };
  } catch (error) {
    console.error("Erro ao deletar gastos essenciais:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
