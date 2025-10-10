import { Bell,RefreshCw, Save, Shield } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  return (
    <div className="p-6">
      <PageHeader title="Configurações">
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Redefinir
        </Button>
        <Button variant="outline" size="sm">
          <Shield className="mr-2 h-4 w-4" />
          Segurança
        </Button>
        <Button size="sm">
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </PageHeader>

      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email de transações</p>
                  <p className="text-muted-foreground text-sm">
                    Receber notificações por email
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Relatórios mensais</p>
                  <p className="text-muted-foreground text-sm">
                    Resumo mensal das finanças
                  </p>
                </div>
                <input type="checkbox" className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="mb-2 font-medium">Alterar Senha</p>
                <Button variant="outline" size="sm">
                  Alterar senha
                </Button>
              </div>
              <div>
                <p className="mb-2 font-medium">Autenticação de dois fatores</p>
                <Button variant="outline" size="sm">
                  Configurar 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Preferências Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="font-medium">Moeda padrão</label>
                <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>Real (BRL)</option>
                  <option>Dólar (USD)</option>
                  <option>Euro (EUR)</option>
                </select>
              </div>
              <div>
                <label className="font-medium">Tema</label>
                <select className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                  <option>Sistema</option>
                  <option>Claro</option>
                  <option>Escuro</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
