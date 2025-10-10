import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getAuthenticatedUser() {
  try {
    const headersList = await headers();
    console.log(
      "Headers disponíveis:",
      Object.fromEntries(headersList.entries()),
    );

    const session = await auth.api.getSession({
      headers: headersList,
    });

    console.log("Sessão obtida:", session);

    if (!session?.user) {
      console.log("Nenhum usuário encontrado na sessão");
      return null;
    }

    console.log("Usuário autenticado:", session.user);
    return session.user;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return null;
  }
}
