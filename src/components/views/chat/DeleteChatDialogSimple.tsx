"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteChatDialogSimpleProps {
  chatId: string;
  chatTitle: string;
}

export const DeleteChatDialogSimple = ({
  chatId,
  chatTitle,
}: DeleteChatDialogSimpleProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  // State
  const [isOpen, setIsOpen] = useState(false);

  // Data fetching
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al eliminar la conversación");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate chat list query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      
      // Close dialog
      setIsOpen(false);
      
      toast.success(
        t("chat.delete.success", "Conversación eliminada correctamente")
      );
    },
    onError: (error: Error) => {
      console.error("Error deleting chat:", error);
      toast.error(
        t("chat.delete.error", "Error al eliminar la conversación")
      );
    },
  });

  // Helpers / Functions
  const handleDeleteChat = () => {
    if (!chatId) return;
    deleteChatMutation.mutate(chatId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground/80 hover:bg-transparent"
          title={t("chat.delete", "Eliminar")}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Trash2 className="h-3 w-3" />
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
            disabled={deleteChatMutation.isPending}
          >
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteChat}
            disabled={deleteChatMutation.isPending}
          >
            {deleteChatMutation.isPending ? (
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
