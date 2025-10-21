import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL será automaticamente detectado pelo better-auth usando window.location.origin
  // Removemos a configuração manual para deixar o better-auth detectar automaticamente
});

export const { useSession, signIn, signOut, signUp } = authClient;
