"use client";

import { useTranslate } from "@tolgee/react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useSearchDialog } from "./search-dialog/use-search-dialog";
import { highlightTextMatches } from "./search-dialog/text-highlighter";
import { ActionsGroup } from "./search-dialog/ActionsGroup";
import { SearchResultsGroup } from "./search-dialog/SearchResultsGroup";
import { TodayChatsGroup } from "./search-dialog/TodayChatsGroup";
import { Last7DaysChatsGroup } from "./search-dialog/Last7DaysChatsGroup";

export const ChatSearchDialog = () => {
  // Third party hooks
  const { t } = useTranslate();

  // Custom hooks
  const {
    isDialogOpen,
    setDialogOpen,
    userSearchQuery,
    setUserSearchQuery,
    debouncedSearchQuery,
    dialogState,
    todayChats,
    last7DaysChats,
    searchResults,
    navigateToChat,
    navigateToNewChat,
    registerChatForPrefetch,
  } = useSearchDialog();


  return (
    <CommandDialog
      open={isDialogOpen}
      onOpenChange={setDialogOpen}
      shouldFilter={false}
    >
      <CommandInput
        placeholder={t("chat.search.placeholder", "Buscar chats...")}
        value={userSearchQuery}
        onValueChange={setUserSearchQuery}
      />

      <CommandList>
        {dialogState.showDefaultChats && (
          <ActionsGroup onCreateNewChat={navigateToNewChat} />
        )}

        {!dialogState.showDefaultChats && (
          <SearchResultsGroup
            searchResults={searchResults}
            searchQuery={debouncedSearchQuery}
            onChatSelect={navigateToChat}
            onRegisterChat={registerChatForPrefetch}
            highlightText={highlightTextMatches}
            isLoading={dialogState.isUserTyping || dialogState.isDataLoading}
          />
        )}

        {dialogState.showDefaultChats && (
          <>
            <TodayChatsGroup
              todayChats={todayChats}
              onChatSelect={navigateToChat}
              onRegisterChat={registerChatForPrefetch}
            />

            <Last7DaysChatsGroup
              last7DaysChats={last7DaysChats}
              todayChats={todayChats}
              onChatSelect={navigateToChat}
              onRegisterChat={registerChatForPrefetch}
            />
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
};
