"use client";

import { useEffect, useState } from "react";

interface KeyboardShortcutProps {
  keys: string[];
  className?: string;
}

export const KeyboardShortcut = ({
  keys,
  className = "",
}: KeyboardShortcutProps) => {
  // State
  const [isMac, setIsMac] = useState(false);

  // Effects
  useEffect(function detectOperatingSystem() {
    setIsMac(navigator.userAgent.indexOf('Mac') !== -1);
  }, []);

  // Helpers / Functions
  const formatKey = (key: string) => {
    if (key === "cmd" || key === "meta") {
      return isMac ? "⌘" : "Ctrl";
    }
    if (key === "shift") {
      return isMac ? "⇧" : "Shift";
    }
    if (key === "alt" || key === "option") {
      return isMac ? "⌥" : "Alt";
    }
    if (key === "ctrl") {
      return isMac ? "⌃" : "Ctrl";
    }
    return key.toUpperCase();
  };

  return (
    <span className={`text-sm text-muted-foreground ${className}`}>
      {keys.map(formatKey).join("")}
    </span>
  );
};
