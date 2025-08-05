"use client";

import { useState } from "react";
import { Mic, Paperclip, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/ui/ModelSelector";
import { useTranslate } from "@tolgee/react";

interface ChatInputProps {
  chatId?: string;
  sendMessage: (
    message: string,
    chatId?: string,
    model?: string
  ) => Promise<void>;
  isLoading: boolean;
}

export const ChatInput = ({
  chatId,
  sendMessage,
  isLoading,
}: ChatInputProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("gpt-4o-mini");
  const [isRecording, setIsRecording] = useState(false);

  // Helpers / Functions
  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const messageToSend = message.trim();
    setMessage(""); // Clear input immediately for better UX

    try {
      await sendMessage(messageToSend, chatId, selectedModel);
    } catch (error) {
      // Error handling is done in the useChat hook
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 pb-8 pt-0">
      {/* Chat input box */}
      <div className="relative">
        <div className="flex flex-col p-4 border border-gray-200 rounded-4xl shadow-xs bg-white dark:bg-foreground/5 dark:border-foreground/10">
          {/* Top row - Input and buttons */}
          <div className="flex items-center gap-3 flex-1">
            {/* Text input */}
            <div className="flex-1 max-h-32">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={t(
                  "chat.input-placeholder",
                  "¿Por dónde deberíamos empezar?"
                )}
                className="w-full resize-none bg-transparent border-none outline-none text-base leading-6 placeholder:text-gray-500 dark:placeholder:text-gray-400 py-2 pl-2"
                rows={1}
                style={{
                  minHeight: "40px",
                  height: "auto",
                }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "40px";
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>

            {/* Right side buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Voice button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVoiceRecord}
                className={`size-8 rounded-full ${
                  isRecording
                    ? "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Mic className="size-4" />
              </Button>

              {/* Send button */}
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="icon"
                className="h-8 w-8 rounded-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {isLoading ? (
                  <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUp className="size-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Bottom row - Model selector (compact) */}
          <div className="flex items-center">
            {/* Attach button */}
            <Button
              variant="ghost"
              size="icon"
              className="size-8 shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-accent-foreground text-muted-foreground"
            >
              <Paperclip className="size-4" />
            </Button>

            <ModelSelector
              onModelChange={handleModelChange}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
