"use server";

import { and, desc, eq, gt, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { transaction } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export interface CreateTransactionData {
  title: string;
  amount: string;
  description?: string;
  date?: string;
  time?: string;
}

export async function createTransaction(data: CreateTransactionData) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para ganhos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Combinar data e hora para criar timestamp
    const dateTime =
      data.date && data.time
        ? new Date(`${data.date}T${data.time}:00`)
        : new Date();

    // Inserir no banco de dados
    const [newTransaction] = await db
      .insert(transaction)
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
    revalidatePath("/ganhos");

    return {
      success: true,
      data: newTransaction,
    };
  } catch (error) {
    console.error("Erro ao criar transação:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getUserTransactions() {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar transações do usuário (apenas ganhos - valores positivos)
    const transactions = await db
      .select()
      .from(transaction)
      .where(
        // Filtrar pelo usuário e apenas transações positivas (ganhos)
        and(eq(transaction.userId, user.id), gt(transaction.amountInCents, 0)),
      )
      .orderBy(desc(transaction.createdAt));

    return {
      success: true,
      data: transactions,
    };
  } catch (error) {
    console.error("Erro ao buscar transações:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: [],
    };
  }
}

export async function deleteTransactions(transactionIds: string[]) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!transactionIds || transactionIds.length === 0) {
      throw new Error("Nenhuma transação selecionada para exclusão");
    }

    // Verificar se as transações pertencem ao usuário antes de deletar
    const transactionsToDelete = await db
      .select({ id: transaction.id })
      .from(transaction)
      .where(
        and(
          eq(transaction.userId, user.id),
          inArray(transaction.id, transactionIds),
        ),
      );

    if (transactionsToDelete.length !== transactionIds.length) {
      throw new Error(
        "Algumas transações não foram encontradas ou não pertencem ao usuário",
      );
    }

    // Deletar as transações
    await db
      .delete(transaction)
      .where(
        and(
          eq(transaction.userId, user.id),
          inArray(transaction.id, transactionIds),
        ),
      );

    // Revalidar a página para atualizar a lista
    revalidatePath("/ganhos");

    return {
      success: true,
      deletedCount: transactionIds.length,
    };
  } catch (error) {
    console.error("Erro ao deletar transações:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
