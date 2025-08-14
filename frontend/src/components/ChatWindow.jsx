import { useState, useEffect, useRef } from "react";

const ChatWindow = ({ chat, theme }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample messages data - in real app this would come from backend
  useEffect(() => {
    if (chat) {
      const sampleMessages = [
        {
          id: 1,
          text: "Dear Candidate, We are hiring for frontend developer fresher position. 12 month contract. Required Qualification- B.tech/MCA/BCA. Required Skills WordPress/HTML/CSS/JS. Please check the link for security contract details: https://wavenix.cloud/bond-information/ Company: Wavenix Technologies Lucknow. About Company: We are a digital growth partner specializing in delivering innovative IT solutions.",
          sender: "them",
          timestamp: "21:12",
          status: "read",
          date: "2/8/2025"
        },
        {
          id: 2,
          text: "Thank you, Why do I need to pay the 15000rs?",
          sender: "me",
          timestamp: "11:59",
          status: "read"
        },
        {
          id: 3,
          text: "We specialize in delivering innovative IT solutions that help businesses grow and succeed in the digital age.",
          sender: "them",
          timestamp: "13:44",
          status: "read"
        },
        {
          id: 4,
          text: "why do I need to pay 15000rs?",
          sender: "me",
          timestamp: "14:40",
          status: "read"
        },
        {
          id: 5,
          text: "The 15000rs is a security deposit for the 12-month contract period. It ensures commitment and covers any potential damages or early termination fees.",
          sender: "them",
          timestamp: "15:30",
          status: "delivered"
        }
      ];
      setMessages(sampleMessages);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: "sent"
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Simulate typing indicator
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        // Simulate received message
        const reply = {
          id: Date.now() + 1,
          text: "Thanks for your message! I'll get back to you soon.",
          sender: "them",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: "read"
        };
        setMessages(prev => [...prev, reply]);
      }, 2000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
        return "";
    }
  };

  const formatDate = (date) => {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (today.toDateString() === messageDate.toDateString()) {
      return "Today";
    } else if (today.getDate() - messageDate.getDate() === 1) {
      return "Yesterday";
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  if (!chat) return null;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-800">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-lg mr-3">
            {chat.avatar}
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 dark:text-white">
              {chat.name}
            </h2>
            {chat.isGroup && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Group • {chat.memberCount || 0} members
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            📹
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            📞
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            🔍
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            ⋮
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Encryption Notice */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm">
            🔒 Messages and calls are end-to-end encrypted
          </div>
        </div>

        {messages.map((message, index) => (
          <div key={message.id}>
            {/* Date Separator */}
            {index === 0 || 
             (messages[index - 1] && 
              formatDate(messages[index - 1].date) !== formatDate(message.date)) && (
              <div className="text-center my-4">
                <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full text-sm">
                  {formatDate(message.date)}
                </span>
              </div>
            )}

            {/* Message Bubble */}
            <div className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "me"
                    ? "bg-green-500 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                }`}
              >
                <p className="text-sm break-words">{message.text}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${
                  message.sender === "me" ? "text-green-100" : "text-gray-500 dark:text-gray-400"
                }`}>
                  <span className="text-xs">{message.timestamp}</span>
                  {message.sender === "me" && (
                    <span className="text-xs">{getStatusIcon(message.status)}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-700 px-4 py-2 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            ➕
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            😊
          </button>
          <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full">
            🎤
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
