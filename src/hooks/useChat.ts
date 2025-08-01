"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Types
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  tokens?: number;
  model?: string;
  created_at: string;
}

interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
}

interface UsageInfo {
  tokensUsed: number;
  tokensRemaining: number;
  messagesRemaining: number;
}

interface UseChatState {
  currentChat: Chat | null;
  isLoading: boolean;
  error: string | null;
  usage: UsageInfo | null;
}

interface UseChatActions {
  sendMessage: (
    message: string,
    chatId?: string,
    model?: string
  ) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  clearMessages: () => void;
  clearCurrentChat: () => void;
}

interface SendMessageRequest {
  message: string;
  chatId?: string;
  model?: string;
}

interface SendMessageResponse {
  chat: Chat;
  userMessage: Message;
  assistantMessage: Message;
  usage: UsageInfo;
}

// API Functions
export const fetchChat = async (chatId: string): Promise<Chat> => {
  const response = await fetch(`/api/chat/${chatId}`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al cargar conversación");
  }

  if (!result.success || !result.data) {
    throw new Error("Error al cargar conversación");
  }

  return result.data;
};

const sendMessage = async (
  request: SendMessageRequest
): Promise<SendMessageResponse> => {
  const response = await fetch("/api/chat/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Error al enviar mensaje");
  }

  if (!result.success || !result.data) {
    throw new Error("Error al enviar mensaje");
  }

  return result.data;
};

