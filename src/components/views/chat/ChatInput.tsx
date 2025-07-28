"use client";

import { useState } from "react";
import { Plus, Mic, Send, ChevronDown, Paperclip, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@tolgee/react";

export const ChatInput = () => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [message, setMessage] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4o");
  const [isRecording, setIsRecording] = useState(false);

  // Helpers / Functions
  const handleSendMessage = () => {
    if (!message.trim()) return;
    console.log("Sending message:", message);
    setMessage("");
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
    console.log("Voice recording:", !isRecording);
  };

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    console.log("Model changed to:", model);
  };

  // Constants
  const availableModels = [
    "GPT-4o",
    "GPT-4o mini",
    "GPT-4 Turbo",
    "GPT-3.5 Turbo",
  ];

  return (
    <div className="w-full max-w-3xl mx-auto p-4 py-8">
      {/* Chat input box */}
      <div className="relative">
        <div className="flex flex-col p-4 border border-gray-200 rounded-4xl shadow-xs bg-white dark:bg-gray-800 dark:border-gray-700">
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
                disabled={!message.trim()}
                size="icon"
                className="h-8 w-8 rounded-full bg-black text-white hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                <ArrowUp className="size-4" />
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-3 text-xs font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md text-muted-foreground"
                >
                  <span className="mr-1">{selectedModel}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {availableModels.map((model) => (
                  <DropdownMenuItem
                    key={model}
                    onClick={() => handleModelChange(model)}
                    className={
                      model === selectedModel ? "bg-muted font-medium" : ""
                    }
                  >
                    {model}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
