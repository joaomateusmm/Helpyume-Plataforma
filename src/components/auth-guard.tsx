"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useCurrentUser } from "@/hooks/use-current-user";

import { AppSkeleton } from "./app-skeleton";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/authentication");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return <AppSkeleton />;
  }

  if (!user) {
    return null; // Redirect acontecerá via useEffect
  }

  return <>{children}</>;
}
