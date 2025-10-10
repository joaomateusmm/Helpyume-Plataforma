import { DashboardSkeleton } from "./dashboard-skeleton";
import { SidebarSkeleton } from "./sidebar-skeleton";

export function AppSkeleton() {
  return (
    <div className="flex h-screen">
      {/* Sidebar Skeleton */}
      <SidebarSkeleton />

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Sidebar Trigger Skeleton */}
        <div className="p-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md border">
            <div className="bg-muted h-4 w-4 animate-pulse rounded" />
          </div>
        </div>

        {/* Page Content Skeleton */}
        <div className="flex-1 overflow-auto">
          <DashboardSkeleton />
        </div>
      </div>
    </div>
  );
}
