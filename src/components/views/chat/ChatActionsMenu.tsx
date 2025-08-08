"use client";

import { Ellipsis, Share, Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate } from "@tolgee/react";
import { ShareChatDialog } from "./ShareChatDialog";
import { ArchiveChatDialog } from "./ArchiveChatDialog";
import { DeleteChatDialog } from "./DeleteChatDialog";
import { useState } from "react";

interface ChatActionsMenuProps {
  chatId?: string;
}

export const ChatActionsMenu = ({ chatId }: ChatActionsMenuProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Constants
  const hideMenu = !chatId;

  // Conditional rendering
  if (hideMenu) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title={t("chat.actions.more", "Más opciones")}
          >
            <Ellipsis className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setShareDialogOpen(true)}>
            <Share className="h-4 w-4 mr-2" />
            {t("chat.share", "Compartir")}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setArchiveDialogOpen(true)}>
            <Archive className="h-4 w-4 mr-2" />
            {t("chat.archive", "Archivar")}
          </DropdownMenuItem>

          <DropdownMenuItem onSelect={() => setDeleteDialogOpen(true)}>
            <Trash2 className="h-4 w-4 mr-2 text-red-500" />
            <span className="text-red-500">{t("chat.delete", "Eliminar")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      <ShareChatDialog
        chatId={chatId}
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        showTrigger={false}
      />
      <ArchiveChatDialog
        chatId={chatId}
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        showTrigger={false}
      />
      <DeleteChatDialog
        chatId={chatId}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        showTrigger={false}
      />
    </>
  );
};