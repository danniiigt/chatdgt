"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslate } from "@tolgee/react";
import { toast } from "sonner";

type Chat = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_archived: boolean;
  system_prompt: string | null;
};

export const useArchivedChats = () => {
  // Third party hooks
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  // Data fetching
  const getArchivedChats = async (): Promise<Chat[]> => {
    const response = await fetch("/api/chat/archived");
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al obtener chats archivados");
    }
    
    const data = await response.json();
    return data.chats;
  };

  const unarchiveChat = async (chatId: string): Promise<Chat> => {
    const response = await fetch(`/api/chat/${chatId}/unarchive`, {
      method: "PATCH",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al restaurar el chat");
    }
    
    const data = await response.json();
    return data.chat;
  };

  const deleteChat = async (chatId: string): Promise<boolean> => {
    const response = await fetch(`/api/chat/${chatId}`, {
      method: "DELETE",
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error al eliminar el chat");
    }
    
    return true;
  };

  const { data: archivedChats = [], isLoading } = useQuery({
    queryKey: ["archivedChats"],
    queryFn: getArchivedChats,
  });

  const unarchiveMutation = useMutation({
    mutationFn: unarchiveChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archivedChats"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast.success(t("chat.restore.success", "Chat restaurado correctamente"));
    },
    onError: () => {
      toast.error(t("chat.restore.error", "Error al restaurar el chat"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["archivedChats"] });
      toast.success(t("chat.delete.success", "Chat eliminado permanentemente"));
    },
    onError: () => {
      toast.error(t("chat.delete.error", "Error al eliminar el chat"));
    },
  });

  return {
    archivedChats,
    isLoading,
    unarchiveMutation,
    deleteMutation,
  };
};