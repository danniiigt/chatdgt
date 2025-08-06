"use client";

import { useTranslate } from "@tolgee/react";
import { Archive } from "lucide-react";

interface ArchivedChatEmptyStateProps {
  hasSearchTerm: boolean;
}

export const ArchivedChatEmptyState = ({
  hasSearchTerm,
}: ArchivedChatEmptyStateProps) => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="flex-1 flex items-center justify-center py-36">
      <div className="text-center">
        <Archive
          className="size-12 text-muted-foreground mx-auto mb-2"
          strokeWidth={1.5}
        />
        <h3 className="text-lg font-medium">
          {hasSearchTerm
            ? t("chat.search.no-results", "No se encontraron chats")
            : t("chat.archived.empty", "No hay chats archivados")}
        </h3>
        <p className="text-sm text-muted-foreground">
          {hasSearchTerm
            ? t(
                "chat.search.try-different",
                "Intenta con otros términos de búsqueda"
              )
            : t(
                "chat.archived.empty-description",
                "Los chats archivados aparecerán aquí"
              )}
        </p>
      </div>
    </div>
  );
};