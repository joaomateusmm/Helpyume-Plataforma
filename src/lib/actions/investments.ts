"use server";

import { and, desc, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { essentialInvestment, investment } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export interface CreateInvestmentData {
  title: string;
  amount: string;
  description?: string;
  date?: string;
  time?: string;
}

export async function createInvestment(data: CreateInvestmentData) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Converter valor para centavos (sempre positivo para investimentos)
    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    // Combinar data e hora para criar timestamp
    const dateTime =
      data.date && data.time
        ? new Date(`${data.date}T${data.time}:00`)
        : new Date();

    // Inserir no banco de dados
    const [newInvestment] = await db
      .insert(investment)
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
    revalidatePath("/investimentos");

    return {
      success: true,
      data: newInvestment,
    };
  } catch (error) {
    console.error("Erro ao criar investimento:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getUserInvestments() {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Buscar investimentos do usuário
    const investments = await db
      .select()
      .from(investment)
      .where(eq(investment.userId, user.id))
      .orderBy(desc(investment.createdAt));

    return {
      success: true,
      data: investments,
    };
  } catch (error) {
    console.error("Erro ao buscar investimentos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: [],
    };
  }
}

export async function deleteInvestments(investmentIds: string[]) {
  try {
    // Verificar autenticação
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!investmentIds || investmentIds.length === 0) {
      throw new Error("Nenhum investimento selecionado para exclusão");
    }

    // Verificar se os investimentos pertencem ao usuário antes de deletar
    const investmentsToDelete = await db
      .select({ id: investment.id })
      .from(investment)
      .where(
        and(
          eq(investment.userId, user.id),
          inArray(investment.id, investmentIds),
        ),
      );

    if (investmentsToDelete.length !== investmentIds.length) {
      throw new Error(
        "Alguns investimentos não foram encontrados ou não pertencem ao usuário",
      );
    }

    // Deletar os investimentos
    await db
      .delete(investment)
      .where(
        and(
          eq(investment.userId, user.id),
          inArray(investment.id, investmentIds),
        ),
      );

    // Revalidar a página para atualizar a lista
    revalidatePath("/investimentos");

    return {
      success: true,
      deletedCount: investmentIds.length,
    };
  } catch (error) {
    console.error("Erro ao deletar investimentos:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// ===== INVESTIMENTOS ESSENCIAIS =====

export interface CreateEssentialInvestmentData {
  title: string;
  amount: string;
  description?: string;
}

export async function createEssentialInvestment(
  data: CreateEssentialInvestmentData,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    const [newEssentialInvestment] = await db
      .insert(essentialInvestment)
      .values({
        userId: user.id,
        title: data.title,
        description: data.description || null,
        amountInCents: amountInCents,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/investimentos");

    return {
      success: true,
      data: newEssentialInvestment,
    };
  } catch (error) {
    console.error("Erro ao criar investimento essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getEssentialInvestments() {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const essentialInvestments = await db
      .select()
      .from(essentialInvestment)
      .where(eq(essentialInvestment.userId, user.id))
      .orderBy(desc(essentialInvestment.createdAt));

    return {
      success: true,
      data: essentialInvestments,
    };
  } catch (error) {
    console.error("Erro ao buscar investimentos essenciais:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
      data: [],
    };
  }
}

export async function registerEssentialInvestment(
  essentialInvestmentId: string,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const [essentialInv] = await db
      .select()
      .from(essentialInvestment)
      .where(
        and(
          eq(essentialInvestment.id, essentialInvestmentId),
          eq(essentialInvestment.userId, user.id),
        ),
      );

    if (!essentialInv) {
      throw new Error("Investimento essencial não encontrado");
    }

    const [newInvestment] = await db
      .insert(investment)
      .values({
        userId: user.id,
        title: essentialInv.title,
        description: essentialInv.description,
        amountInCents: essentialInv.amountInCents,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    revalidatePath("/investimentos");

    return {
      success: true,
      data: newInvestment,
    };
  } catch (error) {
    console.error("Erro ao registrar investimento essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function updateEssentialInvestment(
  id: string,
  data: CreateEssentialInvestmentData,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const amountInCents = Math.abs(Math.round(parseFloat(data.amount) * 100));

    const [updatedEssentialInvestment] = await db
      .update(essentialInvestment)
      .set({
        title: data.title,
        description: data.description || null,
        amountInCents: amountInCents,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(essentialInvestment.id, id),
          eq(essentialInvestment.userId, user.id),
        ),
      )
      .returning();

    if (!updatedEssentialInvestment) {
      throw new Error("Investimento essencial não encontrado");
    }

    revalidatePath("/investimentos");

    return {
      success: true,
      data: updatedEssentialInvestment,
    };
  } catch (error) {
    console.error("Erro ao atualizar investimento essencial:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function deleteEssentialInvestments(
  essentialInvestmentIds: string[],
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    if (!essentialInvestmentIds || essentialInvestmentIds.length === 0) {
      throw new Error(
        "Nenhum investimento essencial selecionado para exclusão",
      );
    }

    const investmentsToDelete = await db
      .select({ id: essentialInvestment.id })
      .from(essentialInvestment)
      .where(
        and(
          eq(essentialInvestment.userId, user.id),
          inArray(essentialInvestment.id, essentialInvestmentIds),
        ),
      );

    if (investmentsToDelete.length !== essentialInvestmentIds.length) {
      throw new Error(
        "Alguns investimentos essenciais não foram encontrados ou não pertencem ao usuário",
      );
    }

    await db
      .delete(essentialInvestment)
      .where(
        and(
          eq(essentialInvestment.userId, user.id),
          inArray(essentialInvestment.id, essentialInvestmentIds),
        ),
      );

    revalidatePath("/investimentos");

    return {
      success: true,
      deletedCount: essentialInvestmentIds.length,
    };
  } catch (error) {
    console.error("Erro ao deletar investimentos essenciais:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
