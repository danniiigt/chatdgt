"use client";

import { Button } from "@/components/ui/button";
import { useTranslate } from "@tolgee/react";
import {
  CheckCheck,
  Copy,
  Volume2,
  VolumeX,
} from "lucide-react";

interface MessageActionsProps {
  isAssistant: boolean;
  messageContent: string;
  messageId: string;
  currentSpeakingId: string | null;
  isCopied: boolean;
  onSpeak: (text: string, messageId: string) => void;
  onCopy: (text: string) => void;
}

export const MessageActions = ({
  isAssistant,
  messageContent,
  messageId,
  currentSpeakingId,
  isCopied,
  onSpeak,
  onCopy,
}: MessageActionsProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Constants
  const isSpeaking = currentSpeakingId === messageId;

  return (
    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {isAssistant && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => onSpeak(messageContent, messageId)}
          title={
            isSpeaking
              ? t("chat.message.stopSpeaking", "Parar reproducción")
              : t("chat.message.speak", "Escuchar mensaje")
          }
        >
          {isSpeaking ? (
            <VolumeX className="h-3 w-3 text-blue-600" />
          ) : (
            <Volume2 className="h-3 w-3" />
          )}
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={() => onCopy(messageContent)}
        title={t("chat.message.copy", "Copiar mensaje")}
      >
        {isCopied ? (
          <CheckCheck className="h-3 w-3" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};