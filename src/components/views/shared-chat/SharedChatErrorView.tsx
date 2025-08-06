"use client";

import { useTranslate } from "@tolgee/react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SharedChatErrorViewProps {
  error: string;
}

export const SharedChatErrorView = ({ error }: SharedChatErrorViewProps) => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <MessageSquare className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            {t("shared-chat.error.title", "Conversación no disponible")}
          </h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button asChild>
          <a href="/">{t("shared-chat.go-home", "Ir al inicio")}</a>
        </Button>
      </div>
    </div>
  );
};