"use client";

import { Edit, RefreshCw, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/page-header";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateUserName } from "@/lib/actions/user-settings";

export default function ConfiguracoesPage() {
  const { user, isLoading } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [currency, setCurrency] = useState("BRL");
  const [isSaving, setIsSaving] = useState(false);

  // Função para atualizar o nome do usuário
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateUserName(newName);

      if (result.success) {
        toast.success(result.message || "Nome atualizado com sucesso!");
        setIsEditing(false);
        // Recarregar a página ou atualizar o contexto do usuário
        window.location.reload();
      } else {
        toast.error(result.error || "Erro ao atualizar nome");
      }
    } catch (error) {
      toast.error("Erro ao atualizar nome");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStartEdit = () => {
    setNewName(user?.name || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewName("");
  };

  // Carregar preferências salvas
  useEffect(() => {
    const savedCurrency = localStorage.getItem("currency");
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      // Salvar moeda no localStorage
      localStorage.setItem("currency", currency);

      // O tema já é salvo automaticamente pelo hook useTheme
      // Simular salvamento no servidor
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Preferências salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar preferências");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <PageHeader title="Configurações"></PageHeader>

      <div className="grid space-y-6 md:grid-cols-2 md:gap-6 md:space-y-0">
        {/* Card de Edição de Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informações do Perfil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                {/* Campo Email (somente leitura) */}
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    value={user.email}
                    disabled
                    className="bg-muted/50 text-foreground mt-1 cursor-not-allowed opacity-75"
                  />
                  <p className="text-muted-foreground mt-1 text-xs">
                    O email não pode ser alterado
                  </p>
                </div>

                {/* Campo Nome */}
                <div>
                  <label className="text-sm font-medium">Nome</label>
                  {isEditing ? (
                    <div className="mt-1 flex gap-2">
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="Digite seu novo nome"
                        className="bg-background border-border text-foreground"
                      />
                      <Button
                        onClick={handleUpdateName}
                        disabled={isUpdating}
                        size="sm"
                      >
                        {isUpdating ? "Salvando..." : "Salvar"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        disabled={isUpdating}
                      >
                        Cancelar
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-2">
                      <Input
                        value={user.name}
                        disabled
                        className="bg-muted/50 text-foreground cursor-not-allowed opacity-75"
                      />
                      <Button
                        onClick={handleStartEdit}
                        variant="outline"
                        size="sm"
                        className="py-4.5"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  )}
                </div>
              </>
            ) : isLoading ? (
              <div className="space-y-4">
                <div>
                  <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                  <div className="bg-muted mt-2 h-10 animate-pulse rounded" />
                </div>
                <div>
                  <div className="bg-muted h-4 w-16 animate-pulse rounded" />
                  <div className="bg-muted mt-2 h-10 animate-pulse rounded" />
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">
                  Faça login para visualizar suas informações de perfil
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Preferências Gerais
              </CardTitle>
              <Button
                onClick={handleSavePreferences}
                disabled={isSaving}
                size="sm"
                variant="outline"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Moeda padrão
                </label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma moeda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">
                      <div className="flex items-center gap-2">
                        <span>🇧🇷</span>
                        Real (BRL)
                      </div>
                    </SelectItem>
                    <SelectItem value="USD">
                      <div className="flex items-center justify-center gap-2">
                        <span>🇺🇸</span>
                        Dólar (USD)
                      </div>
                    </SelectItem>
                    <SelectItem value="EUR">
                      <div className="flex items-center gap-2">
                        <span>🇪🇺</span>
                        Euro (EUR)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-foreground text-sm font-medium">
                  Tema
                </label>
                <Select
                  value={theme}
                  onValueChange={(value: "light" | "dark" | "system") =>
                    setTheme(value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um tema" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">
                      <div className="flex items-center gap-2">Sistema</div>
                    </SelectItem>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">Claro</div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">Escuro</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
