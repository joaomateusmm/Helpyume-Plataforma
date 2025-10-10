import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="p-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-3" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-6 border-b pb-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" /> {/* Título da página */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" /> {/* Botão 1 */}
            <Skeleton className="h-8 w-24" /> {/* Botão 2 */}
            <Skeleton className="h-8 w-28" /> {/* Botão principal */}
          </div>
        </div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2 rounded-lg border p-4">
            <Skeleton className="h-4 w-24" /> {/* Título do card */}
            <Skeleton className="h-8 w-32" /> {/* Valor principal */}
            <Skeleton className="h-3 w-40" /> {/* Descrição */}
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="space-y-6">
        {/* Card principal */}
        <div className="rounded-lg border">
          <div className="border-b p-6">
            <Skeleton className="h-6 w-48" /> {/* Título do card */}
          </div>
          <div className="space-y-4 p-6">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />

            {/* Skeleton para tabela ou lista */}
            <div className="space-y-3 pt-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cards menores */}
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="rounded-lg border">
              <div className="border-b p-4">
                <Skeleton className="h-5 w-36" />
              </div>
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-7 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
