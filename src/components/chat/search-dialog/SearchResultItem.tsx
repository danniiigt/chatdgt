import { MessageCircleIcon } from "lucide-react";
import { useTranslate } from "@tolgee/react";
import { CommandItem } from "@/components/ui/command";
import { SearchResultItemProps } from "./types";

export const SearchResultItem = ({
  result,
  index,
  searchQuery,
  onSelect,
  onRegister,
  highlightText,
}: SearchResultItemProps) => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <CommandItem
      key={`search-${result.chat_id}-${index}`}
      value={`search-result-${index}`}
      onSelect={() => onSelect(result.chat_id)}
      ref={(element) => onRegister(element, result.chat_id)}
      className="flex-col items-start py-3"
    >
      <div className="flex items-center w-full">
        <MessageCircleIcon className="mr-2 h-4 w-4 flex-shrink-0" />
        <span className="truncate">
          {highlightText(result.chat_title, searchQuery)}
        </span>
        {result.match_type === "message" && (
          <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            {t("chat.search.in-message", "en mensaje")}
          </span>
        )}
      </div>
      {result.message_preview && (
        <div className="text-xs text-muted-foreground mt-1 ml-6 truncate w-full">
          {highlightText(result.message_preview, searchQuery)}
        </div>
      )}
    </CommandItem>
  );
};