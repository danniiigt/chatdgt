"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchChat } from "./useSearchChat";

export const useKeyboardShortcuts = () => {
  // Third party hooks
  const router = useRouter();

  // State
  const { setIsOpen } = useSearchChat();

  // Effects
  useEffect(
    function handleKeyboardShortcuts() {
      const handleKeyDown = (event: KeyboardEvent) => {
        const isMac = navigator.userAgent.indexOf("Mac") !== -1;
        const cmdKey = isMac ? event.metaKey : event.ctrlKey;

        // Shift + Cmd/Ctrl + O - Navigate to new chat
        if (event.shiftKey && cmdKey && event.key.toLowerCase() === "o") {
          event.preventDefault();
          router.push("/chat");
          return;
        }

        // Cmd/Ctrl + K - Open search dialog
        if (cmdKey && event.key.toLowerCase() === "k") {
          event.preventDefault();
          setIsOpen(true);
          return;
        }

        // Shift + Cmd/Ctrl + E - Navigate to archived chats (placeholder)
        if (event.shiftKey && cmdKey && event.key.toLowerCase() === "e") {
          event.preventDefault();
          router.push("/archived-chats");
          return;
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [router]
  );
};
