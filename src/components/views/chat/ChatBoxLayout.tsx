"use client";

import { PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { ChatInput } from "./ChatInput";
import { ShareChatDialog } from "./ShareChatDialog";
import { DeleteChatDialog } from "./DeleteChatDialog";
import { ArchiveChatDialog } from "./ArchiveChatDialog";

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
  const { open, setOpen } = useSidebar();

  // Helpers / Functions
  const handleToggleSidebar = () => {
    setOpen(!open);
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between py-0 px-4 h-14 border-b 2xl:border-b-0 2xl:absolute 2xl:top-0 2xl:inset-x-0">
        {/* Left side - Sidebar toggle (only show when sidebar is closed) */}
        <div className="flex items-center">
          {!open && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="mr-1"
            >
              <PanelLeftOpen
                className="size-5 text-muted-foreground"
                strokeWidth={1.25}
              />
            </Button>
          )}

          <h3 className="text-lg font-medium">ChatDGT</h3>
        </div>

        {/* Center - Chat status indicator (optional) */}
        <div className="flex items-center">
          {/* TODO: Add chat status indicator if needed */}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-x-1.5">
          <ShareChatDialog chatId={chatId} />
          <ArchiveChatDialog chatId={chatId} />
          <DeleteChatDialog chatId={chatId} />
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
