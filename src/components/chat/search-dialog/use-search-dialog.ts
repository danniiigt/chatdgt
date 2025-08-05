import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchChat } from "@/hooks/useSearchChat";
import {
  useTodayChats,
  useLast7DaysChats,
  useChatPrefetch,
  useSearchChats,
} from "@/hooks/useSearchChatData";
import { SearchDialogState } from "./types";

const SEARCH_DEBOUNCE_MS = 300;
const MIN_SEARCH_LENGTH = 2;
const PREFETCH_THRESHOLD = 0.1;

export const useSearchDialog = () => {
  // Third party hooks
  const router = useRouter();

  // Custom hooks
  const { isOpen: isDialogOpen, setIsOpen: setDialogOpen } = useSearchChat();

  // State
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Data fetching
  const todayChatsQuery = useTodayChats();
  const last7DaysChatsQuery = useLast7DaysChats();
  const searchResultsQuery = useSearchChats(debouncedSearchQuery);
  const { prefetchChat } = useChatPrefetch();

  // Refs
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);

  // Effects
  useEffect(function debounceUserInput() {
    const debounceTimer = setTimeout(() => {
      setDebouncedSearchQuery(userSearchQuery);
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(debounceTimer);
  }, [userSearchQuery]);

  useEffect(function resetStateOnDialogClose() {
    if (!isDialogOpen) {
      setUserSearchQuery("");
      setDebouncedSearchQuery("");
    }
  }, [isDialogOpen]);

  useEffect(function initializePrefetchObserver() {
    if (!isDialogOpen) return;

    intersectionObserverRef.current = new IntersectionObserver(
      (observedEntries) => {
        observedEntries.forEach((entry) => {
          if (entry.isIntersecting) {
            const chatId = entry.target.getAttribute("data-chat-id");
            if (chatId) {
              prefetchChat(chatId);
            }
          }
        });
      },
      { threshold: PREFETCH_THRESHOLD }
    );

    return () => {
      intersectionObserverRef.current?.disconnect();
    };
  }, [isDialogOpen, prefetchChat]);

  // Handlers
  const navigateToChat = (chatId: string) => {
    router.push(`/chat?chatId=${chatId}`);
    setDialogOpen(false);
  };

  const navigateToNewChat = () => {
    router.push("/chat");
    setDialogOpen(false);
  };

  const registerChatForPrefetch = (element: HTMLDivElement | null, chatId: string) => {
    if (element && intersectionObserverRef.current) {
      element.setAttribute("data-chat-id", chatId);
      intersectionObserverRef.current.observe(element);
    }
  };

  // Computed state
  const isUserActivelySearching = debouncedSearchQuery.trim().length >= MIN_SEARCH_LENGTH;
  const isUserCurrentlyTyping = 
    userSearchQuery.trim() !== debouncedSearchQuery.trim() &&
    userSearchQuery.trim().length >= MIN_SEARCH_LENGTH;

  const dialogState: SearchDialogState = {
    isUserTyping: isUserCurrentlyTyping,
    isDataLoading: 
      todayChatsQuery.isLoading || 
      last7DaysChatsQuery.isLoading || 
      searchResultsQuery.isLoading,
    showSearchResults: 
      isUserActivelySearching &&
      searchResultsQuery.data?.results &&
      searchResultsQuery.data.results.length > 0,
    showDefaultChats: !isUserActivelySearching,
    hasAnyVisibleContent: false, // Will be computed below
  };

  // Compute if we have any visible content
  const hasSearchResults = dialogState.showSearchResults;
  const hasTodayChats = 
    dialogState.showDefaultChats &&
    todayChatsQuery.data?.chats &&
    todayChatsQuery.data.chats.length > 0;
  const hasLast7DaysChats = 
    dialogState.showDefaultChats &&
    last7DaysChatsQuery.data?.chats &&
    last7DaysChatsQuery.data.chats.length > 0;

  dialogState.hasAnyVisibleContent = hasSearchResults || hasTodayChats || hasLast7DaysChats;

  return {
    // State
    isDialogOpen,
    setDialogOpen,
    userSearchQuery,
    setUserSearchQuery,
    debouncedSearchQuery,
    dialogState,

    // Data
    todayChats: todayChatsQuery.data?.chats ?? [],
    last7DaysChats: last7DaysChatsQuery.data?.chats ?? [],
    searchResults: searchResultsQuery.data?.results ?? [],

    // Handlers
    navigateToChat,
    navigateToNewChat,
    registerChatForPrefetch,
  };
};