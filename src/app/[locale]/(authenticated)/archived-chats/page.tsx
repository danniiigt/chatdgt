"use client";

import { useState } from "react";
import { useArchivedChats } from "@/hooks/useArchivedChats";
import { ArchivedChatHeader } from "@/components/archived-chats/ArchivedChatHeader";
import { ArchivedChatList } from "@/components/archived-chats/ArchivedChatList";
import { DeleteArchivedChatDialog } from "@/components/archived-chats/DeleteArchivedChatDialog";
import { ArchivedChatsSkeletonLoader } from "@/components/archived-chats/ArchivedChatsSkeletonLoader";

const ArchivedChats = () => {
  // Custom hooks
  const { archivedChats, isLoading, unarchiveMutation, deleteMutation } =
    useArchivedChats();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    chatId: string | null;
    chatTitle: string;
  }>({
    isOpen: false,
    chatId: null,
    chatTitle: "",
  });

  // Helpers / Functions
  const filteredChats = archivedChats.filter((chat) =>
    chat.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteChat = (chatId: string, chatTitle: string) => {
    setDeleteDialog({
      isOpen: true,
      chatId,
      chatTitle,
    });
  };

  // Conditional rendering
  if (isLoading) {
    return <ArchivedChatsSkeletonLoader />;
  }

  return (
    <div className="flex-1 flex flex-col">
      <ArchivedChatHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        chatCount={filteredChats.length}
      />

      <div className="flex-1 overflow-auto">
        <ArchivedChatList
          chats={filteredChats}
          searchTerm={searchTerm}
          unarchiveMutation={unarchiveMutation}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      <DeleteArchivedChatDialog
        deleteDialog={deleteDialog}
        setDeleteDialog={setDeleteDialog}
        deleteMutation={deleteMutation}
      />
    </div>
  );
};

export default ArchivedChats;
