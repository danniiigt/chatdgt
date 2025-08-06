"use client";

import { useTranslate } from "@tolgee/react";
import { Input } from "@/components/ui/input";
import { Search, Archive } from "lucide-react";

interface ArchivedChatHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  chatCount: number;
}

export const ArchivedChatHeader = ({
  searchTerm,
  onSearchChange,
  chatCount,
}: ArchivedChatHeaderProps) => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Archive className="size-5 text-muted-foreground" />
          <h1 className="text-lg font-semibold">
            {t("chat.archived-chats", "Chats archivados")}
          </h1>
          <span className="text-sm text-muted-foreground">
            ({chatCount})
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder={t(
              "chat.search.placeholder",
              "Buscar chats archivados..."
            )}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};