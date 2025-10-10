import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getAuthenticatedUser() {
  try {
    const headersList = await headers();

    const session = await auth.api.getSession({
      headers: headersList,
    });

    if (!session?.user) {
      return null;
    }

    return session.user;
  } catch (error) {
    console.error("Erro ao verificar autenticação:", error);
    return null;
  }
}
