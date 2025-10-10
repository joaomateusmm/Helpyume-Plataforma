import {
  BellRing,
  ChartCandlestick,
  CircleFadingPlus,
  CircleMinus,
  LayoutDashboard,
  NotebookPen,
  Palette,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Separator } from "./ui/separator";
import { UserFooter } from "./user-footer";

// Menu items.
const items1 = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Investimentos",
    url: "/investimentos",
    icon: ChartCandlestick,
  },
  {
    title: "Ganhos",
    url: "/ganhos",
    icon: CircleFadingPlus,
  },
  {
    title: "Gastos",
    url: "/gastos",
    icon: CircleMinus,
  },
  {
    title: "Transações",
    url: "/transacoes",
    icon: NotebookPen,
  },
];

const items2 = [
  {
    title: "Temas",
    url: "/temas",
    icon: Palette,
  },
  {
    title: "Notificações",
    url: "/notificacoes",
    icon: BellRing,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="px-3 py-4 text-lg font-semibold">
        Helpyume
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dinheiro</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items1.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Aparência e Personalização</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items2.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <UserFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
