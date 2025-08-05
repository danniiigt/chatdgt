import React from "react";

/**
 * Highlights text matches within a string with bold formatting
 * @param text - The text to highlight
 * @param searchQuery - The query to highlight in the text
 * @returns React node with highlighted text
 */
export const highlightTextMatches = (text: string, searchQuery: string): React.ReactNode => {
  if (!searchQuery.trim()) return text;
  
  const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const matchRegex = new RegExp(`(${escapedQuery})`, "gi");
  const textParts = text.split(matchRegex);
  
  return textParts.map((part, index) => {
    const isMatch = matchRegex.test(part);
    
    if (isMatch) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part}
        </strong>
      );
    }
    
    return part;
  });
};