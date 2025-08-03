"use client";

import { MessageList } from "@/components/chat/MessageList";

// Types
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  tokens?: number;
  model?: string;
  created_at: string;
}

interface ChatViewProps {
  messages: Message[];
  isLoading: boolean;
  isStreaming?: boolean;
  error: string | null;
  onMessageSelect?: (message: string) => void;
}

export const ChatView = ({ messages, isLoading, isStreaming, error, onMessageSelect }: ChatViewProps) => {
  // Conditional rendering
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-medium mb-2">Error al cargar la conversación</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <MessageList 
      messages={messages} 
      isLoading={isLoading}
      isStreaming={isStreaming}
      className="flex-1"
      onMessageSelect={onMessageSelect}
    />
  );
};