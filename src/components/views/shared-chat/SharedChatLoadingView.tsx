"use client";

import { useTranslate } from "@tolgee/react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const SharedChatLoadingView = () => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-muted-foreground">
          {t("shared-chat.loading", "Cargando conversación...")}
        </p>
      </div>
    </div>
  );
};