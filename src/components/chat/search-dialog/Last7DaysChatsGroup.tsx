import { useTranslate } from "@tolgee/react";
import { CommandGroup } from "@/components/ui/command";
import { Chat } from "@/hooks/useChatList";
import { ChatItem } from "./ChatItem";

interface Last7DaysChatsGroupProps {
  last7DaysChats: Chat[];
  todayChats: Chat[];
  onChatSelect: (chatId: string) => void;
  onRegisterChat: (element: HTMLDivElement | null, chatId: string) => void;
}

export const Last7DaysChatsGroup = ({
  last7DaysChats,
  todayChats,
  onChatSelect,
  onRegisterChat,
}: Last7DaysChatsGroupProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // Helpers / Functions
  const getChatsExcludingToday = () => {
    return last7DaysChats.filter(
      (chat) => !todayChats.some((todayChat) => todayChat.id === chat.id)
    );
  };

  // Constants
  const filteredChats = getChatsExcludingToday();

  if (filteredChats.length === 0) {
    return null;
  }

  return (
    <CommandGroup
      heading={t("chat.search.last-7-days", "Últimos 7 días")}
      className="my-3"
    >
      {filteredChats.map((chat) => (
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