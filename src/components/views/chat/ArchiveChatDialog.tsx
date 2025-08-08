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
import { Archive, LoaderCircle } from "lucide-react";
import { toast } from "sonner";

interface ArchiveChatDialogProps {
  chatId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export const ArchiveChatDialog = ({ chatId, open: externalOpen, onOpenChange: externalOnOpenChange, showTrigger = true }: ArchiveChatDialogProps) => {
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
  const archiveChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/chat/${chatId}?action=archive`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al archivar la conversación");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate chat list query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      // Invalidate archived chats query to update archived page
      queryClient.invalidateQueries({ queryKey: ["archivedChats"] });

      // Close dialog and redirect to homepage
      setIsOpen(false);
      router.push("/");

      toast.success(
        t("chat.archive.success", "Conversación archivada correctamente")
      );
    },
    onError: (error: Error) => {
      console.error("Error archiving chat:", error);
      toast.error(t("chat.archive.error", "Error al archivar la conversación"));
    },
  });

  // Helpers / Functions
  const handleArchiveChat = () => {
    if (!chatId) return;
    archiveChatMutation.mutate(chatId);
  };

  // Constants
  const hideArchiveChat = !chatId;

  // Conditional rendering
  if (hideArchiveChat) return null;

  return (
    <DrawerDialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <DrawerDialogTrigger asChild>
          <Button variant="ghost" title={t("chat.archive", "Archivar")}>
            <Archive className="h-4 w-4" />
          </Button>
        </DrawerDialogTrigger>
      )}
      <DrawerDialogContent>
        <DrawerDialogHeader>
          <DrawerDialogTitle>
            {t("chat.archive.confirm.title", "Archivar conversación")}
          </DrawerDialogTitle>
          <DrawerDialogDescription>
            {t(
              "chat.archive.confirm.description",
              "Esta acción no se puede deshacer. La conversación y todos sus mensajes serán archivados permanentemente."
            )}
          </DrawerDialogDescription>
        </DrawerDialogHeader>
        <DrawerDialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={archiveChatMutation.isPending}
          >
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button
            onClick={handleArchiveChat}
            disabled={archiveChatMutation.isPending}
          >
            {archiveChatMutation.isPending ? (
              <>
                {t("chat.archive.archiving", "Archivando")}
                <LoaderCircle className="size-4 animate-spin" />
              </>
            ) : (
              t("chat.archive", "Archivar")
            )}
          </Button>
        </DrawerDialogFooter>
      </DrawerDialogContent>
    </DrawerDialog>
  );
};
