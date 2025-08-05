"use client";

import { Badge } from "@/components/ui/badge";
import { useTranslate } from "@tolgee/react";
import { MessageActions } from "./MessageActions";

interface MessageHeaderProps {
  isUser: boolean;
  isAssistant: boolean;
  messageModel?: string;
  messageCreatedAt: string;
  messageContent: string;
  messageId: string;
  currentSpeakingId: string | null;
  isCopied: boolean;
  onSpeak: (text: string, messageId: string) => void;
  onCopy: (text: string) => void;
}

export const MessageHeader = ({
  isUser,
  isAssistant,
  messageModel,
  messageCreatedAt,
  messageContent,
  messageId,
  currentSpeakingId,
  isCopied,
  onSpeak,
  onCopy,
}: MessageHeaderProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {isUser
            ? t("chat.message.you", "Tú")
            : t("chat.message.assistant", "Asistente")}
        </span>
        {isAssistant && messageModel && (
          <Badge variant="secondary" className="text-xs">
            {messageModel}
          </Badge>
        )}
        <span className="text-xs text-muted-foreground">
          {formatTime(messageCreatedAt)}
        </span>
      </div>

      <MessageActions
        isAssistant={isAssistant}
        messageContent={messageContent}
        messageId={messageId}
        currentSpeakingId={currentSpeakingId}
        isCopied={isCopied}
        onSpeak={onSpeak}
        onCopy={onCopy}
      />
    </div>
  );
};