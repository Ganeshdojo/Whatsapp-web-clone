// WebSocket service for real-time updates
class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.listeners = new Map();
    this.isConnected = false;
  }

  // Connect to WebSocket server
  connect(url = import.meta.env.VITE_WS_URL || "ws://localhost:5000") {
    try {
      console.log(" Connecting to WebSocket server...");

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log(" WebSocket connected successfully");
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;

        // Send initial connection message
        this.send({ type: "connection", data: { client: "frontend" } });
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.handleMessage(message);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = (event) => {
        console.log(" WebSocket connection closed:", event.code, event.reason);
        this.isConnected = false;
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error(" WebSocket error:", error);
        this.isConnected = false;
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.handleReconnect();
    }
  }

  // Handle incoming WebSocket messages
  handleMessage(message) {
    console.log(" WebSocket message received:", message);

    switch (message.type) {
      case "new_message":
        this.notifyListeners("new_message", message.data);
        break;
      case "message_status_update":
        this.notifyListeners("status_update", message.data);
        break;
      case "new_conversation":
        this.notifyListeners("new_conversation", message.data);
        break;
      case "connection_ack":
        console.log(" WebSocket connection acknowledged by server");
        break;
      default:
        console.log("Unknown message type:", message.type);
    }
  }

  // Send message to WebSocket server
  send(data) {
    if (this.ws && this.isConnected) {
      try {
        this.ws.send(JSON.stringify(data));
      } catch (error) {
        console.error("Failed to send WebSocket message:", error);
      }
    } else {
      console.warn("WebSocket not connected, message not sent:", data);
    }
  }

  // Subscribe to specific events
  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  // Notify all listeners of an event
  notifyListeners(event, data) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error("Error in WebSocket listener:", error);
        }
      });
    }
  }

  // Handle reconnection with exponential backoff
  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      ` Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
    );

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Disconnect WebSocket
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
    this.listeners.clear();
  }

  // Get connection status
  getConnectionStatus() {
    return this.isConnected;
  }
}

// Create and export a singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
