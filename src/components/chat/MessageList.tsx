"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { TypewriterText } from "@/components/ui/typewriter-text";
import { useTranslate } from "@tolgee/react";

// Types
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  tokens?: number;
  model?: string;
  created_at: string;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  isStreaming?: boolean;
  className?: string;
  onMessageSelect?: (message: string) => void;
}

const MessageBubble = ({ message }: { message: Message }) => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [isCopied, setIsCopied] = useState(false);

  // Helpers / Functions
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Constants
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isStreaming = message.id === "streaming-temp";

  // Detect if this is a new message (created in the last 10 seconds)
  const messageAge = Date.now() - new Date(message.created_at).getTime();
  const isNewMessage = messageAge < 10000; // 10 seconds

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg transition-colors animate-in slide-in-from-bottom-2 fade-in duration-300",
        isUser && "bg-primary/5",
        isAssistant && "bg-transparent"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/user-avatar.png" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              U
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/ai-avatar.png" alt="AI" />
            <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
              AI
            </AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Message Content */}
      <div className="flex-1 space-y-2">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {isUser
                ? t("chat.message.you", "Tú")
                : t("chat.message.assistant", "Asistente")}
            </span>
            {isAssistant && message.model && (
              <Badge variant="secondary" className="text-xs">
                {message.model}
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {formatTime(message.created_at)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => copyToClipboard(message.content)}
              title={t("chat.message.copy", "Copiar mensaje")}
            >
              {isCopied ? (
                <Icons.check className="h-3 w-3 text-green-600" />
              ) : (
                <Icons.copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Message Text */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {isAssistant ? (
            <div className="relative">
              <TypewriterText
                text={message.content}
                isComplete={!isStreaming}
                shouldAnimate={isNewMessage && isAssistant} // Only animate new assistant messages
                speed={10} // 10 chunks/sec for consistency
              />
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words m-0 animate-in fade-in duration-200">
              {message.content}
            </p>
          )}
        </div>

        {/* Metadata */}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {isAssistant && message.tokens && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {t("chat.message.tokens", "Tokens")}:{" "}
                {message.tokens.toLocaleString()}
              </Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingMessage = () => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="flex gap-3 p-4 rounded-lg bg-muted/20">
      {/* AI Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
          AI
        </AvatarFallback>
      </Avatar>

      {/* Loading Content */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {t("chat.message.assistant", "Asistente")}
          </span>
          <Icons.loader className="h-3 w-3 animate-spin" />
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

export const MessageList = ({
  messages,
  isLoading,
  isStreaming,
  className,
  onMessageSelect,
}: MessageListProps) => {
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(
    function scrollToBottom() {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages, isLoading]
  );

  // Show loading skeleton when switching chats
  if (messages.length === 0 && isLoading) {
    return (
      <div className={cn("flex-1", className)}>
        <div className="space-y-4 p-4">
          {/* Show skeleton messages while loading */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-3 p-4 rounded-lg">
              {/* Avatar skeleton */}
              <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse shrink-0" />

              {/* Message content skeleton */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-muted/50 rounded animate-pulse" />
                  <div className="h-3 w-12 bg-muted/30 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
                  {i === 0 && (
                    <div className="h-4 w-1/2 bg-muted/50 rounded animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex-1", className)}>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <MessageBubble message={message} />
          </div>
        ))}

        {isLoading && !isStreaming && <LoadingMessage />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
