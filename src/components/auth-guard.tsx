"use client";

import { useCurrentUser } from "@/hooks/use-current-user";

import { AppSkeleton } from "./app-skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return <AppSkeleton />;
  }

  // Sempre renderiza os children, independente do usuário estar logado ou não
  return <>{children}</>;
}
