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
import { LoaderCircle, Trash2 } from "lucide-react";

interface DeleteChatDialogProps {
  chatId?: string;
}

export const DeleteChatDialog = ({ chatId }: DeleteChatDialogProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Helpers / Functions
  const handleDeleteChat = async () => {
    if (!chatId) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la conversación");
      }

      // Invalidate chat list query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      // Close dialog and redirect to homepage
      setIsOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Error deleting chat:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Constants
  const hideDeleteChat = !chatId;

  // Conditional rendering
  if (hideDeleteChat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-500 hover:text-red-700"
          title={t("chat.delete", "Eliminar")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("chat.delete.confirm.title", "Eliminar conversación")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "chat.delete.confirm.description",
              "Esta acción no se puede deshacer. La conversación y todos sus mensajes serán eliminados permanentemente."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isDeleting}
          >
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteChat}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                {t("chat.delete.deleting", "Eliminando")}
                <LoaderCircle className="size-4 animate-spin" />
              </>
            ) : (
              t("chat.delete", "Eliminar")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
