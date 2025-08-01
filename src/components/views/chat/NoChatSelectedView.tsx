"use client";

import { Icons } from "@/components/ui/icons";
import { useTranslate } from "@tolgee/react";
import { SuggestedMessages } from "./SuggestedMessages";
import { useChat } from "@/hooks/useChat";
import { useEffect, useState } from "react";

export const NoChatSelectedView = () => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [localStorageModel, setLocalStorageModel] = useState<
    string | undefined
  >(undefined);

  // Custom hooks
  const { sendMessage, isLoading } = useChat();

  // Effects
  useEffect(() => {
    const model = localStorage.getItem("chatdgt-selected-model");
    if (model) {
      setLocalStorageModel(model);
    }
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="flex flex-col items-center pb-16 px-4">
        <header className="space-y-8">
          <Icons.chatgpt className="size-40 mx-auto" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-semibold">
                {t("chat.welcome", "¡Hola! Todo bien por aquí")}
              </h1>
              <p className="text-muted-foreground text-lg">
                {t("chat.welcome-subtitle", "¿En qué te puedo ayudar hoy?")}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-8">
          <SuggestedMessages
            onMessageSelect={(message) =>
              sendMessage(message, undefined, localStorageModel)
            }
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
