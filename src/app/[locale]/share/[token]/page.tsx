"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useSharedChat } from "@/hooks/useSharedChat";
import { SharedChatLoadingView } from "@/components/views/shared-chat/SharedChatLoadingView";
import { SharedChatErrorView } from "@/components/views/shared-chat/SharedChatErrorView";
import { SharedChatContent } from "@/components/views/shared-chat/SharedChatContent";

export default function SharedChatPage() {
  // Third party hooks
  const params = useParams();

  // Custom hooks
  const { chatData, isLoading, error } = useSharedChat(params.token as string);

  // Effects
  useEffect(function updatePageTitle() {
    if (chatData?.title) {
      document.title = `${chatData.title} - ChatDGT`;
    } else {
      document.title = "Conversación compartida - ChatDGT";
    }

    // Cleanup - restore original title when component unmounts
    return () => {
      document.title = "ChatDGT";
    };
  }, [chatData?.title]);

  // Conditional rendering
  if (isLoading) {
    return <SharedChatLoadingView />;
  }

  if (error) {
    return <SharedChatErrorView error={error} />;
  }

  if (!chatData) {
    return null;
  }

  return <SharedChatContent chatData={chatData} />;
}
