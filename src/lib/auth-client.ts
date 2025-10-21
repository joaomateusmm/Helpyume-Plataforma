import { createAuthClient } from "better-auth/react";

// Detecta automaticamente a URL baseada no ambiente
const getBaseURL = () => {
  // No navegador, usa a URL atual (window.location.origin)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  // No servidor (SSR), usa a variável de ambiente ou localhost
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});

export const { useSession, signIn, signOut, signUp } = authClient;
