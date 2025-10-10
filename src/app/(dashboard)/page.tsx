import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  ChartCandlestick,
  FileText,
  NotebookPen,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="p-6">
      <PageHeader title="Dashboard">
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Relatórios
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <ChartCandlestick />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Investidos</p>
              <p className="text-3xl font-bold text-gray-50">R$ 2.450,00</p>
              <p className="text-xs text-gray-300">
                Essa é a soma de tudo que você investiu até agora.
              </p>
            </div>
          </div>
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <BanknoteArrowDown />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Gastos</p>
              <p className="text-3xl font-bold text-red-400">R$ 450,00</p>
              <p className="text-xs text-gray-300">
                Essa é a soma de tudo que você gastou até agora.
              </p>
            </div>
          </div>
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <BanknoteArrowUp />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Ganhos</p>
              <p className="text-3xl font-bold text-green-400">R$ 2.950,00</p>
              <p className="text-xs text-gray-300">
                Essa é a soma de tudo que você ganhou até agora.
              </p>
            </div>
          </div>
          <div className="flex h-[180px] flex-col justify-between rounded-lg border bg-[#191919] p-4 duration-300 hover:scale-[1.02]">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#292929]">
              {" "}
              <NotebookPen />
            </div>
            <div>
              <p className="text-sm text-gray-300">Total de Transações</p>
              <p className="text-3xl font-bold text-yellow-300">12</p>
              <p className="text-xs text-gray-300">
                Essa é a soma de todas as suas movimentações bancárias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
