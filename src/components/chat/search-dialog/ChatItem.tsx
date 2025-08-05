import { MessageCircleIcon } from "lucide-react";
import { CommandItem } from "@/components/ui/command";
import { ChatItemProps } from "./types";

export const ChatItem = ({ chat, onSelect, onRegister }: ChatItemProps) => {
  return (
    <CommandItem
      key={chat.id}
      value={`${chat.title}-${chat.id}`}
      onSelect={() => onSelect(chat.id)}
      ref={(element) => onRegister(element, chat.id)}
    >
      <MessageCircleIcon className="mr-2 h-4 w-4" />
      <span className="truncate">{chat.title}</span>
    </CommandItem>
  );
};