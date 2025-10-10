"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";

export function UserFooter() {
  const { user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="bg-card flex flex-row items-center gap-3 rounded-lg p-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex flex-col gap-1 overflow-hidden">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-3 p-3">
        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold">
          ?
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-medium">
            Usuário não logado
          </span>
          <span className="text-muted-foreground truncate text-xs">
            Faça login para continuar
          </span>
        </div>
      </div>
    );
  }

  // Função para gerar as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <div className="bg-card flex flex-row items-center gap-3 rounded-lg p-2 hover:bg-accent duration-200">
      {/* Avatar com iniciais */}
      <div className="bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold">
        {getInitials(user.name)}
      </div>

      {/* Informações do usuário */}
      <div className="flex flex-col overflow-hidden">
        <span className="truncate text-sm font-medium">{user.name}</span>
        <span className="text-muted-foreground truncate text-xs">
          {user.email}
        </span>
      </div>
    </div>
  );
}
