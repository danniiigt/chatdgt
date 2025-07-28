import { ChatBoxLayout } from "@/components/views/chat/ChatBoxLayout";
import { NoChatSelectedView } from "@/components/views/chat/NoChatSelectedView";

const ChatPage = () => {
  return (
    <div className="w-full h-full">
      <ChatBoxLayout>
        <NoChatSelectedView />
      </ChatBoxLayout>
    </div>
  );
};

export default ChatPage;
