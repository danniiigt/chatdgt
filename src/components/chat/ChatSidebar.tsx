"use client";

import {
  Search,
  Plus,
  Settings,
  MessageSquare,
  PanelLeftClose,
} from "lucide-react";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";
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
import { useChatList } from "@/hooks/useChatList";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { fetchChat } from "@/hooks/useChat";

export const ChatSidebar = () => {
  // Third party hooks
  const { t } = useTranslate();
  const { toggleSidebar } = useSidebar();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Custom hooks
  const { chats, isLoading } = useChatList();

  // Functions
  const handlePrefetchChat = (chatId: string) => {
    router.prefetch(`/chat?chatId=${chatId}`);
    queryClient.prefetchQuery({
      queryKey: ["chat", chatId],
      queryFn: () => fetchChat(chatId),
    });
  };

  const formatLastActivity = useCallback(
    (updatedAt: string) => {
      const date = new Date(updatedAt);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

      if (diffInHours < 1) {
        return t("chat.time.minutes", "Hace unos minutos");
      } else if (diffInHours < 24) {
        return t("chat.time.hours", `Hace ${Math.floor(diffInHours)} horas`);
      } else if (diffInHours < 48) {
        return t("chat.time.yesterday", "Ayer");
      } else {
        const days = Math.floor(diffInHours / 24);
        return t("chat.time.days", `Hace ${days} días`);
      }
    },
    [t]
  );

  // Constants
  const hasNoChats = chats.length === 0;
  const hasChats = chats.length > 0;

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
          <SidebarMenuButton
            asChild
            className="w-full justify-start gap-2 cursor-pointer py-4.5"
            disabled={isLoading}
          >
            <Link href="/chat" prefetch={true}>
              <MessageSquare className="size-5" />
              {t("chat.new-chat", "Nuevo chat")}
            </Link>
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

          {isLoading && (
            <div className="space-y-2">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="h-10 bg-muted/50 rounded-md animate-pulse"
                />
              ))}
            </div>
          )}

          {!isLoading && !hasChats && (
            <div className="px-2 py-4 text-center text-muted-foreground text-sm">
              {t("chat.empty-history", "No tienes conversaciones aún")}
            </div>
          )}

          <SidebarMenu>
            {!isLoading &&
              hasChats &&
              chats.map((chat, index) => (
                <div
                  key={index}
                  onMouseEnter={() => handlePrefetchChat(chat.id)}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="w-full justify-start gap-2 cursor-pointer py-2 px-2 h-auto truncate"
                    >
                      <Link href={`/chat?chatId=${chat.id}`}>
                        {chat.title.slice(0, 35)}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </div>
              ))}
          </SidebarMenu>
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
