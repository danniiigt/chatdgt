"use client";

import Link from "next/link";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import { EditChatDialog } from "../views/chat/EditChatDialog";
import { DeleteChatDialogSimple } from "../views/chat/DeleteChatDialogSimple";
import { useQueryClient } from "@tanstack/react-query";
import { fetchChat } from "@/hooks/useChat";
import { Chat } from "@/hooks/useChatList";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { BookmarkButton } from "./BookmarkButton";
import { useIsMobile } from "@/hooks/use-mobile";

interface BookmarkedChatsProps {
  chats: Chat[];
}

export const BookmarkedChats = ({ chats }: BookmarkedChatsProps) => {
  // Third party hooks
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  // State
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Constants
  const currentChatId = searchParams.get("chatId");

  // Functions
  const handlePrefetchChat = (chatId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["chat", chatId],
      queryFn: () => fetchChat(chatId),
    });
  };

  const getIsHovered = (index: number) => {
    return hoveredIndex === index;
  };

  const getIsActive = (chatId: string) => {
    return currentChatId === chatId;
  };

  return (
    <SidebarMenu>
      {chats.map((chat, index) => (
        <SidebarMenuItem
          key={chat.id}
          className="relative"
          onMouseEnter={() => {
            handlePrefetchChat(chat.id);
            setHoveredIndex(index);
          }}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <SidebarMenuButton
            asChild
            className={cn(
              "w-full justify-start gap-2 cursor-pointer py-2 px-2 h-auto relative overflow-hidden",
              {
                "bg-foreground/5 text-sidebar-accent-foreground hover:bg-foreground/10":
                  getIsActive(chat.id),
              }
            )}
          >
            <Link
              href={`/chat?chatId=${chat.id}`}
              className="flex items-center w-full relative"
              onClick={isMobile ? toggleSidebar : undefined}
            >
              <span
                className={cn("truncate pr-0 transition-all duration-75", {
                  "pr-20": getIsHovered(index),
                })}
              >
                {chat.title}
              </span>
            </Link>
          </SidebarMenuButton>

          <div
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-0 transition-opacity duration-75 z-10",
              {
                "opacity-100": getIsHovered(index),
              }
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <BookmarkButton chatId={chat.id} chat={chat} isBookmarked={true} />
            <EditChatDialog chatId={chat.id} currentTitle={chat.title} />
            <DeleteChatDialogSimple chatId={chat.id} chatTitle={chat.title} />
          </div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
