"use client";

import { useTranslate } from "@tolgee/react";
import { LoaderCircle } from "lucide-react";
import { MessageAvatar } from "./MessageAvatar";

export const LoadingMessage = () => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="flex gap-3 p-4 rounded-lg bg-muted/20">
      <MessageAvatar isUser={false} />

      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {t("chat.message.assistant", "Asistente")}
          </span>
          <LoaderCircle className="h-3 w-3 animate-spin" />
        </div>

        <div className="flex items-center gap-1 text-muted-foreground">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            />
            <div
              className="w-2 h-2 bg-current rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
          </div>
          <span className="text-xs ml-2">
            {t("chat.message.thinking", "Pensando...")}
          </span>
        </div>
      </div>
    </div>
  );
};