"use client";

import {
  ChartCandlestick,
  CircleFadingPlus,
  CircleMinus,
  LayoutDashboard,
  NotebookPen,
  Settings,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useTheme } from "@/components/theme-provider";
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
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { theme } = useTheme();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Determinar qual logo usar baseado no tema
  const logoSrc =
    theme === "light" ? "/assets/logo-dark.svg" : "/assets/logo-light.svg";

  return (
    <Sidebar>
      <SidebarHeader className="p-4 text-lg font-semibold">
        <Link href="/">
          {isHydrated ? (
            <Image src={logoSrc} alt="Logo Helpyume" width={170} height={170} />
          ) : (
            <div className="h-[170px] w-[170px]" />
          )}
        </Link>
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
