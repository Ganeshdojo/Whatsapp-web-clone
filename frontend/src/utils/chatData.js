// WhatsApp payload processor - reads and processes real webhook data
import payload1Msg1 from "../../payloads/conversation_1_message_1.json";
import payload1Msg2 from "../../payloads/conversation_1_message_2.json";
import payload1Status1 from "../../payloads/conversation_1_status_1.json";
import payload1Status2 from "../../payloads/conversation_1_status_2.json";
import payload2Msg1 from "../../payloads/conversation_2_message_1.json";
import payload2Msg2 from "../../payloads/conversation_2_message_2.json";
import payload2Status1 from "../../payloads/conversation_2_status_1.json";
import payload2Status2 from "../../payloads/conversation_2_status_2.json";

// Process WhatsApp webhook payloads to extract chat data
const processPayload = (payload) => {
  try {
    const entry = payload.metaData.entry[0];
    const changes = entry.changes[0];

    if (changes.field === "messages") {
      const value = changes.value;
      const contact = value.contacts[0];
      const message = value.messages[0];

      return {
        contactName: contact.profile.name,
        phoneNumber: contact.wa_id,
        messageText: message.text.body,
        messageId: message.id,
        timestamp: message.timestamp,
        messageType: message.type,
        createdAt: payload.createdAt,
        conversationId: payload._id,
      };
    }

    return null;
  } catch (error) {
    console.error("Error processing payload:", error);
    return null;
  }
};

// Process all payloads to build conversations
const buildConversations = () => {
  const conversations = new Map();

  // Process all payloads
  const allPayloads = [
    payload1Msg1,
    payload1Msg2,
    payload1Status1,
    payload1Status2,
    payload2Msg1,
    payload2Msg2,
    payload2Status1,
    payload2Status2,
  ];

  allPayloads.forEach((payload) => {
    const processed = processPayload(payload);
    if (processed) {
      const key = processed.phoneNumber;

      if (!conversations.has(key)) {
        conversations.set(key, {
          id: key,
          name: processed.contactName,
          phoneNumber: processed.phoneNumber,
          lastMessage: processed.messageText,
          timestamp: new Date(
            parseInt(processed.timestamp) * 1000
          ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          unreadCount: 0,
          isGroup: false,
          status: "unread",
          messages: [],
          conversationId: processed.conversationId,
        });
      }

      // Add message to conversation
      const conversation = conversations.get(key);
      conversation.messages.push({
        id: processed.messageId,
        text: processed.messageText,
        sender: "them",
        timestamp: new Date(
          parseInt(processed.timestamp) * 1000
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: "read",
        date: new Date(
          parseInt(processed.timestamp) * 1000
        ).toLocaleDateString(),
      });

      // Update last message and timestamp
      conversation.lastMessage = processed.messageText;
      conversation.timestamp = new Date(
        parseInt(processed.timestamp) * 1000
      ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  });

  // Convert Map to array and add some demo responses
  const conversationsArray = Array.from(conversations.values()).map(
    (conv, index) => {
      // Add demo responses to make conversations more realistic
      if (conv.messages.length > 0) {
        const lastMessage = conv.messages[conv.messages.length - 1];
        const responseTime =
          new Date(parseInt(lastMessage.timestamp) * 1000).getTime() +
          5 * 60 * 1000; // 5 minutes later

        conv.messages.push({
          id: `response-${conv.id}-${index}`,
          text: generateDemoResponse(conv.name, lastMessage.text),
          sender: "me",
          timestamp: new Date(responseTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "read",
          date: new Date(responseTime).toLocaleDateString(),
        });

        // Update last message to show the response
        conv.lastMessage = conv.messages[conv.messages.length - 1].text;
        conv.timestamp = conv.messages[conv.messages.length - 1].timestamp;
      }

      return {
        ...conv,
        id: index + 1, // Ensure unique IDs
      };
    }
  );

  return conversationsArray;
};

// Generate realistic demo responses based on the incoming message
const generateDemoResponse = (contactName, message) => {
  const responses = [
    "Thanks for reaching out! I'll get back to you soon.",
    "Hi! Thanks for your message. How can I help you today?",
    "Hello! I appreciate you contacting us. Let me assist you with that.",
    "Thanks for the message! I'm here to help.",
    "Hi there! Thanks for reaching out. What can I do for you?",
  ];

  // Custom responses based on message content
  if (message.toLowerCase().includes("service")) {
    return "Hello! We offer comprehensive digital solutions. What specific service are you interested in?";
  }

  if (
    message.toLowerCase().includes("ad") ||
    message.toLowerCase().includes("details")
  ) {
    return "Hi! I'd be happy to share more details about our services. What type of business do you have?";
  }

  // Return random response if no specific match
  return responses[Math.floor(Math.random() * responses.length)];
};

// Generate chat data from actual payloads
export const sampleChats = buildConversations();

export const getChatById = (id) => {
  return sampleChats.find((chat) => chat.id === id);
};

export const updateChatLastMessage = (chatId, message) => {
  const chat = sampleChats.find((c) => c.id === chatId);
  if (chat) {
    chat.lastMessage = message.text;
    chat.timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    chat.unreadCount = 0;
  }
};

// Export the payload processor for potential future use
export const processWhatsAppPayload = processPayload;
