import { useState } from "react";

const ChatList = ({ selectedChat, onSelectChat, theme, onToggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  // Sample chat data - in real app this would come from backend
  const chats = [
    {
      id: 1,
      name: "Freshers Job Bangalore",
      lastMessage: "+91 77601 71334 joined via an invite link",
      timestamp: "11:12",
      unreadCount: 1,
      isGroup: true,
      avatar: "👥",
      status: "joined"
    },
    {
      id: 2,
      name: "fam",
      lastMessage: "Photo",
      timestamp: "09:24",
      unreadCount: 0,
      isGroup: false,
      avatar: "👨‍👩‍👧‍👦",
      status: "read"
    },
    {
      id: 3,
      name: "Placement & Internship GG",
      lastMessage: "~ Ma: Become a Google Student Ambassador - India 2025 Cohort...",
      timestamp: "Yesterday",
      unreadCount: 4,
      isGroup: true,
      avatar: "🎓",
      status: "unread"
    },
    {
      id: 4,
      name: "Nanna",
      lastMessage: "Photo",
      timestamp: "Yesterday",
      unreadCount: 0,
      isGroup: false,
      avatar: "👩",
      status: "read"
    },
    {
      id: 5,
      name: "+91 93357 62834",
      lastMessage: "why do I need to pay 15000rs?",
      timestamp: "Yesterday",
      unreadCount: 0,
      isGroup: false,
      avatar: "👤",
      status: "read"
    },
    {
      id: 6,
      name: "Bro",
      lastMessage: "Bangalore busstand",
      timestamp: "Yesterday",
      unreadCount: 0,
      isGroup: false,
      avatar: "👨",
      status: "read"
    },
    {
      id: 7,
      name: "Pondy",
      lastMessage: "This message was deleted",
      timestamp: "Yesterday",
      unreadCount: 1,
      isGroup: false,
      avatar: "👨",
      status: "deleted"
    },
    {
      id: 8,
      name: "Gnanesh aditya",
      lastMessage: "yep",
      timestamp: "Sunday",
      unreadCount: 0,
      isGroup: false,
      avatar: "👶",
      status: "read"
    },
    {
      id: 9,
      name: "+91 91520 22509",
      lastMessage: "im not interested, thank you",
      timestamp: "Sunday",
      unreadCount: 0,
      isGroup: false,
      avatar: "💼",
      status: "read"
    }
  ];

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "read":
        return "✓✓";
      case "delivered":
        return "✓✓";
      case "sent":
        return "✓";
      case "deleted":
        return "🚫";
      case "joined":
        return "➕";
      default:
        return "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            WhatsApp
          </h1>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              🔒
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              ➕
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
              ⋮
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start a new chat"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {["All", "Unread", "Favourites", "Groups"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
              selectedChat?.id === chat.id
                ? "bg-gray-100 dark:bg-gray-700"
                : ""
            }`}
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xl mr-3">
              {chat.avatar}
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                  {chat.name}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {chat.timestamp}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex items-center gap-1">
                  {getStatusIcon(chat.status)}
                  {chat.lastMessage}
                </p>
                {chat.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onToggleTheme}
          className="w-full p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>
    </div>
  );
};

export default ChatList;
