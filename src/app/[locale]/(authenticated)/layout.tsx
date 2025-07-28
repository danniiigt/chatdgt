import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <ChatSidebar />
        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
