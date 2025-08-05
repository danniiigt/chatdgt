"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { useTranslate } from "@tolgee/react";
import { useUser } from "@supabase/auth-helpers-react";
import { randomColor } from "@/lib/constants";

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
  className?: string;
  onMessageSelect?: (message: string) => void;
}

const MessageBubble = ({ message }: { message: Message }) => {
  // Third party hooks
  const { t } = useTranslate();
  const user = useUser();

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
  const fullName = user?.user_metadata?.full_name || "";
  const avatarUrl = user?.user_metadata?.avatar_url || "";
  const userEmail = user?.email || "";
  const userInitials = fullName
    ? fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg transition-colors",
        isUser && "bg-primary/5",
        isAssistant && "bg-transparent"
      )}
    >
      {/* Avatar */}
      <Avatar className="h-8 w-8 shrink-0">
        {isUser ? (
          <>
            <AvatarImage src={avatarUrl} alt={fullName || "Avatar"} />
            <AvatarFallback
              style={{
                backgroundColor: randomColor,
              }}
              className="bg-primary text-primary-foreground text-xs"
            >
              {userInitials}
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
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                // Custom components for better styling
                p: ({ children }) => (
                  <p className="whitespace-pre-wrap break-words m-0 mb-5 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="my-5 ml-4 list-disc space-y-3">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-5 ml-4 list-decimal space-y-3">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="break-words">{children}</li>
                ),
                code: ({ children, className }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                      {children}
                    </code>
                  ) : (
                    <code className={className}>{children}</code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-5">
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-5">
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em className="italic">{children}</em>,
                h1: ({ children }) => (
                  <h1 className="text-lg font-semibold mt-6 mb-3 first:mt-0">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-base font-semibold mt-5 mb-3 first:mt-0">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-sm font-semibold mt-4 mb-2 first:mt-0">
                    {children}
                  </h3>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap break-words m-0">
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
        <div className="space-y-4 p-4 pt-6">
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
      <div className="space-y-4 p-4 pt-6">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <MessageBubble message={message} />
          </div>
        ))}

        {isLoading && <LoadingMessage />}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
