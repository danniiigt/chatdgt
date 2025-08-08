"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DrawerDialog,
  DrawerDialogContent,
  DrawerDialogDescription,
  DrawerDialogFooter,
  DrawerDialogHeader,
  DrawerDialogTitle,
  DrawerDialogTrigger,
} from "@/components/ui/drawer-dialog";
import { useTranslate } from "@tolgee/react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteChatDialogProps {
  chatId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export const DeleteChatDialog = ({ chatId, open: externalOpen, onOpenChange: externalOnOpenChange, showTrigger = true }: DeleteChatDialogProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const router = useRouter();
  const queryClient = useQueryClient();

  // State
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const isOpen = externalOpen !== undefined ? externalOpen : internalIsOpen;
  const setIsOpen = externalOnOpenChange || setInternalIsOpen;

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
      
      // Close dialog and redirect to homepage
      setIsOpen(false);
      router.push("/");
      
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

  // Constants
  const hideDeleteChat = !chatId;

  // Conditional rendering
  if (hideDeleteChat) return null;

  return (
    <DrawerDialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DrawerDialogTrigger asChild>
          <Button
            variant="ghost"
            className="text-red-500 hover:text-red-700"
            title={t("chat.delete", "Eliminar")}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DrawerDialogTrigger>
      )}
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>
            {t("chat.delete.confirm.title", "Eliminar conversación")}
          </DrawerDialogTitle>
          <DrawerDialogDescription>
            {t(
              "chat.delete.confirm.description",
              "Esta acción no se puede deshacer. La conversación y todos sus mensajes serán eliminados permanentemente."
            )}
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <DrawerDialogFooter>
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
        </DrawerDialogFooter>
      </DrawerDialogContent>
    </DrawerDialog>
  );
};
