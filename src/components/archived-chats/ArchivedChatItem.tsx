"use client";

import { useTranslate } from "@tolgee/react";
import { Button } from "@/components/ui/button";
import { 
  LoaderCircle,
  ArchiveRestore,
  Trash2,
  MessagesSquare
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { UseMutationResult } from "@tanstack/react-query";

type Chat = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_archived: boolean;
  system_prompt: string | null;
};

interface ArchivedChatItemProps {
  chat: Chat;
  unarchiveMutation: UseMutationResult<Chat, Error, string, unknown>;
  onDelete: (chatId: string, chatTitle: string) => void;
}

export const ArchivedChatItem = ({
  chat,
  unarchiveMutation,
  onDelete,
}: ArchivedChatItemProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const handleUnarchive = () => {
    unarchiveMutation.mutate(chat.id);
  };

  const handleDelete = () => {
    onDelete(chat.id, chat.title || t("chat.untitled", "Sin título"));
  };

  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <MessagesSquare className="size-6 text-muted-foreground flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">
            {chat.title || t("chat.untitled", "Sin título")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("chat.archived.date", "Archivado")}{" "}
            {formatDistanceToNow(new Date(chat.updated_at), {
              addSuffix: true,
              locale: es,
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={handleUnarchive}
          disabled={unarchiveMutation.isPending}
          title={t("chat.restore", "Restaurar")}
        >
          {unarchiveMutation.isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : (
            <ArchiveRestore className="size-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          onClick={handleDelete}
          title={t("chat.delete.permanent", "Eliminar permanentemente")}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
};