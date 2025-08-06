"use client";

import { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";

interface SharedChatData {
  id: string;
  title: string;
  created_at: string;
  messages: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    created_at: string;
  }>;
  model: string;
  isValid: boolean;
}

export const useSharedChat = (token: string) => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [chatData, setChatData] = useState<SharedChatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Effects
  useEffect(
    function fetchSharedChat() {
      if (!token) return;

      const fetchData = async () => {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/share/${token}`);

          if (!response.ok) {
            if (response.status === 404) {
              setError(
                t(
                  "shared-chat.error.not-found",
                  "Enlace no encontrado o expirado"
                )
              );
            } else {
              setError(
                t(
                  "shared-chat.error.generic",
                  "Error al cargar la conversación"
                )
              );
            }
            return;
          }

          const data = await response.json();
          setChatData(data.data);
        } catch (error) {
          console.error("Error fetching shared chat:", error);
          setError(
            t("shared-chat.error.generic", "Error al cargar la conversación")
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    },
    [token, t]
  );

  return {
    chatData,
    isLoading,
    error,
  };
};