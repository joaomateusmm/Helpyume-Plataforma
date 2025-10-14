"use client";

import { LogIn, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/use-current-user";
import { authClient } from "@/lib/auth-client";

export function UserFooter() {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/authentication");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleLogin = () => {
    router.push("/authentication");
  };

  if (isLoading) {
    return (
      <div className="bg-sidebar-accent border-sidebar-border flex flex-row items-center gap-3 rounded-lg border p-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex flex-col gap-1 overflow-hidden">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="bg-sidebar-accent hover:bg-sidebar-accent/80 border-sidebar-border flex cursor-pointer flex-row items-center gap-3 rounded-lg border p-2 duration-200">
            <div className="bg-sidebar-primary/10 border-sidebar-primary/20 flex h-10 w-10 animate-pulse items-center justify-center rounded-lg border text-sm font-semibold"></div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sidebar-foreground truncate text-sm font-medium">
                Entre ou Crie sua Conta
              </span>
              <span className="text-sidebar-foreground/70 truncate text-xs">
                Clique para fazer login
              </span>
            </div>
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={handleLogin}>
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="bg-sidebar-accent hover:bg-sidebar-accent flex cursor-pointer flex-row items-center gap-3 rounded-lg p-2 duration-200">
          {/* Avatar com iniciais */}
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-300 text-sm font-semibold text-black shadow-sm">
            {getInitials(user.name)}
          </div>

          {/* Informações do usuário */}
          <div className="flex flex-col overflow-hidden">
            <span className="text-sidebar-foreground truncate text-sm font-medium">
              {user.name}
            </span>
            <span className="text-sidebar-foreground/70 truncate text-xs">
              {user.email}
            </span>
          </div>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
