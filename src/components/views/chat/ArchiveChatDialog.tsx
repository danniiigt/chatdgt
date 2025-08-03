"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Archive, LoaderCircle } from "lucide-react";

interface ArchiveChatDialogProps {
  chatId?: string;
}

export const ArchiveChatDialog = ({ chatId }: ArchiveChatDialogProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Helpers / Functions
  const handleArchiveChat = async () => {
    if (!chatId) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${chatId}?action=archive`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al archivar la conversación");
      }

      // Invalidate chat list query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      // Close dialog and redirect to homepage
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error archiving chat:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Constants
  const hideArchiveChat = !chatId;

  // Conditional rendering
  if (hideArchiveChat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title={t("chat.archive", "Archivar")}
        >
          <Archive className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("chat.archive.confirm.title", "Archivar conversación")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "chat.archive.confirm.description",
              "Esta acción no se puede deshacer. La conversación y todos sus mensajes serán archivados permanentemente."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button onClick={handleArchiveChat} disabled={isLoading}>
            {isLoading ? (
              <>
                {t("chat.archive.archiving", "Archivando")}
                <LoaderCircle className="size-4 animate-spin" />
              </>
            ) : (
              t("chat.archive", "Archivar")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
