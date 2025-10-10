import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  children?: ReactNode;
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <header className="mb-6 border-b pb-4">
      {/* Breadcrumb */}
      <nav className="text-muted-foreground mb-3 flex items-center text-sm">
        <span>Helpyume</span>
        <ChevronRight className="mx-2 h-3 w-3" />
        <span>Páginas e Ferramentas</span>
        <ChevronRight className="mx-2 h-3 w-3" />
        <span className="text-foreground font-medium">{title}</span>
      </nav>

      {/* Header principal */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {children && <div className="flex items-center gap-2">{children}</div>}
      </div>
    </header>
  );
}
