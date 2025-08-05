import { useTranslate } from "@tolgee/react";
import { CommandGroup, CommandItem } from "@/components/ui/command";
import { SearchXIcon } from "lucide-react";
import { SearchResult } from "./types";
import { SearchResultItem } from "./SearchResultItem";

interface SearchResultsGroupProps {
  searchResults: SearchResult[];
  searchQuery: string;
  onChatSelect: (chatId: string) => void;
  onRegisterChat: (element: HTMLDivElement | null, chatId: string) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
  isLoading?: boolean;
}

export const SearchResultsGroup = ({
  searchResults,
  searchQuery,
  onChatSelect,
  onRegisterChat,
  highlightText,
  isLoading = false,
}: SearchResultsGroupProps) => {
  // Third party hooks
  const { t } = useTranslate();

  return (
    <CommandGroup
      heading={t("chat.search.results", "Resultados de búsqueda")}
      className="my-3"
    >
      {isLoading ? (
        <CommandItem value="loading" className="justify-center py-8">
          <div className="flex flex-col items-center text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current mb-2"></div>
            <span className="text-sm">
              {t("chat.search.searching", "Buscando...")}
            </span>
          </div>
        </CommandItem>
      ) : searchResults.length === 0 ? (
        <CommandItem value="no-results" className="justify-center py-8">
          <div className="flex flex-col items-center text-muted-foreground">
            <SearchXIcon className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium mb-1">
              {t("chat.search.no-results-title", "Sin resultados")}
            </span>
          </div>
        </CommandItem>
      ) : (
        searchResults.map((result, index) => (
          <SearchResultItem
            key={`search-${result.chat_id}-${index}`}
            result={result}
            index={index}
            searchQuery={searchQuery}
            onSelect={onChatSelect}
            onRegister={onRegisterChat}
            highlightText={highlightText}
          />
        ))
      )}
    </CommandGroup>
  );
};
