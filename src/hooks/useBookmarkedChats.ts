"use client";

import { useQuery } from "@tanstack/react-query";
import { Chat } from "./useChatList";

/**
 * Hook to fetch bookmarked chats for the current user
 */
export const useBookmarkedChats = () => {
  return useQuery<Chat[]>({
    queryKey: ["bookmarkedChats"],
    queryFn: async () => {
      const response = await fetch("/api/chat/bookmark");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener chats guardados");
      }
      
      const data = await response.json();
      return data.chats;
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};