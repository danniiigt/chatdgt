"use client";

import { useUser } from "@supabase/auth-helpers-react";
import { useTranslate } from "@tolgee/react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useClipboard } from "@/hooks/useClipboard";
import { MessageAvatar } from "./MessageAvatar";
import { MessageHeader } from "./MessageHeader";
import { MarkdownRenderer } from "./MarkdownRenderer";

import { Message } from "@/types/message";

interface MessageBubbleProps {
  message: Message;
  currentSpeakingId: string | null;
  onSpeak: (text: string, messageId: string) => void;
}

export const MessageBubble = ({
  message,
  currentSpeakingId,
  onSpeak,
}: MessageBubbleProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const user = useUser();

  // Custom hooks
  const { isCopied, copyToClipboard } = useClipboard();

  // Constants
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const fullName = user?.user_metadata?.full_name || "";
  const avatarUrl = user?.user_metadata?.avatar_url || "";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg transition-colors",
        isUser && "bg-primary/5",
        isAssistant && "bg-transparent"
      )}
    >
      <MessageAvatar
        isUser={isUser}
        userName={fullName}
        userAvatarUrl={avatarUrl}
      />

      <div className="flex-1 space-y-2">
        <MessageHeader
          isUser={isUser}
          isAssistant={isAssistant}
          messageModel={message.model}
          messageCreatedAt={message.created_at}
          messageContent={message.content}
          messageId={message.id}
          currentSpeakingId={currentSpeakingId}
          isCopied={isCopied}
          onSpeak={onSpeak}
          onCopy={copyToClipboard}
        />

        <div>
          {isAssistant ? (
            <MarkdownRenderer content={message.content} />
          ) : (
            <p className="whitespace-pre-wrap break-words m-0">
              {message.content}
            </p>
          )}
        </div>

        {isAssistant && message.tokens && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge variant="outline" className="text-xs">
              {t("chat.message.tokens", "Tokens")}: {message.tokens.toLocaleString()}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};