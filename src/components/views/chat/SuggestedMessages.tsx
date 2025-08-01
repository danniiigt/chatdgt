"use client";

import { useMemo } from "react";
import { suggestedMessages } from "@/lib/constants";
import { useTranslate } from "@tolgee/react";

interface SuggestedMessagesProps {
  onMessageSelect?: (message: string) => void;
  isLoading?: boolean;
}

export const SuggestedMessages = ({ onMessageSelect, isLoading = false }: SuggestedMessagesProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const getRandomMessages = () => {
    const shuffled = [...suggestedMessages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  const handleSuggestedMessageClick = (messageText: string) => {
    if (onMessageSelect) {
      onMessageSelect(messageText);
    }
  };

  // Constants - Memoized to prevent re-generation on every render
  const randomMessages = useMemo(() => getRandomMessages(), []);

  return (
    <div className="w-full h-full max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {randomMessages.map((message, index) => (
          <button
            key={index}
            className="border rounded-2xl p-5 text-left hover:bg-muted/50 transition-colors duration-200 group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSuggestedMessageClick(t(message.key, message.keyFallback))}
            disabled={isLoading}
          >
            <h3 className="text-sm text-foreground/80 group-hover:text-foreground leading-relaxed">
              {t(message.key, message.keyFallback)}
            </h3>
          </button>
        ))}
      </div>
    </div>
  );
};
