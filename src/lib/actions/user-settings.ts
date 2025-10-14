"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { user } from "@/db/schema";
import { getAuthenticatedUser } from "@/lib/auth-helpers";

export async function updateUserName(newName: string) {
  try {
    // Verificar autenticação
    const currentUser = await getAuthenticatedUser();

    if (!currentUser) {
      return {
        success: false,
        error: "Usuário não autenticado",
      };
    }

    // Validar o nome
    if (!newName.trim()) {
      return {
        success: false,
        error: "Nome não pode estar vazio",
      };
    }

    if (newName.trim().length < 2) {
      return {
        success: false,
        error: "Nome deve ter pelo menos 2 caracteres",
      };
    }

    if (newName.trim().length > 100) {
      return {
        success: false,
        error: "Nome muito longo (máximo 100 caracteres)",
      };
    }

    // Atualizar o nome no banco de dados
    await db
      .update(user)
      .set({
        name: newName.trim(),
        updatedAt: new Date(),
      })
      .where(eq(user.id, currentUser.id));

    return {
      success: true,
      message: "Nome atualizado com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao atualizar nome do usuário:", error);
    return {
      success: false,
      error: "Erro interno do servidor",
    };
  }
}
