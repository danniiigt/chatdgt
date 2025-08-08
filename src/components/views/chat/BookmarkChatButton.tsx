"use client";

import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Chat } from "@/hooks/useChatList";
import { useIsBookmarked } from "@/hooks/useIsBookmarked";
import { useTranslate } from "@tolgee/react";

interface BookmarkChatButtonProps {
  chatId?: string;
}

export const BookmarkChatButton = ({ chatId }: BookmarkChatButtonProps) => {
  // Third party hooks
  const queryClient = useQueryClient();
  const { t } = useTranslate();

  // Custom hooks
  const isBookmarked = useIsBookmarked(chatId || "");

  // Mutation
  const bookmarkMutation = useMutation({
    mutationFn: async (chatId: string) => {
      const response = await fetch("/api/chat/bookmark", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle bookmark");
      }

      return response.json();
    },
    onMutate: async (chatId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["bookmarkedChats"] });
      await queryClient.cancelQueries({ queryKey: ["chats"] });

      // Snapshot the previous values
      const previousBookmarkedChats = queryClient.getQueryData<Chat[]>([
        "bookmarkedChats",
      ]);
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      // Get the chat data - try to find it from existing queries
      const chatFromBookmarks = previousBookmarkedChats?.find(
        (c) => c.id === chatId
      );
      const chatFromChats = previousChats?.find((c) => c.id === chatId);

      // Try to get from current chat query cache if available
      const currentChatFromCache = queryClient.getQueryData(["chat", chatId]);
      const targetChat =
        currentChatFromCache || chatFromBookmarks || chatFromChats;

      if (targetChat) {
        if (isBookmarked) {
          // Remove from bookmarks (unbookmark)
          queryClient.setQueryData<Chat[]>(
            ["bookmarkedChats"],
            (old) => old?.filter((chat) => chat.id !== chatId) || []
          );
        } else {
          // Add to bookmarks
          queryClient.setQueryData<Chat[]>(
            ["bookmarkedChats"],
            (old: Chat[] | undefined): Chat[] =>
              old ? [targetChat as Chat, ...old] : [targetChat as Chat]
          );
        }
      }

      return { previousBookmarkedChats, previousChats };
    },
    onError: (err, _, context) => {
      // Roll back optimistic updates
      if (context?.previousBookmarkedChats) {
        queryClient.setQueryData(
          ["bookmarkedChats"],
          context.previousBookmarkedChats
        );
      }
      if (context?.previousChats) {
        queryClient.setQueryData(["chats"], context.previousChats);
      }
      console.error("Error toggling bookmark:", err);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["bookmarkedChats"] });
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  // Helpers / Functions
  const handleBookmarkToggle = () => {
    if (!chatId) return;
    bookmarkMutation.mutate(chatId);
  };

  // Constants
  const hideBookmarkButton = !chatId;

  // Conditional rendering
  if (hideBookmarkButton) return null;

  return (
    <Button
      variant="ghost"
      size="icon"
      className={isBookmarked ? "text-blue-500 hover:text-blue-600" : ""}
      onClick={handleBookmarkToggle}
      title={
        isBookmarked
          ? t("chat.bookmark.remove", "Quitar de guardados")
          : t("chat.bookmark.add", "Guardar chat")
      }
    >
      <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
};
