"use client";

export const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 p-4 rounded-lg">
      <div className="h-8 w-8 bg-muted/50 rounded-full animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-muted/50 rounded animate-pulse" />
          <div className="h-3 w-12 bg-muted/30 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted/50 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted/50 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

interface MessageSkeletonListProps {
  count?: number;
}

export const MessageSkeletonList = ({ count = 5 }: MessageSkeletonListProps) => {
  return (
    <div className="space-y-4 p-4 pt-6">
      {[...Array(count)].map((_, index) => (
        <MessageSkeleton key={index} />
      ))}
    </div>
  );
};