import { Calendar, Download, Search } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TransacoesPage() {
  return (
    <div className="p-6">
      <PageHeader title="Transações">
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Período
        </Button>
        <Button variant="outline" size="sm">
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Total de Transações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">127</p>
              <p className="text-muted-foreground text-xs">
                +12% em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Volume Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">R$ 7.650,00</p>
              <p className="text-muted-foreground text-xs">
                Soma de todas as transações
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Última Transação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">Hoje</p>
              <p className="text-muted-foreground text-xs">
                Compra no supermercado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion
              className="rounded-lg border px-4"
              type="single"
              collapsible
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>Transação de - R$127,00</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <CardFooter>
              <p className="text-muted-foreground mt-4">
                Visualize e gerencie todas as suas transações financeiras em um
                só lugar.
              </p>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
