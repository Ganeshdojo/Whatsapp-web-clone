import { useState } from "react";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";

function App() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [theme, setTheme] = useState("dark"); // 'dark' or 'light'

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className={`h-screen flex ${theme === "dark" ? "dark" : ""}`}>
      <div className="flex h-full w-full bg-gray-100 dark:bg-gray-900">
        {/* Left Sidebar - ChatList */}
        <div className="w-1/3 border-r border-gray-300 dark:border-gray-700">
          <ChatList
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        </div>

        {/* Right Side - ChatWindow */}
        <div className="w-2/3">
          {selectedChat ? (
            <ChatWindow chat={selectedChat} theme={theme} />
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-800">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Welcome to WhatsApp Web Clone
                </h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Select a chat to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
