"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ChatBoxLayout } from "@/components/views/chat/ChatBoxLayout";
import { NoChatSelectedView } from "@/components/views/chat/NoChatSelectedView";
import { ChatView } from "@/components/views/chat/ChatView";
import { useChat } from "@/hooks/useChat";

const ChatPage = () => {
  // Third party hooks
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");

  // Custom hooks
  const {
    currentChat,
    isLoading,
    error,
    loadMessages,
    sendMessage,
    clearCurrentChat,
  } = useChat();

  // Effects
  useEffect(
    function loadChatMessages() {
      if (chatId) {
        loadMessages(chatId);
      } else {
        // Clear chat state when no chatId (e.g., navigating to /chat without ID)
        clearCurrentChat();
      }
    },
    [chatId, loadMessages, clearCurrentChat]
  );

  return (
    <div className="w-full h-full">
      <ChatBoxLayout
        chatId={chatId || undefined}
        sendMessage={sendMessage}
        isLoading={isLoading}
      >
        {chatId ? (
          <ChatView
            messages={currentChat?.messages || []}
            isLoading={isLoading}
            error={error}
            onMessageSelect={sendMessage}
          />
        ) : (
          <NoChatSelectedView />
        )}
      </ChatBoxLayout>
    </div>
  );
};

export default ChatPage;
