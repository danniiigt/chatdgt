import { useTranslate } from "@tolgee/react";
import { CommandGroup } from "@/components/ui/command";
import { Chat } from "@/hooks/useChatList";
import { ChatItem } from "./ChatItem";

interface TodayChatsGroupProps {
  todayChats: Chat[];
  onChatSelect: (chatId: string) => void;
  onRegisterChat: (element: HTMLDivElement | null, chatId: string) => void;
}

export const TodayChatsGroup = ({
  todayChats,
  onChatSelect,
  onRegisterChat,
}: TodayChatsGroupProps) => {
  // Third party hooks
  const { t } = useTranslate();

  if (todayChats.length === 0) {
    return null;
  }

  return (
    <CommandGroup heading={t("chat.search.today", "Hoy")} className="my-3">
      {todayChats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          onSelect={onChatSelect}
          onRegister={onRegisterChat}
        />
      ))}
    </CommandGroup>
  );
};