export const useChat = (): UseChatState & UseChatActions => {
  // Third party hooks
  const { t } = useTranslate();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  // Data fetching
  const chatQuery = useQuery({
    queryKey: ["chat", currentChatId],
    queryFn: () => fetchChat(currentChatId!),
    enabled: !!currentChatId && !currentChatId.startsWith("temp-"),
    staleTime: 0, // Always fetch fresh chat data
  });

  // Mutations
  const sendMessageMutation = useMutation({
    mutationFn: sendMessage,
    onMutate: async (variables) => {
      if (!variables.message.trim()) return;

      const targetChatId = variables.chatId;

      if (targetChatId) {
        // Cancel outgoing refetches
        await queryClient.cancelQueries({
          queryKey: ["chat", targetChatId],
        });

        // Snapshot the previous value
        const previousChat = queryClient.getQueryData(["chat", targetChatId]);

        // Create optimistic user message
        const optimisticUserMessage: Message = {
          id: `temp-${Date.now()}`,
          content: variables.message.trim(),
          role: "user",
          created_at: new Date().toISOString(),
        };

        // Optimistically update the chat with user message
        queryClient.setQueryData(
          ["chat", targetChatId],
          (old: Chat | undefined) => {
            if (!old) return old;
            return {
              ...old,
              messages: [...old.messages, optimisticUserMessage],
            };
          }
        );

        return { previousChat };
      }

      // For new chats, we don't need to do anything here since
      // the optimistic update was already done in handleSendMessage
      return {};
    },
    onSuccess: (data) => {
      const { chat, userMessage, assistantMessage, usage: usageInfo } = data;

      // Check if we had an optimistic chat (temp chat)
      const wasOptimisticChat = currentChatId?.startsWith("temp-chat-");

      // Update current chat to real chat ID
      setCurrentChatId(chat.id);
      setUsage(usageInfo);

      // If this was an optimistic chat, we need to replace it
      if (wasOptimisticChat && currentChatId) {
        // Set the real chat with both user and assistant messages FIRST
        queryClient.setQueryData(["chat", chat.id], {
          ...chat,
          messages: [userMessage, assistantMessage],
        });

        // Remove the temporary chat from cache
        queryClient.removeQueries({ queryKey: ["chat", currentChatId] });

        // Navigate to the real chat URL - this will trigger loadMessages but won't overwrite
        router.replace(`/chat?chatId=${chat.id}`);
      } else {
        // For existing chats, replace temporary messages with real ones
        queryClient.setQueryData(["chat", chat.id], (old: Chat | undefined) => {
          if (!old) return { ...chat, messages: [userMessage, assistantMessage] };
          
          // Remove temporary messages and add real ones
          const messagesWithoutTemp = old.messages.filter(
            (m) => !m.id.startsWith("temp-")
          );
          
          return {
            ...chat,
            messages: [...messagesWithoutTemp, userMessage, assistantMessage],
          };
        });
      }

      // Invalidate chat list to show updated chat
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: (error, variables, context) => {
      // Check if we had an optimistic chat that failed
      const wasOptimisticChat = currentChatId?.startsWith("temp-chat-");

      if (wasOptimisticChat && currentChatId) {
        // Remove the failed optimistic chat
        queryClient.removeQueries({ queryKey: ["chat", currentChatId] });
        
        // Clear current chat and navigate back
        setCurrentChatId(null);
        router.replace("/chat");
      } else if (variables.chatId && context?.previousChat) {
        // Revert optimistic update for existing chats
        queryClient.setQueryData(
          ["chat", variables.chatId],
          context.previousChat
        );
      }

      console.error("Send message error:", error);
      toast.error(t("chat.error.send-failed", "Error al enviar mensaje"));
    },
  });

  // Helpers / Functions
  const handleSendMessage = useCallback(
    async (message: string, chatId?: string, model?: string) => {
      if (!message.trim()) return;

      const targetChatId = chatId || currentChatId;

      // If no chatId provided and no current chat, create optimistic chat
      if (!targetChatId) {
        // Generate temporary IDs
        const tempChatId = `temp-chat-${Date.now()}`;
        const tempMessageId = `temp-message-${Date.now()}`;

        // Create optimistic user message
        const optimisticUserMessage: Message = {
          id: tempMessageId,
          content: message.trim(),
          role: "user",
          created_at: new Date().toISOString(),
        };

        // Create optimistic chat
        const optimisticChat: Chat = {
          id: tempChatId,
          title: message.trim().slice(0, 50) + (message.trim().length > 50 ? '...' : ''),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [optimisticUserMessage],
        };

        // Set the optimistic chat in cache
        queryClient.setQueryData(["chat", tempChatId], optimisticChat);
        
        // Update current chat ID
        setCurrentChatId(tempChatId);

        // Navigate to the optimistic chat immediately
        router.push(`/chat?chatId=${tempChatId}`);

        // Send the message to create real chat
        sendMessageMutation.mutate({ 
          message: message.trim(), 
          chatId: undefined, // No chatId means create new chat
          model 
        });

        return;
      }

      // For existing chats, just send the message
      // The optimistic update will be handled in onMutate
      sendMessageMutation.mutate({ message: message.trim(), chatId: targetChatId, model });
    },
    [sendMessageMutation, currentChatId, queryClient, router, setCurrentChatId]
  );

  const loadMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;
    
    // Check if we already have this chat data in cache (from optimistic update)
    const existingChatData = queryClient.getQueryData<Chat>(["chat", chatId]);
    
    // If we have existing data and it has messages, don't trigger a new fetch
    // This prevents overwriting data that was just set by onSuccess
    if (existingChatData && existingChatData.messages && existingChatData.messages.length > 0) {
      setCurrentChatId(chatId);
      return;
    }
    
    // Otherwise, proceed with normal loading
    setCurrentChatId(chatId);
  }, [queryClient]);

  const clearMessages = useCallback(() => {
    setCurrentChatId(null);
    setUsage(null);
  }, []);

  const clearCurrentChat = useCallback(() => {
    setCurrentChatId(null);
  }, []);

  // Constants
  const isOptimisticChat = currentChatId?.startsWith("temp-chat-");
  
  // Get current chat data - from query for real chats, from cache for optimistic chats
  const currentChat = isOptimisticChat && currentChatId
    ? queryClient.getQueryData<Chat>(["chat", currentChatId]) || null
    : chatQuery.data || null;
  
  // For optimistic chats, don't include chatQuery.isLoading to avoid persistent loading
  // Also check if we have an optimistic chat with only user message (waiting for AI response)
  const hasOnlyUserMessage = isOptimisticChat && currentChat && 
    currentChat.messages.length === 1 && 
    currentChat.messages[0].role === "user";
  
  const isLoading = isOptimisticChat 
    ? (sendMessageMutation.isPending || hasOnlyUserMessage)
    : (chatQuery.isLoading || sendMessageMutation.isPending);
  const error = chatQuery.error?.message || null;

  return {
    // State
    currentChat,
    isLoading,
    error,
    usage,

    // Actions
    sendMessage: handleSendMessage,
    loadMessages,
    clearMessages,
    clearCurrentChat,
  };
};
