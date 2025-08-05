"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@tolgee/react";
import { Share, LoaderCircle, Info, Link2, Copy, Check } from "lucide-react";
import { Icons } from "@/components/ui/icons";
import { toast } from "sonner";

interface ShareChatDialogProps {
  chatId?: string;
}

interface ShareResponse {
  success: boolean;
  data: {
    shareUrl: string;
    shareToken: string;
    expiresAt: string | null;
    isActive: boolean;
  };
}

export const ShareChatDialog = ({ chatId }: ShareChatDialogProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>("");
  const [isShared, setIsShared] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Constants
  const hideShareChat = !chatId;

  // Data fetching
  const createShareMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch(`/api/chat/${chatId}/share`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Error al crear el enlace compartido"
        );
      }

      const data: ShareResponse = await response.json();
      return data.data;
    },
    onSuccess: (data) => {
      setShareUrl(data.shareUrl);
      setIsShared(true);
    },
    onError: (error: Error) => {
      console.error("Error creating share link:", error);
      toast.error(
        t("chat.share-dialog.error", "Error al crear el enlace compartido")
      );
    },
  });

  // Helpers / Functions
  const handleCreateShare = () => {
    if (!chatId) return;
    createShareMutation.mutate(chatId);
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      // TODO: Show error toast
    }
  };

  const handleSocialShare = (platform: string) => {
    if (!shareUrl) return;

    const encodedUrl = encodeURIComponent(shareUrl);
    let shareLink = "";

    switch (platform) {
      case "linkedin":
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "reddit":
        shareLink = `https://reddit.com/submit?url=${encodedUrl}`;
        break;
      case "x":
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}`;
        break;
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "noopener,noreferrer");
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setIsShared(false);
      setShareUrl("");
      setIsCopied(false);
    }
  };

  // Conditional rendering
  if (hideShareChat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" title={t("chat.share", "Compartir")}>
          <Share className="h-4 w-4" />
          <span>{t("chat.share", "Compartir")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isShared
              ? t("chat.share-dialog.created-title", "Enlace público creado")
              : t(
                  "chat.share-dialog.title",
                  "Compartir el enlace público al chat"
                )}
          </DialogTitle>
        </DialogHeader>

        {!isShared ? (
          <>
            {/* Warning section */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t(
                      "chat.share-dialog.description",
                      "Esta conversación puede incluir información personal."
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "chat.share-dialog.warning",
                      "Tómate un momento para comprobar el contenido antes de compartir el enlace."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy notice */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t(
                  "chat.share-dialog.privacy-notice",
                  "Tu nombre, las instrucciones personalizadas y cualquier mensaje que añadas después de compartir serán privados."
                )}
              </p>

              {/* Create link button */}
              <Button
                onClick={handleCreateShare}
                disabled={createShareMutation.isPending}
                className="w-full"
              >
                {createShareMutation.isPending ? (
                  <>
                    <LoaderCircle className="mr-1 h-4 w-4 animate-spin" />
                    {t("chat.share-dialog.create-link", "Crear enlace")}
                  </>
                ) : (
                  <>
                    <Link2 className="mr-1 h-4 w-4" />
                    {t("chat.share-dialog.create-link", "Crear enlace")}
                  </>
                )}
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Success message */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t(
                      "chat.share-dialog.description",
                      "Esta conversación puede incluir información personal."
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "chat.share-dialog.warning",
                      "Tómate un momento para comprobar el contenido antes de compartir el enlace."
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Success notice */}
            <p className="text-sm text-muted-foreground">
              {t(
                "chat.share-dialog.success-message",
                "Se ha creado un enlace público a tu chat. Gestiona los chats compartidos previamente en cualquier momento a través de la configuración."
              )}
            </p>

            {/* URL display and copy */}
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono truncate">{shareUrl}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {isCopied ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    {t("chat.share-dialog.copied", "¡Enlace copiado!")}
                  </>
                ) : (
                  <>
                    <Icons.copy className="mr-1 h-4 w-4" />
                    {t("chat.share-dialog.copy-link", "Copiar enlace")}
                  </>
                )}
              </Button>
            </div>

            {/* Social sharing buttons */}
            <div className="flex justify-center gap-4 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialShare("linkedin")}
                className="flex flex-col items-center gap-1 h-auto py-3 px-4 aspect-square w-20"
              >
                <Icons.linkedin className="h-5 w-5" />
                <span className="text-xs">
                  {t("chat.social.linkedin", "LinkedIn")}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialShare("reddit")}
                className="flex flex-col items-center gap-1 h-auto py-3 px-4 aspect-square w-20"
              >
                <Icons.reddit className="h-5 w-5" />
                <span className="text-xs">
                  {t("chat.social.reddit", "Reddit")}
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialShare("x")}
                className="flex flex-col items-center gap-1 h-auto py-3 px-4 aspect-square w-20"
              >
                <Icons.x className="h-5 w-5" />
                <span className="text-xs">{t("chat.social.x", "X")}</span>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
