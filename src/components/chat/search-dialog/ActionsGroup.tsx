import { PlusIcon } from "lucide-react";
import { useTranslate } from "@tolgee/react";
import { CommandGroup, CommandItem } from "@/components/ui/command";

interface ActionsGroupProps {
  onCreateNewChat: () => void;
}

export const ActionsGroup = ({ onCreateNewChat }: ActionsGroupProps) => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <CommandGroup
      heading={t("chat.search.actions", "Acciones")}
      className="mb-3"
    >
      <CommandItem value="create-chat" onSelect={onCreateNewChat}>
        <PlusIcon className="mr-2 h-4 w-4" />
        <span>{t("chat.search.create-chat", "Crear chat")}</span>
      </CommandItem>
    </CommandGroup>
  );
};