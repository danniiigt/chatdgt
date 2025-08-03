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
import { Label } from "@/components/ui/label";
import { useTranslate } from "@tolgee/react";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [isEditing, setIsEditing] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  // Helpers / Functions
  const handleEditChat = async () => {
    if (!chatId || !title.trim()) return;

    setIsEditing(true);

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el título");
      }

      // Invalidate chat list query to update sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      queryClient.invalidateQueries({ queryKey: ["chat", chatId] });

      // Close dialog
      setIsOpen(false);
    } catch (error) {
      console.error("Error updating chat title:", error);
    } finally {
      setIsEditing(false);
    }
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
              disabled={isEditing}
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
          <Button variant="outline" onClick={handleCancel} disabled={isEditing}>
            {t("common.cancel", "Cancelar")}
          </Button>
          <Button
            onClick={handleEditChat}
            disabled={
              isEditing || !title.trim() || title.trim() === currentTitle
            }
          >
            {isEditing ? (
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
