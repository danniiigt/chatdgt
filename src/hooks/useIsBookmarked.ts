"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Chat } from "./useChatList";

/**
 * Hook to check if a chat is bookmarked
 */
export const useIsBookmarked = (chatId: string) => {
  const queryClient = useQueryClient();
  
  const bookmarkedChats = queryClient.getQueryData<Chat[]>(["bookmarkedChats"]) || [];
  
  return bookmarkedChats.some(chat => chat.id === chatId);
};