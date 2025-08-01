"use client";

import { Share, Trash2, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslate } from "@tolgee/react";
import { ChatInput } from "./ChatInput";

interface ChatBoxLayoutProps {
  children: React.ReactNode;
  chatId?: string;
  sendMessage: (
    message: string,
    chatId?: string,
    model?: string
  ) => Promise<void>;
  isLoading: boolean;
}

export const ChatBoxLayout = ({
  children,
  chatId,
  sendMessage,
  isLoading,
}: ChatBoxLayoutProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const { open, setOpen } = useSidebar();

  // Helpers / Functions
  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  const handleShareChat = () => {
    // TODO: Implement share chat functionality
    console.log("Share chat");
  };

  const handleDeleteChat = () => {
    // TODO: Implement delete chat functionality
    console.log("Delete chat");
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4">
        {/* Left side - Sidebar toggle (only show when sidebar is closed) */}
        <div className="flex items-center">
          {!open && (
            <Button variant="ghost" size="icon" onClick={handleToggleSidebar}>
              <PanelLeftOpen
                className="size-5 text-muted-foreground"
                strokeWidth={1.25}
              />
            </Button>
          )}
        </div>

        {/* Center - Chat status indicator (optional) */}
        <div className="flex items-center">
          {/* TODO: Add chat status indicator if needed */}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={handleShareChat}
            title={t("chat.share", "Compartir conversacion")}
          >
            <Share className="h-4 w-4" />
            <span>Compartir</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDeleteChat}
            className="h-9 w-9 text-destructive hover:text-destructive"
            title={t("chat.delete", "Eliminar chat")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex-1 w-full h-full max-w-4xl mx-auto">
            {children}
          </div>
        </div>

        {/* Chat input box - Fixed at bottom */}
        <div>
          <ChatInput
            chatId={chatId}
            sendMessage={sendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
