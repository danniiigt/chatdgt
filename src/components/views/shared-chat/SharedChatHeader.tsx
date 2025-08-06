"use client";

import { useTranslate } from "@tolgee/react";
import { Share, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface SharedChatHeaderProps {
  title: string;
  createdAt: string;
  model: string;
  formatDate: (date: string) => string;
}

export const SharedChatHeader = ({
  title,
  createdAt,
  model,
  formatDate,
}: SharedChatHeaderProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const handleShare = async () => {
    try {
      await navigator.share({
        title:
          title || t("shared-chat.default-title", "Conversación compartida"),
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success(
          t("shared-chat.link-copied", "Enlace copiado al portapapeles")
        );
      } catch (clipboardError) {
        console.error("Failed to share or copy:", error, clipboardError);
      }
    }
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold line-clamp-1">{title}</h1>
            <p className="text-sm text-muted-foreground">
              {t("shared-chat.created-on", "Creado el")} {formatDate(createdAt)}{" "}
              • {model}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("shared-chat.share", "Compartir")}
              </span>
            </Button>
            <Button asChild>
              <Link
                prefetch={true}
                href="/"
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {t("shared-chat.try-chatgpt", "Probar ChatDGT")}
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
