"use client";

import { useQuery } from "@tanstack/react-query";
import { Chat } from "./useChatList";

/**
 * Hook to check if a chat is bookmarked
 */
export const useIsBookmarked = (chatId: string) => {
  const { data: bookmarkedChats = [] } = useQuery<Chat[]>({
    queryKey: ["bookmarkedChats"],
    queryFn: () => {
      return [];
    },
    enabled: false, // Don't fetch, just observe cache changes
    initialData: [],
  });

  return bookmarkedChats.some((chat) => chat.id === chatId);
};
