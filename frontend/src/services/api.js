// API service for communicating with the WhatsApp Web Clone backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Get all conversations
  async getConversations() {
    return this.request('/conversations');
  }

  // Get messages for a specific user
  async getMessages(waId) {
    return this.request(`/messages/${waId}`);
  }

  // Send a new message
  async sendMessage(messageData) {
    return this.request('/messages', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Transform backend conversation data to frontend format
  transformConversation(backendConv) {
    return {
      id: backendConv._id,
      name: backendConv.user_name || 'Unknown User',
      phoneNumber: backendConv.from,
      lastMessage: backendConv.latestMessage?.content || 'No messages yet',
      timestamp: this.formatTimestamp(backendConv.latestMessage?.timestamp),
      unreadCount: 0, // Backend doesn't track this yet
      isGroup: false,
      status: 'read',
      waId: backendConv._id,
      messageCount: backendConv.messageCount,
    };
  }

  // Transform backend message data to frontend format
  transformMessage(backendMsg) {
    return {
      id: backendMsg.message_id,
      text: backendMsg.content,
      sender: backendMsg.from === '918329446654' ? 'me' : 'them', // Business number check
      timestamp: this.formatTimestamp(backendMsg.timestamp),
      status: backendMsg.status,
      date: this.formatDate(backendMsg.timestamp),
    };
  }

  // Format timestamp for display
  formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  // Format date for display
  formatDate(timestamp) {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString();
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
