"use client";

import { Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Chat } from "@/hooks/useChatList";
import { useIsBookmarked } from "@/hooks/useIsBookmarked";

interface BookmarkButtonProps {
  chatId: string;
  isBookmarked?: boolean;
  chat?: Chat;
}

export const BookmarkButton = ({ chatId, isBookmarked: isBookmarkedProp = false, chat }: BookmarkButtonProps) => {
  // Third party hooks
  const queryClient = useQueryClient();
  
  // Custom hooks
  const isBookmarkedFromQuery = useIsBookmarked(chatId);
  
  // Constants
  const isBookmarked = isBookmarkedProp || isBookmarkedFromQuery;

  // Functions
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
      const previousBookmarkedChats = queryClient.getQueryData<Chat[]>(["bookmarkedChats"]);
      const previousChats = queryClient.getQueryData<Chat[]>(["chats"]);

      // Use the provided chat object or find it in the queries
      const chatFromBookmarks = previousBookmarkedChats?.find(c => c.id === chatId);
      const chatFromChats = previousChats?.find(c => c.id === chatId);
      const targetChat = chat || chatFromBookmarks || chatFromChats;

      if (targetChat) {
        if (isBookmarked) {
          // Remove from bookmarks (unbookmark)
          queryClient.setQueryData<Chat[]>(["bookmarkedChats"], (old) => 
            old?.filter(chat => chat.id !== chatId) || []
          );
        } else {
          // Add to bookmarks
          queryClient.setQueryData<Chat[]>(["bookmarkedChats"], (old) => 
            old ? [targetChat, ...old] : [targetChat]
          );
        }
      }

      return { previousBookmarkedChats, previousChats };
    },
    onError: (err, chatId, context) => {
      // Roll back optimistic updates
      if (context?.previousBookmarkedChats) {
        queryClient.setQueryData(["bookmarkedChats"], context.previousBookmarkedChats);
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

  const handleBookmarkToggle = () => {
    bookmarkMutation.mutate(chatId);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-6 w-6 p-0 hover:bg-transparent ${
        isBookmarked
          ? "text-blue-500 hover:text-blue-600"
          : "text-muted-foreground hover:text-foreground/80"
      }`}
      onClick={handleBookmarkToggle}
      disabled={bookmarkMutation.isPending}
    >
      <Bookmark className={`h-3 w-3 ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
};