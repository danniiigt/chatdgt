"use client";

import { useTranslate } from "@tolgee/react";
import { Input } from "@/components/ui/input";
import { Search, Archive } from "lucide-react";

export const ArchivedChatsSkeletonLoader = () => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <div className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Archive className="size-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold">
              {t("chat.archived-chats", "Chats archivados")}
            </h1>
            <div className="w-4 h-4 bg-muted rounded animate-pulse" />
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder={t(
                "chat.search.placeholder",
                "Buscar chats archivados..."
              )}
              value=""
              disabled
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* List Skeleton */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-2">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border animate-pulse"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Icon skeleton */}
                <div className="size-6 bg-muted rounded flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-1">
                  {/* Title skeleton */}
                  <div 
                    className="h-4 bg-muted rounded"
                    style={{ 
                      width: `${Math.random() * 40 + 40}%` // Random width between 40-80%
                    }}
                  />
                  {/* Date skeleton */}
                  <div className="h-3 bg-muted/70 rounded w-32" />
                </div>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex items-center gap-1">
                <div className="h-8 w-8 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};