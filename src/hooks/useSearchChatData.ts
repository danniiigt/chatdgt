"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Chat } from "./useChatList";

// Types
interface ChatTimeRangeResponse {
  chats: Chat[];
  count: number;
  date_range: {
    start: string;
    end: string;
  };
}

interface SearchResult {
  chat_id: string;
  chat_title: string;
  updated_at: string;
  match_type: "title" | "message";
  message_preview: string | null;
  message_id: string | null;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  fallback?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: ChatTimeRangeResponse;
}

interface SearchApiResponse {
  success: boolean;
  data: SearchResponse;
}

// API Functions
const fetchTodayChats = async (): Promise<ChatTimeRangeResponse> => {
  const response = await fetch("/api/chat/today");
  const result: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.data?.toString() || "Error al cargar chats de hoy");
  }

  if (!result.success || !result.data) {
    throw new Error("Error al cargar chats de hoy");
  }

  return result.data;
};

const fetchLast7DaysChats = async (): Promise<ChatTimeRangeResponse> => {
  const response = await fetch("/api/chat/last-7-days");
  const result: ApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.data?.toString() || "Error al cargar chats de los últimos 7 días");
  }

  if (!result.success || !result.data) {
    throw new Error("Error al cargar chats de los últimos 7 días");
  }

  return result.data;
};

const searchChats = async (query: string): Promise<SearchResponse> => {
  if (!query.trim() || query.length < 2) {
    return {
      results: [],
      query: query.trim(),
    };
  }

  const params = new URLSearchParams({
    q: query.trim(),
    limit: "10",
  });

  const response = await fetch(`/api/chat/search?${params}`);
  const result: SearchApiResponse = await response.json();

  if (!response.ok) {
    throw new Error(result.data?.toString() || "Error al buscar chats");
  }

  if (!result.success || !result.data) {
    throw new Error("Error al buscar chats");
  }

  return result.data;
};

// Custom Hooks
export const useTodayChats = () => {
  return useQuery({
    queryKey: ["chats", "today"],
    queryFn: fetchTodayChats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useLast7DaysChats = () => {
  return useQuery({
    queryKey: ["chats", "last-7-days"],
    queryFn: fetchLast7DaysChats,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useSearchChats = (query: string) => {
  return useQuery({
    queryKey: ["chats", "search", query],
    queryFn: () => searchChats(query),
    enabled: query.trim().length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
};

// Hook to prefetch individual chat data
export const useChatPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchChat = (chatId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["chat", chatId],
      queryFn: async () => {
        const response = await fetch(`/api/chat/${chatId}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || "Error al cargar chat");
        }
        
        return result.data;
      },
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  return { prefetchChat };
};