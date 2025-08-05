"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ children }) => (
            <p className="whitespace-pre-wrap break-words m-0 mb-5 last:mb-0">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="my-5 ml-4 list-disc space-y-3">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="my-5 ml-4 list-decimal space-y-3">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="break-words">{children}</li>
          ),
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};