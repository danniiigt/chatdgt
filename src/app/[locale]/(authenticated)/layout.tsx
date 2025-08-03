"use client";

import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout = ({
  children,
}: AuthenticatedLayoutProps) => {
  // Custom hooks
  useKeyboardShortcuts();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <ChatSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default AuthenticatedLayout;
