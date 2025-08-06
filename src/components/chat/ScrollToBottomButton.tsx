"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslate } from "@tolgee/react";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollToBottomButtonProps {
  scrollContainerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export const ScrollToBottomButton = ({
  scrollContainerRef,
  className,
}: ScrollToBottomButtonProps) => {
  // Third party hooks
  const { t } = useTranslate();

  // State
  const [isVisible, setIsVisible] = useState(false);

  // Refs
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helpers / Functions
  const checkScrollPosition = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const scrollFromBottom = scrollHeight - scrollTop - clientHeight;
    const isNearBottom = scrollFromBottom <= 150; // 150px threshold
    const hasScroll = scrollHeight > clientHeight + 50; // Only show if there's meaningful scroll
    const shouldShow = hasScroll && !isNearBottom;

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce visibility changes to avoid flickering
    debounceTimeoutRef.current = setTimeout(
      () => {
        setIsVisible(shouldShow);
      },
      shouldShow ? 0 : 100
    ); // Show immediately, hide with small delay
  }, [scrollContainerRef]);

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Hide button immediately when clicked
    setIsVisible(false);

    // Smooth scroll to bottom
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [scrollContainerRef]);

  // Effects
  useEffect(
    function setupScrollListener() {
      const container = scrollContainerRef.current;
      if (!container) return;

      // Check initial position
      checkScrollPosition();

      // Add scroll listener
      container.addEventListener("scroll", checkScrollPosition);

      // Add resize observer to handle dynamic content changes
      const resizeObserver = new ResizeObserver(checkScrollPosition);
      resizeObserver.observe(container);

      return () => {
        container.removeEventListener("scroll", checkScrollPosition);
        resizeObserver.disconnect();

        // Clear timeout on cleanup
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    },
    [checkScrollPosition, scrollContainerRef]
  );

  // Conditional rendering
  if (!isVisible) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToBottom}
      className={cn(
        "absolute bottom-[172px] left-1/2 -translate-x-1/2 z-50 h-8 w-8 rounded-full shadow-lg border",
        "bg-background hover:bg-accent transition-all duration-200 ease-in-out",
        "opacity-95 hover:opacity-100 hover:scale-105",
        "border-border/50 hover:border-border",
        className
      )}
      title={t("chat.scroll-to-bottom", "Ir al final de la conversación")}
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  );
};
