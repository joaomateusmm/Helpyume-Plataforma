"use client";

import { useSession } from "@/lib/auth-client";

export function useCurrentUser() {
  const { data: session, isPending } = useSession();

  return {
    user: session?.user || null,
    isLoading: isPending,
  };
}
