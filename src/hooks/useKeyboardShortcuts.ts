"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useKeyboardShortcuts = () => {
  // Third party hooks
  const router = useRouter();

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

        // Cmd/Ctrl + K - Search (placeholder for future implementation)
        if (cmdKey && event.key.toLowerCase() === "k") {
          event.preventDefault();
          // TODO: Implement search functionality
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
