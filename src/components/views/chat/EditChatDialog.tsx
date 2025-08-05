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
import { Label } from "@/components/ui/label";
import { useTranslate } from "@tolgee/react";
import { LoaderCircle, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface EditChatDialogProps {
  chatId: string;
  currentTitle: string;
}

export const EditChatDialog = ({
  chatId,
  currentTitle,
}: EditChatDialogProps) => {
  // Third party hooks
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  // Data fetching
  const updateChatMutation = useMutation({
    mutationFn: async (data: { chatId: string; title: string }) => {
      const response = await fetch(`/api/chat/${data.chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: data.title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el título");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate chat list query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });
      
      // Close dialog
      setIsOpen(false);
      
      toast.success(
        t("chat.edit.success", "Título actualizado correctamente")
      );
    },
    onError: (error: Error) => {
      console.error("Error updating chat title:", error);
      toast.error(
        t("chat.edit.error", "Error al actualizar el título")
      );
    },
  });

  // Helpers / Functions
  const handleEditChat = () => {
    if (!chatId || !title.trim()) return;
    updateChatMutation.mutate({ chatId, title: title.trim() });
  };

  const handleCancel = () => {
    setTitle(currentTitle);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground/80 hover:bg-transparent"
          title={t("chat.edit", "Editar")}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("chat.edit.title", "Editar nombre del chat")}
          </DialogTitle>
          <DialogDescription>
            {t(
              "chat.edit.description",
              "Cambia el nombre de esta conversación para identificarla más fácilmente."
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chat-title">{t("chat.title", "Título")}</Label>
            <Input
              id="chat-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t(
                "chat.title.placeholder",
                "Escribe el nombre del chat..."
              )}
              disabled={updateChatMutation.isPending}
              maxLength={100}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleEditChat();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={updateChatMutation.isPending}>
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button
            onClick={handleEditChat}
            disabled={
              updateChatMutation.isPending || !title.trim() || title.trim() === currentTitle
            }
          >
            {updateChatMutation.isPending ? (
              <>
                {t("chat.edit.saving", "Guardando")}
                <LoaderCircle className="size-4 animate-spin" />
              </>
            ) : (
              t("chat.edit.save", "Guardar")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
