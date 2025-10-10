import { Download,Filter, Plus } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GastosPage() {
  return (
    <div className="p-6">
      <PageHeader title="Gastos">
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Novo Gasto
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumo de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Aqui você pode gerenciar todos os seus gastos e despesas.
            </p>
          </CardContent>
        </Card>

        {/* Aqui você pode adicionar mais componentes para a página de gastos */}
      </div>
    </div>
  );
}
