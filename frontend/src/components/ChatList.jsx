import { useState } from "react";
import { Search, Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useChat } from "../contexts/ChatContext";

const ChatList = () => {
  const { theme, toggleTheme } = useTheme();
  const {
    conversations,
    selectedChat,
    setSelectedChat,
    loading,
    error,
    isOnline,
    clearError,
  } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
      "bg-orange-500",
      "bg-cyan-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredChats = conversations.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="h-full bg-white dark:bg-zinc-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-white dark:bg-zinc-800 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-zinc-800 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800 dark:text-zinc-200">
            WhatsApp Web Clone
          </h1>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isOnline ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span
              className={`text-xs ${
                isOnline
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-zinc-400" />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-3">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full">
            <Plus className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex-1 p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors text-sm flex items-center justify-center gap-2"
          >
            {theme === "dark" ? (
              <>
                <Sun className="w-4 h-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" />
                Dark Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-gray-500 dark:text-zinc-400">
              {searchTerm ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat)}
              className={`p-4 border-b border-gray-100 dark:border-zinc-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors ${
                selectedChat?.id === chat.id
                  ? "bg-green-50 dark:bg-green-900/20 border-l-4 border-l-green-500"
                  : ""
              }`}
            >
              <div className="flex items-center">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${getAvatarColor(
                    chat.name
                  )} flex items-center justify-center text-white font-semibold text-lg md:text-xl mr-3 flex-shrink-0`}
                >
                  {getInitials(chat.name)}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-zinc-400">
                      {chat.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-zinc-400 truncate">
                      {chat.lastMessage}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
        <div className="text-center text-xs text-gray-500 dark:text-zinc-400">
          <p>WhatsApp Web Clone</p>
          <p className="mt-1"></p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
