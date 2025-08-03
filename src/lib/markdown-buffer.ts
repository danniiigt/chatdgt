/**
 * Intelligent markdown streaming buffer that ensures only complete elements are rendered
 */
export class MarkdownBuffer {
  private buffer = "";
  private renderedContent = "";

  /**
   * Add new content to the buffer
   */
  addContent(chunk: string): string {
    this.buffer += chunk;
    return this.flush();
  }

  /**
   * Get the current rendered content
   */
  getRenderedContent(): string {
    return this.renderedContent;
  }

  /**
   * Force flush all remaining content (used when streaming is complete)
   */
  forceFlush(): string {
    this.renderedContent += this.buffer;
    this.buffer = "";
    return this.renderedContent;
  }

  /**
   * Flush complete markdown elements from buffer to rendered content
   */
  private flush(): string {
    const lines = this.buffer.split("\n");
    let flushableContent = "";
    let remainingBuffer = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isLastLine = i === lines.length - 1;

      // If it's the last line and there's no newline at the end, keep it in buffer
      if (isLastLine && !this.buffer.endsWith("\n")) {
        // Check if it's a complete element or safe to render
        if (this.isCompleteLine(line)) {
          flushableContent += line;
        } else {
          remainingBuffer = line;
        }
      } else {
        // Complete line (has newline), safe to flush
        flushableContent += line + (isLastLine ? "" : "\n");
      }
    }

    // Update buffer and rendered content
    this.buffer = remainingBuffer;
    this.renderedContent += flushableContent;

    return this.renderedContent;
  }

  /**
   * Check if a line is complete and safe to render
   */
  private isCompleteLine(line: string): boolean {
    const trimmedLine = line.trim();

    // Empty lines are always safe
    if (!trimmedLine) return true;

    // Check for incomplete markdown elements
    if (this.hasIncompleteMarkdown(trimmedLine)) {
      return false;
    }

    // Check for incomplete numbered lists
    if (this.hasIncompleteNumberedList(trimmedLine)) {
      return false;
    }

    // Check for incomplete links
    if (this.hasIncompleteLink(trimmedLine)) {
      return false;
    }

    // Check for incomplete code blocks
    if (this.hasIncompleteCodeBlock(trimmedLine)) {
      return false;
    }

    // Check for incomplete bold/italic
    if (this.hasIncompleteBoldItalic(trimmedLine)) {
      return false;
    }

    return true;
  }

  /**
   * Check for incomplete markdown syntax
   */
  private hasIncompleteMarkdown(line: string): boolean {
    // Incomplete headers (# without space or text)
    if (/^#+$/.test(line)) return true;

    // Incomplete blockquotes (> without content)
    if (/^>+$/.test(line)) return true;

    return false;
  }

  /**
   * Check for incomplete numbered lists
   */
  private hasIncompleteNumberedList(line: string): boolean {
    // Pattern: number followed by dot but no space or content
    if (/^\d+\.$/.test(line)) return true;

    // Pattern: number with dot and space but no actual content (just whitespace)
    if (/^\d+\.\s*$/.test(line)) return true;

    return false;
  }

  /**
   * Check for incomplete links
   */
  private hasIncompleteLink(line: string): boolean {
    // Incomplete link syntax [text](
    if (line.includes("[") && line.includes("](") && !line.includes(")")) {
      return true;
    }

    // Incomplete link text [
    if (line.includes("[") && !line.includes("]")) {
      return true;
    }

    return false;
  }

  /**
   * Check for incomplete code blocks
   */
  private hasIncompleteCodeBlock(line: string): boolean {
    // Incomplete code block start
    if (/^```\w*$/.test(line)) return true;

    return false;
  }

  /**
   * Check for incomplete bold/italic formatting
   */
  private hasIncompleteBoldItalic(line: string): boolean {
    // Count asterisks and underscores to detect incomplete formatting
    const asteriskCount = (line.match(/\*/g) || []).length;
    const underscoreCount = (line.match(/_/g) || []).length;

    // Odd number of asterisks or underscores might indicate incomplete formatting
    // But we need to be careful not to break legitimate usage
    if (asteriskCount % 2 !== 0 && line.endsWith("*")) return true;
    if (underscoreCount % 2 !== 0 && line.endsWith("_")) return true;

    return false;
  }

  /**
   * Reset the buffer (useful for new messages)
   */
  reset(): void {
    this.buffer = "";
    this.renderedContent = "";
  }
}
