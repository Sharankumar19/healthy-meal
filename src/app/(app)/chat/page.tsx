import { ChatScreen } from "@/components/chat/ChatScreen";

export const metadata = {
  title: "Meal assistant",
};

// Gated on client-only auth state; cannot render before hydration.
export const instant = false;

export default function ChatPage() {
  return <ChatScreen />;
}
