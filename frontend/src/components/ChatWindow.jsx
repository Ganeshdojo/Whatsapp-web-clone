import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Video, Phone, Plus, Send, Mic } from "lucide-react";
import { useChat } from "../contexts/ChatContext";

const ChatWindow = () => {
  const {
    selectedChat,
    setSelectedChat,
    messages,
    loading,
    error,
    sendMessage,
    clearError,
  } = useChat();
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "read":
        return "✓✓";
      case "delivered":
        return "✓✓";
      case "sent":
        return "✓";
      default:
        return "✓";
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      setSending(true);
      await sendMessage(
        selectedChat.waId || selectedChat.phoneNumber,
        newMessage.trim()
      );
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  if (!selectedChat) {
    return (
      <div className="h-full bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome to WhatsApp Web Clone
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Select a conversation to start messaging
          </p>
        </div>
      </div>
    );
  }

  const currentMessages =
    messages[selectedChat.waId || selectedChat.phoneNumber] || [];

  return (
    <div className="h-full bg-gray-100 dark:bg-zinc-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-600">
        <div className="flex items-center">
          {/* Mobile Back Button */}
          <button
            onClick={() => setSelectedChat(null)}
            className="md:hidden p-2 mr-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Avatar */}
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full ${getAvatarColor(
              selectedChat.name
            )} flex items-center justify-center text-white font-semibold text-base md:text-lg mr-3`}
          >
            {getInitials(selectedChat.name)}
          </div>

          {/* Chat Info */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-zinc-200">
              {selectedChat.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-zinc-400">
              {selectedChat.isGroup
                ? `${selectedChat.memberCount} members`
                : selectedChat.phoneNumber}
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Loading messages...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center p-6">
            <div className="text-red-500 text-4xl mb-2">⚠️</div>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={clearError}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
            >
              Try Again
            </button>
          </div>
        ) : currentMessages.length === 0 ? (
          <div className="text-center p-6">
            <div className="text-gray-400 text-4xl mb-2">💬</div>
            <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
            <p className="text-gray-400 text-sm">Start the conversation!</p>
          </div>
        ) : (
          currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                  message.sender === "me"
                    ? "bg-green-500 text-white dark:bg-green-800"
                    : "bg-white dark:bg-zinc-700 text-gray-800 dark:text-zinc-200"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp}
                  </span>
                  {message.sender === "me" && (
                    <span className="text-xs opacity-70">
                      {getStatusIcon(message.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 bg-white dark:bg-zinc-800 border-t border-gray-200 dark:border-zinc-600">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-600 rounded-full">
            <Plus className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              disabled={sending}
              className="w-full px-4 md:px-4 py-4 bg-gray-100 dark:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 dark:border-green-800"></div>
            ) : (
              <Send className="w-5 h-5" color="lime" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
