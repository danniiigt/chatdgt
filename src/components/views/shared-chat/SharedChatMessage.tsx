"use client";

import { useTranslate } from "@tolgee/react";
import { MarkdownRenderer } from "@/components/chat/MarkdownRenderer";

interface SharedChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  created_at: string;
}

interface SharedChatMessageProps {
  message: SharedChatMessage;
  formatDate: (date: string) => string;
}

export const SharedChatMessage = ({
  message,
  formatDate,
}: SharedChatMessageProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Constants
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={`flex gap-4 ${
        isAssistant ? "bg-muted/30" : ""
      } rounded-lg p-4`}
    >
      <div className="shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          }`}
        >
          {isUser ? "U" : "AI"}
        </div>
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <p className="font-medium text-sm">
            {isUser
              ? t("shared-chat.user", "Usuario")
              : "ChatDGT"}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(message.created_at)}
          </p>
        </div>
        <div>
          {isAssistant ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <p className="whitespace-pre-wrap break-words">
              {message.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};