"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { Message } from "@/types/message";
import { MessageBubble } from "./MessageBubble";
import { LoadingMessage } from "./LoadingMessage";
import { MessageSkeletonList } from "./MessageSkeleton";

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
  onMessageSelect?: (message: string) => void;
}

export const MessageList = ({
  messages,
  isLoading,
  className,
  onMessageSelect,
}: MessageListProps) => {
  // Custom hooks
  const { currentSpeakingId, speakText } = useSpeechSynthesis();

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Effects
  useEffect(
    function scrollToBottom() {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    [messages, isLoading]
  );

  // Conditional rendering
  if (messages.length === 0 && isLoading) {
    return (
      <div className={cn("flex-1", className)}>
        <MessageSkeletonList count={5} />
      </div>
    );
  }

  return (
    <div className={cn("flex-1", className)}>
      <div className="space-y-3 sm:space-y-4 p-4 px-3.5 sm:px-4 sm:pt-6">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <MessageBubble
              message={message}
              currentSpeakingId={currentSpeakingId}
              onSpeak={speakText}
            />
          </div>
        ))}

        {isLoading && <LoadingMessage />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
