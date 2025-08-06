"use client";

import { useTranslate } from "@tolgee/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoaderCircle } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface DeleteDialogState {
  isOpen: boolean;
  chatId: string | null;
  chatTitle: string;
}

interface DeleteArchivedChatDialogProps {
  deleteDialog: DeleteDialogState;
  setDeleteDialog: (state: DeleteDialogState) => void;
  deleteMutation: UseMutationResult<boolean, Error, string, unknown>;
}

export const DeleteArchivedChatDialog = ({
  deleteDialog,
  setDeleteDialog,
  deleteMutation,
}: DeleteArchivedChatDialogProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const handleDeleteConfirm = () => {
    if (deleteDialog.chatId) {
      deleteMutation.mutate(deleteDialog.chatId, {
        onSuccess: () => {
          handleClose();
        },
      });
    }
  };

  const handleClose = () => {
    setDeleteDialog({ isOpen: false, chatId: null, chatTitle: "" });
  };

  return (
    <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => 
      setDeleteDialog(prev => ({ ...prev, isOpen: open }))
    }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("chat.delete.permanent.title", "Eliminar permanentemente")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "chat.delete.permanent.description",
              "¿Estás seguro de que quieres eliminar permanentemente este chat? Esta acción no se puede deshacer."
            )}
            <br />
            <strong>"{deleteDialog.chatTitle}"</strong>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={deleteMutation.isPending}
          >
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteConfirm}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? (
              <>
                <LoaderCircle className="size-4 animate-spin mr-2" />
                {t("chat.delete.deleting", "Eliminando...")}
              </>
            ) : (
              t("chat.delete.permanent", "Eliminar permanentemente")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};