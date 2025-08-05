import { Chat } from "@/hooks/useChatList";

export interface SearchResult {
  chat_id: string;
  chat_title: string;
  updated_at: string;
  match_type: "title" | "message";
  message_preview: string | null;
  message_id: string | null;
}

export interface SearchDialogState {
  isUserTyping: boolean;
  isDataLoading: boolean;
  showSearchResults: boolean;
  showDefaultChats: boolean;
  hasAnyVisibleContent: boolean;
}

export interface ChatItemProps {
  chat: Chat;
  onSelect: (chatId: string) => void;
  onRegister: (element: HTMLDivElement | null, chatId: string) => void;
}

export interface SearchResultItemProps {
  result: SearchResult;
  index: number;
  searchQuery: string;
  onSelect: (chatId: string) => void;
  onRegister: (element: HTMLDivElement | null, chatId: string) => void;
  highlightText: (text: string, query: string) => React.ReactNode;
}