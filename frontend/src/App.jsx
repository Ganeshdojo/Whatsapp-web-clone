import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import { useChat } from "./contexts/ChatContext";

function App() {
  const { selectedChat } = useChat();

  return (
    <div className="h-screen flex">
      <div className="flex h-full w-full bg-gray-100 dark:#161717">
        {/* Left Sidebar - ChatList */}
        {/* On mobile, ChatList is shown only if no chat is selected */}
        {/* On desktop, ChatList is always shown */}
        <div
          className={`w-full md:w-1/3 border-r border-gray-300 dark:border-gray-700 ${
            selectedChat ? "hidden md:block" : "block"
          }`}
        >
          <ChatList />
        </div>

        {/* Right Side - ChatWindow */}
        {/* On mobile, ChatWindow is shown only if a chat is selected */}
        {/* On desktop, ChatWindow is always shown */}
        <div
          className={`w-full md:w-2/3 ${
            selectedChat ? "block" : "hidden md:block"
          }`}
        >
          <ChatWindow />
        </div>
      </div>
    </div>
  );
}

export default App;
