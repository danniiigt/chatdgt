"use client";

import {
  Search,
  Settings,
  MessageSquare,
  PanelLeftClose,
  Archive,
} from "lucide-react";
import { useTranslate } from "@tolgee/react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Icons } from "../ui/icons";
import { Button } from "../ui/button";
import { KeyboardShortcut } from "../ui/keyboard-shortcut";
import { useChatList } from "@/hooks/useChatList";
import { Chats } from "./Chats";
import { ChatSearchDialog } from "./ChatSearchDialog";
import Link from "next/link";
import { useUser } from "@supabase/auth-helpers-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSearchChat } from "@/hooks/useSearchChat";
import { randomColor } from "@/lib/constants";

export const ChatSidebar = () => {
  // Third party hooks
  const { t } = useTranslate();
  const { toggleSidebar } = useSidebar();
  const user = useUser();

  // Custom hooks
  const { chats, isLoading } = useChatList();
  const { isOpen, setIsOpen } = useSearchChat();

  // Constants
  const hasChats = chats.length > 0;
  const fullName = user?.user_metadata?.full_name || "";
  const avatarUrl = user?.user_metadata?.avatar_url || "";
  const userEmail = user?.email || "";
  const userInitials = fullName
    ? fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="px-2 py-3">
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
            className="w-full justify-start gap-2 cursor-pointer py-4.5 group-2"
          >
            <Link href="/chat" prefetch={true}>
              <div className="flex items-center gap-x-2 w-full pr-2">
                <MessageSquare className="size-4" />
                <span>{t("chat.new-chat", "Nuevo")}</span>

                <div className="flex-auto"></div>

                <div className="hidden group-2-hover:block ml-auto">
                  <KeyboardShortcut keys={["shift", "cmd", "O"]} />
                </div>
              </div>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            asChild
            className="w-full justify-start gap-2 cursor-pointer py-4.5 group-2"
          >
            <Link href="/archived-chats" prefetch={true}>
              <div className="flex items-center gap-x-2 w-full pr-2">
                <Archive className="size-4" />
                <span>{t("chat.archived-chats", "Archivados")}</span>

                <div className="flex-auto"></div>

                <div className="hidden group-2-hover:block ml-auto">
                  <KeyboardShortcut keys={["shift", "cmd", "E"]} />
                </div>
              </div>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="w-full justify-start gap-2 cursor-pointer py-4.5 group-2"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex items-center gap-x-2 w-full pr-2">
              <Search className="size-4" />
              <span>{t("chat.search-chat", "Buscar")}</span>

              <div className="flex-auto"></div>

              <div className="hidden group-2-hover:block ml-auto">
                <KeyboardShortcut keys={["cmd", "K"]} />
              </div>
            </div>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent className="px-0">
        <SidebarGroup className="px-2.5 space-y-0.5">
          <SidebarGroupLabel>
            {t("chat.history", "Historial")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
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

            {!isLoading && hasChats && <Chats chats={chats} />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="w-full justify-start gap-2 py-6 px-2"
            >
              <Link href="/settings">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarUrl} alt={fullName || "Avatar"} />
                  <AvatarFallback
                    style={{
                      backgroundColor: randomColor,
                    }}
                    className="text-sm text-white"
                  >
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3>{t("chat.settings", "Configuración")}</h3>
                  <h4 className="text-muted-foreground text-xs truncate">
                    {userEmail}
                  </h4>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <ChatSearchDialog />
    </Sidebar>
  );
};
