"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { essentialIncome, transaction } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export interface CreateEssentialIncomeData {
  title: string;
  amount: string;
  description?: string;
}

export interface RegisterEssentialIncomeData {
  essentialIncomeId: string;
}

export async function createEssentialIncome(data: CreateEssentialIncomeData) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para ganhos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Inserir no banco de dados
    const [newEssentialIncome] = await db
      .insert(essentialIncome)
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
    revalidatePath("/ganhos");

    return {
      success: true,
      data: newEssentialIncome,
    };
  } catch (error) {
    console.error("Erro ao criar ganho essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getUserEssentialIncomes() {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar ganhos essenciais do usuário
    const essentialIncomes = await db
      .select()
      .from(essentialIncome)
      .where(eq(essentialIncome.userId, user.id))
      .orderBy(desc(essentialIncome.createdAt));

    return {
      success: true,
      data: essentialIncomes,
    };
  } catch (error) {
    console.error("Erro ao buscar ganhos essenciais:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: [],
    };
  }
}

export async function registerEssentialIncome(essentialIncomeId: string) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar o ganho essencial
    const [essentialIncomeData] = await db
      .select()
      .from(essentialIncome)
      .where(
        and(
          eq(essentialIncome.id, essentialIncomeId),
          eq(essentialIncome.userId, user.id),
        ),
      );

    if (!essentialIncomeData) {
      throw new Error("Ganho essencial não encontrado");
    }

    // Criar uma nova transação baseada no ganho essencial
    const [newTransaction] = await db
      .insert(transaction)
      .values({
        userId: user.id,
        title: essentialIncomeData.title,
        description: essentialIncomeData.description,
        amountInCents: essentialIncomeData.amountInCents,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Revalidar a página para atualizar a lista
    revalidatePath("/ganhos");

    return {
      success: true,
      data: newTransaction,
    };
  } catch (error) {
    console.error("Erro ao registrar ganho essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function updateEssentialIncome(
  essentialIncomeId: string,
  data: CreateEssentialIncomeData,
) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para ganhos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Atualizar o ganho essencial
    const [updatedEssentialIncome] = await db
      .update(essentialIncome)
      .set({
        title: data.title,
        description: data.description || null,
        amountInCents: amountInCents,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(essentialIncome.id, essentialIncomeId),
          eq(essentialIncome.userId, user.id),
        ),
      )
      .returning();

    if (!updatedEssentialIncome) {
      throw new Error("Ganho essencial não encontrado");
    }

    // Revalidar a página para atualizar a lista
    revalidatePath("/ganhos");

    return {
      success: true,
      data: updatedEssentialIncome,
    };
  } catch (error) {
    console.error("Erro ao atualizar ganho essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function deleteEssentialIncomes(essentialIncomeIds: string[]) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!essentialIncomeIds || essentialIncomeIds.length === 0) {
      throw new Error("Nenhum ganho essencial selecionado para exclusão");
    }

    // Verificar se os ganhos essenciais pertencem ao usuário antes de deletar
    const essentialIncomesToDelete = await db
      .select({ id: essentialIncome.id })
      .from(essentialIncome)
      .where(
        and(
          eq(essentialIncome.userId, user.id),
          inArray(essentialIncome.id, essentialIncomeIds),
        ),
      );

    if (essentialIncomesToDelete.length !== essentialIncomeIds.length) {
      throw new Error(
        "Alguns ganhos essenciais não foram encontrados ou não pertencem ao usuário",
      );
    }

    // Deletar os ganhos essenciais
    await db
      .delete(essentialIncome)
      .where(
        and(
          eq(essentialIncome.userId, user.id),
          inArray(essentialIncome.id, essentialIncomeIds),
        ),
      );

    // Revalidar a página para atualizar a lista
    revalidatePath("/ganhos");

    return {
      success: true,
      deletedCount: essentialIncomeIds.length,
    };
  } catch (error) {
    console.error("Erro ao deletar ganhos essenciais:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
