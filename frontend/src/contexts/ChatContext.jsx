import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { apiService } from "../services/api";
import { websocketService } from "../services/websocket";

const ChatContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  // Load conversations from backend
  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const backendConversations = await apiService.getConversations();
      const transformedConversations = backendConversations.map((conv) =>
        apiService.transformConversation(conv)
      );

      setConversations(transformedConversations);
      console.log("✅ Conversations loaded:", transformedConversations.length);
    } catch (error) {
      console.error("❌ Failed to load conversations:", error);
      setError("Failed to load conversations");

      // Fallback to sample data if backend is not available
      console.log("🔄 Falling back to sample data...");
      const { sampleChats } = await import("../utils/chatData");
      setConversations(sampleChats);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load messages for a specific chat
  const loadMessages = useCallback(async (waId) => {
    try {
      setLoading(true);
      setError(null);

      const backendMessages = await apiService.getMessages(waId);
      const transformedMessages = backendMessages.map((msg) =>
        apiService.transformMessage(msg)
      );

      setMessages((prev) => ({
        ...prev,
        [waId]: transformedMessages,
      }));

      console.log(
        `✅ Messages loaded for ${waId}:`,
        transformedMessages.length
      );
      return transformedMessages;
    } catch (error) {
      console.error(`❌ Failed to load messages for ${waId}:`, error);
      setError("Failed to load messages");

      // Fallback to sample data if backend is not available
      console.log("🔄 Falling back to sample data...");
      const { sampleChats } = await import("../utils/chatData");
      const chat = sampleChats.find((c) => c.phoneNumber === waId);
      if (chat) {
        setMessages((prev) => ({
          ...prev,
          [waId]: chat.messages,
        }));
        return chat.messages;
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Send a new message
  const sendMessage = useCallback(
    async (waId, content) => {
      try {
        const messageData = {
          wa_id: waId,
          content,
          from: "918329446654", // Business number
          to: waId,
          user_name:
            conversations.find((c) => c.waId === waId)?.name || "Unknown User",
        };

        // Create a unique temporary ID for the message
        const tempId = `temp-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        // Optimistically add message to UI
        const newMessage = {
          id: tempId,
          text: content,
          sender: "me",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "sent",
          date: new Date().toLocaleDateString(),
          isTemp: true, // Mark as temporary message
        };

        setMessages((prev) => ({
          ...prev,
          [waId]: [...(prev[waId] || []), newMessage],
        }));

        // Update conversation last message
        setConversations((prev) =>
          prev.map((conv) =>
            conv.waId === waId
              ? {
                  ...conv,
                  lastMessage: content,
                  timestamp: newMessage.timestamp,
                }
              : conv
          )
        );

        // Send to backend
        const savedMessage = await apiService.sendMessage(messageData);
        console.log("✅ Message sent successfully:", savedMessage);

        // Replace temporary message with real message
        setMessages((prev) => ({
          ...prev,
          [waId]: prev[waId].map((msg) =>
            msg.id === tempId
              ? {
                  ...apiService.transformMessage(savedMessage),
                  isTemp: false,
                }
              : msg
          ),
        }));

        // Don't send WebSocket message for our own messages to prevent duplicates
        // The backend will handle broadcasting to other clients

        return savedMessage;
      } catch (error) {
        console.error("❌ Failed to send message:", error);
        setError("Failed to send message");

        // Remove optimistic message on error
        setMessages((prev) => ({
          ...prev,
          [waId]: prev[waId].filter((msg) => !msg.isTemp),
        }));

        throw error;
      }
    },
    [conversations]
  );

  // Initialize WebSocket connection
  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect();

    // Subscribe to real-time updates
    const unsubscribeNewMessage = websocketService.subscribe(
      "new_message",
      (data) => {
        console.log("📨 New message received via WebSocket:", data);

        // Only process messages from other users (not our own)
        if (data.waId && data.message && data.message.from !== "918329446654") {
          const transformedMessage = apiService.transformMessage(data.message);

          setMessages((prev) => {
            const existingMessages = prev[data.waId] || [];

            // Check if message already exists to prevent duplicates
            const messageExists = existingMessages.some(
              (msg) =>
                msg.id === transformedMessage.id ||
                (msg.text === transformedMessage.text &&
                  msg.sender === transformedMessage.sender &&
                  Math.abs(
                    new Date(msg.timestamp) -
                      new Date(transformedMessage.timestamp)
                  ) < 5000) // Within 5 seconds
            );

            if (messageExists) {
              console.log("⚠️ Message already exists, skipping duplicate");
              return prev;
            }

            return {
              ...prev,
              [data.waId]: [...existingMessages, transformedMessage],
            };
          });
        }

        // Update conversations list
        loadConversations();
      }
    );

    const unsubscribeStatusUpdate = websocketService.subscribe(
      "status_update",
      (data) => {
        console.log("📊 Status update received via WebSocket:", data);

        // Update message status
        if (data.waId && messages[data.waId]) {
          setMessages((prev) => ({
            ...prev,
            [data.waId]: prev[data.waId].map((msg) =>
              msg.id === data.messageId
                ? { ...msg, status: data.newStatus }
                : msg
            ),
          }));
        }
      }
    );

    const unsubscribeNewConversation = websocketService.subscribe(
      "new_conversation",
      (data) => {
        console.log("💬 New conversation received via WebSocket:", data);
        loadConversations();
      }
    );

    // Monitor connection status
    const checkConnection = () => {
      const connected = websocketService.getConnectionStatus();
      setIsOnline(connected);
    };

    const connectionInterval = setInterval(checkConnection, 5000);

    // Cleanup
    return () => {
      unsubscribeNewMessage();
      unsubscribeStatusUpdate();
      unsubscribeNewConversation();
      clearInterval(connectionInterval);
      websocketService.disconnect();
    };
  }, [loadConversations, messages]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Auto-load messages when chat is selected
  useEffect(() => {
    if (selectedChat?.waId && !messages[selectedChat.waId]) {
      loadMessages(selectedChat.waId);
    }
  }, [selectedChat, messages, loadMessages]);

  const value = {
    selectedChat,
    setSelectedChat,
    conversations,
    messages,
    loading,
    error,
    isOnline,
    loadConversations,
    loadMessages,
    sendMessage,
    clearError: () => setError(null),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
