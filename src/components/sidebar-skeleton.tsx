import { Skeleton } from "@/components/ui/skeleton";

export function SidebarSkeleton() {
  return (
    <div className="bg-background flex h-full w-64 flex-col border-r">
      {/* Sidebar Content */}
      <div className="flex-1 space-y-6 p-4">
        {/* Primeiro grupo */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" /> {/* Label do grupo */}
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <Skeleton className="h-4 w-4" /> {/* Ícone */}
                <Skeleton className="h-4 w-24" /> {/* Texto */}
              </div>
            ))}
          </div>
        </div>

        {/* Segundo grupo */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" /> {/* Label do grupo */}
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <Skeleton className="h-4 w-4" /> {/* Ícone */}
                <Skeleton className="h-4 w-20" /> {/* Texto */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="mx-4 mb-4">
        <Skeleton className="h-px w-full" />
      </div>

      {/* Footer */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" /> {/* Avatar */}
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" /> {/* Nome */}
            <Skeleton className="h-3 w-32" /> {/* Email */}
          </div>
        </div>
      </div>
    </div>
  );
}
