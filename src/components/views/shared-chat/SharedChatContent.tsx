"use client";

import { useTranslate } from "@tolgee/react";
import { SharedChatHeader } from "./SharedChatHeader";
import { SharedChatMessage } from "./SharedChatMessage";

interface SharedChatData {
  id: string;
  title: string;
  created_at: string;
  messages: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    created_at: string;
  }>;
  model: string;
  isValid: boolean;
}

interface SharedChatContentProps {
  chatData: SharedChatData;
}

export const SharedChatContent = ({ chatData }: SharedChatContentProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <SharedChatHeader
        title={chatData.title}
        createdAt={chatData.created_at}
        model={chatData.model}
        formatDate={formatDate}
      />

      {/* Chat Messages */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {chatData.messages.map((message) => (
            <SharedChatMessage
              key={message.id}
              message={message}
              formatDate={formatDate}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            {t("shared-chat.footer", "Esta conversación fue compartida desde")}{" "}
            ChatDGT
          </p>
        </div>
      </footer>
    </div>
  );
};