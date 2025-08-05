"use client";

import { useState } from "react";

export const useClipboard = () => {
  // State
  const [isCopied, setIsCopied] = useState(false);

  // Helpers / Functions
  const copyToClipboard = async (text: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  return {
    isCopied,
    copyToClipboard,
  };
};