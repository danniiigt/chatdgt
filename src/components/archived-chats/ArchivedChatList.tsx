"use client";

import { ArchivedChatItem } from "./ArchivedChatItem";
import { ArchivedChatEmptyState } from "./ArchivedChatEmptyState";
import { UseMutationResult } from "@tanstack/react-query";

type Chat = {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
  is_archived: boolean;
  system_prompt: string | null;
};

interface ArchivedChatListProps {
  chats: Chat[];
  searchTerm: string;
  unarchiveMutation: UseMutationResult<Chat, Error, string, unknown>;
  onDeleteChat: (chatId: string, chatTitle: string) => void;
}

export const ArchivedChatList = ({
  chats,
  searchTerm,
  unarchiveMutation,
  onDeleteChat,
}: ArchivedChatListProps) => {
  // Constants
  const hasSearchTerm = searchTerm.length > 0;

  // Conditional rendering
  if (chats.length === 0) {
    return <ArchivedChatEmptyState hasSearchTerm={hasSearchTerm} />;
  }

  return (
    <div className="p-4 space-y-2">
      {chats.map((chat) => (
        <ArchivedChatItem
          key={chat.id}
          chat={chat}
          unarchiveMutation={unarchiveMutation}
          onDelete={onDeleteChat}
        />
      ))}
    </div>
  );
};