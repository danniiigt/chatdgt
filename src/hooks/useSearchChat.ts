"use client";

import { create } from "zustand";

interface SearchChatStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSearchChat = create<SearchChatStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
}));
