"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTranslate } from "@tolgee/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ChatListResponse {
  chats: Chat[];
  pagination: PaginationInfo;
}

interface UseChatListState {
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;
  searchQuery: string;
}

interface UseChatListActions {
  loadChats: (page?: number, search?: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setSearchQuery: (query: string) => void;
  refreshChats: () => Promise<void>;
  resetError: () => void;
}

const fetchChats = async (
  page: number = 1,
  search: string = ""
): Promise<ChatListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: "20",
  });

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const url = `/api/chat?${params}`;
  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al cargar conversaciones");
  }

  if (!result.success || !result.data) {
    throw new Error("Error al cargar conversaciones");
  }

  return result.data;
};

const deleteChat = async (chatId: string): Promise<void> => {
  const response = await fetch("/api/chat", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ chatId }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al eliminar conversación");
  }

  if (!result.success) {
    throw new Error("Error al eliminar conversación");
  }
};

export const useChatList = (): UseChatListState & UseChatListActions => {
  // Third party hooks
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Data fetching
  const chatListQuery = useQuery({
    queryKey: ["chats", currentPage, searchQuery],
    queryFn: () => fetchChats(currentPage, searchQuery),
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutations
  const deleteChatMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success(
        t("chat.success.chat-deleted", "Conversación eliminada exitosamente")
      );
    },
    onError: (error: Error) => {
      console.error("Delete chat error:", error);
      toast.error(
        t("chat.error.delete-failed", "Error al eliminar conversación")
      );
    },
  });

  // Helpers / Functions
  const loadChats = useCallback(
    async (page: number = 1, search?: string) => {
      const searchTerm = search !== undefined ? search : searchQuery;
      setCurrentPage(page);
      if (search !== undefined) {
        setSearchQuery(searchTerm);
      }
    },
    [searchQuery]
  );

  const handleDeleteChat = useCallback(
    async (chatId: string) => {
      if (!chatId) return;
      deleteChatMutation.mutate(chatId);
    },
    [deleteChatMutation]
  );

  const refreshChats = useCallback(async () => {
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  }, [queryClient]);

  const resetError = useCallback(() => {
    // Error is managed by TanStack Query
  }, []);

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Constants
  const chats = chatListQuery.data?.chats || [];
  const isLoading = chatListQuery.isLoading || deleteChatMutation.isPending;
  const error = chatListQuery.error?.message || null;
  const pagination = chatListQuery.data?.pagination || null;

  return {
    // State
    chats,
    isLoading,
    error,
    pagination,
    searchQuery,

    // Actions
    loadChats,
    deleteChat: handleDeleteChat,
    setSearchQuery: handleSetSearchQuery,
    refreshChats,
    resetError,
  };
};
