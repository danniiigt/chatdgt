"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TypewriterTextProps {
  text: string;
  isComplete?: boolean;
  shouldAnimate?: boolean; // Whether this message should animate
  speed?: number; // chunks per second
  className?: string;
  markdownComponents?: any;
}

export const TypewriterText = ({
  text,
  isComplete = false,
  shouldAnimate = true, // Default to animate
  speed = 24, // 12 chunks per second by default
  className = "",
  markdownComponents = {},
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const previousTextRef = useRef("");
  const chunkIndexRef = useRef(0);

  // Split text into semantic chunks (words + markdown elements)
  const splitIntoChunks = (text: string): string[] => {
    const chunks: string[] = [];
    let currentIndex = 0;

    // Regex patterns for markdown elements that should stay together
    const markdownPatterns = [
      /\*\*[^*]+\*\*/g, // **bold text**
      /\*[^*]+\*/g, // *italic text*
      /__[^_]+__/g, // __bold text__
      /_[^_]+_/g, // _italic text_
      /`[^`]+`/g, // `inline code`
      /```[\s\S]*?```/g, // ```code blocks```
      /\[[^\]]+\]\([^)]+\)/g, // [link text](url)
      /\d+\.\s+\*\*[^*]+\*\*/g, // numbered list with bold: "1. **Item**"
      /https?:\/\/[^\s]+/g, // URLs
    ];

    while (currentIndex < text.length) {
      let foundPattern = false;

      // Check for markdown patterns at current position
      for (const pattern of markdownPatterns) {
        pattern.lastIndex = 0; // Reset regex
        const match = pattern.exec(text.slice(currentIndex));

        if (match && match.index === 0) {
          // Found a markdown pattern at current position
          chunks.push(match[0]);
          currentIndex += match[0].length;
          foundPattern = true;
          break;
        }
      }

      if (!foundPattern) {
        // No markdown pattern, get next word
        const remainingText = text.slice(currentIndex);
        const wordMatch = remainingText.match(/^\s*\S+\s*/);

        if (wordMatch) {
          chunks.push(wordMatch[0]);
          currentIndex += wordMatch[0].length;
        } else {
          // Single character fallback
          chunks.push(text[currentIndex]);
          currentIndex++;
        }
      }
    }

    return chunks.filter((chunk) => chunk.length > 0);
  };

  useEffect(() => {
    // Don't animate if text is empty
    if (!text.trim()) {
      setDisplayedText(text);
      setIsAnimating(false);
      return;
    }

    // If shouldAnimate is false, show text immediately
    if (!shouldAnimate) {
      setDisplayedText(text);
      setIsAnimating(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // If this is completely new text (not streaming continuation), reset
    if (!text.startsWith(previousTextRef.current)) {
      chunkIndexRef.current = 0;
      setDisplayedText("");
      previousTextRef.current = "";
      setIsAnimating(false);
    }

    // If we have new content to animate
    if (text !== previousTextRef.current) {
      previousTextRef.current = text;

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      const chunks = splitIntoChunks(text);

      // If we already have all chunks displayed, no need to animate
      if (chunkIndexRef.current >= chunks.length) {
        setDisplayedText(text);
        setIsAnimating(false);
        return;
      }

      // Start typewriter animation from current position
      setIsAnimating(true);
      const interval = setInterval(() => {
        chunkIndexRef.current += 1;

        if (chunkIndexRef.current >= chunks.length) {
          // Animation complete for current text
          setDisplayedText(text);
          setIsAnimating(false);
          clearInterval(interval);
          intervalRef.current = null;
          return;
        }

        // Build displayed text up to current chunk
        const chunksToShow = chunks.slice(0, chunkIndexRef.current);
        setDisplayedText(chunksToShow.join(""));
      }, 1000 / speed); // Convert chunks per second to milliseconds

      intervalRef.current = interval;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [text, speed, shouldAnimate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`animate-in fade-in duration-300 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom components for better styling
          p: ({ children }) => (
            <p className="whitespace-pre-wrap break-words m-0 mb-5 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-5 ml-4 list-disc space-y-3">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 ml-4 list-decimal space-y-3">{children}</ol>
          ),
          li: ({ children }) => <li className="break-words">{children}</li>,
          code: ({ children, className }) => {
            const isInline = !className;
            return isInline ? (
              <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {children}
              </code>
            ) : (
              <code className={className}>{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-muted p-3 rounded-lg overflow-x-auto my-5">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground/20 pl-4 italic my-5">
              {children}
            </blockquote>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          h1: ({ children }) => (
            <h1 className="text-lg font-semibold mt-6 mb-3 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base font-semibold mt-5 mb-3 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm font-semibold mt-4 mb-2 first:mt-0">
              {children}
            </h3>
          ),
          ...markdownComponents,
        }}
      >
        {displayedText + (isAnimating && displayedText ? " ▊" : "")}
      </ReactMarkdown>
    </div>
  );
};
