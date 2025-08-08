"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { randomColor } from "@/lib/constants";

interface MessageAvatarProps {
  isUser: boolean;
  userName?: string;
  userAvatarUrl?: string;
}

export const MessageAvatar = ({
  isUser,
  userName = "",
  userAvatarUrl = "",
}: MessageAvatarProps) => {
  // Constants
  const userInitials = userName
    ? userName
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
    : "U";

  if (isUser) {
    return (
      <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
        <AvatarImage src={userAvatarUrl} alt={userName || "Avatar"} />
        <AvatarFallback
          style={{ backgroundColor: randomColor }}
          className="bg-primary text-primary-foreground text-xs"
        >
          {userInitials}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 shrink-0">
      <AvatarImage src="/ai-avatar.png" alt="AI" />
      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
        AI
      </AvatarFallback>
    </Avatar>
  );
};
