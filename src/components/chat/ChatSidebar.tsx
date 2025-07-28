"use client";

import {
  Search,
  Plus,
  Settings,
  MessageSquare,
  PanelLeftClose,
} from "lucide-react";
import { useTranslate } from "@tolgee/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";

export const ChatSidebar = () => {
  // Third party hooks
  const { t } = useTranslate();
  const { toggleSidebar } = useSidebar();

  // Helpers / Functions
  const handleNewChat = () => {
    // TODO: Implement new chat functionality
  };

  const handleSearchChats = (query: string) => {
    // TODO: Implement chat search functionality
  };

  // Constants
  const mockChatHistory = [
    { id: "1", title: "Conversación sobre React", lastMessage: "Hace 2 horas" },
    { id: "2", title: "Ayuda con Next.js", lastMessage: "Ayer" },
    { id: "3", title: "Consulta sobre TypeScript", lastMessage: "Hace 3 días" },
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="px-2 py-4">
        <div className="flex items-center gap-2 px-2 justify-between">
          <Icons.chatgpt className="size-5" />

          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <PanelLeftClose
              className="size-5 text-muted-foreground"
              strokeWidth={1.25}
            />
          </Button>
        </div>

        <SidebarGroup className="px-0 space-y-0.5 pb-0">
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            <MessageSquare className="size-5" />
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            <Search className="size-5" />
            {t("chat.search-chat", "Buscar chats")}
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup className="px-2.5 space-y-0.5">
          <SidebarGroupLabel>
            {t("chat.history", "Historial")}
          </SidebarGroupLabel>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
          <SidebarMenuButton className="w-full justify-start gap-2 cursor-pointer py-4.5">
            {t("chat.new-chat", "Nuevo chat")}
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              {t("chat.settings", "Configuración")}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
