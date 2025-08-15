const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const config = require("./config");

// Import our routes (we'll create these next)
const apiRoutes = require("./routes/api");

// Create an Express application
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store client information for better message handling
const clients = new Map();

// WebSocket connection handling
wss.on("connection", (ws, req) => {
  console.log(" New WebSocket connection established");

  // Generate unique client ID
  const clientId = `client-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

  // Store client information
  clients.set(ws, {
    id: clientId,
    connectedAt: new Date(),
    lastActivity: new Date(),
  });

  // Send connection acknowledgment
  ws.send(
    JSON.stringify({
      type: "connection_ack",
      data: {
        message: "Connected to WhatsApp Web Clone Backend",
        clientId: clientId,
      },
    })
  );

  // Handle incoming messages
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      console.log(" WebSocket message received:", data);

      // Update last activity
      const clientInfo = clients.get(ws);
      if (clientInfo) {
        clientInfo.lastActivity = new Date();
      }

      // Handle different message types
      switch (data.type) {
        case "new_message":
          // Broadcast new message to all OTHER clients (not the sender)
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "new_message",
                  data: data.data,
                })
              );
            }
          });
          break;

        case "status_update":
          // Broadcast status update to all OTHER clients
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(
                JSON.stringify({
                  type: "message_status_update",
                  data: data.data,
                })
              );
            }
          });
          break;

        case "ping":
          // Respond to ping with pong
          ws.send(
            JSON.stringify({
              type: "pong",
              data: { timestamp: new Date().toISOString() },
            })
          );
          break;

        default:
          console.log("Unknown WebSocket message type:", data.type);
      }
    } catch (error) {
      console.error("Error processing WebSocket message:", error);
    }
  });

  // Handle client disconnect
  ws.on("close", (event) => {
    console.log("WebSocket connection closed:", event.code, event.reason);

    // Clean up client information
    clients.delete(ws);

    // Log connection statistics
    console.log(` Active connections: ${wss.clients.size}`);
  });

  // Handle WebSocket errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);

    // Clean up client information on error
    clients.delete(ws);
  });

  // Log connection statistics
  console.log(` Total connections: ${wss.clients.size}`);
});

// Clean up inactive connections every 5 minutes
setInterval(() => {
  const now = new Date();
  wss.clients.forEach((client) => {
    const clientInfo = clients.get(client);
    if (clientInfo) {
      const inactiveTime = now - clientInfo.lastActivity;
      // Close connections inactive for more than 30 minutes
      if (inactiveTime > 30 * 60 * 1000) {
        console.log(` Closing inactive connection: ${clientInfo.id}`);
        client.close(1000, "Inactive connection");
        clients.delete(client);
      }
    }
  });
}, 5 * 60 * 1000);

// Middleware - these are like "filters" that process requests before they reach our routes
// CORS allows our frontend (which will be on a different URL) to talk to our backend
app.use(cors());

// This middleware parses JSON data from incoming requests
app.use(express.json());

// This middleware parses URL-encoded data (like form submissions)
app.use(express.urlencoded({ extended: true }));

// Basic route to test if our server is working
app.get("/", (req, res) => {
  res.json({
    message: "WhatsApp Web Clone Backend is running! ",
    timestamp: new Date().toISOString(),
    websocket: "WebSocket server is active",
    connections: wss.clients.size,
  });
});

// Use our API routes - all routes starting with /api will go to apiRoutes
app.use("/api", apiRoutes);

// Error handling middleware - catches any errors and sends a proper response
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Connect to MongoDB using the connection string from our config
    await mongoose.connect(config.MONGODB_URI);
    console.log(" Connected to MongoDB successfully!");

    // Start the server only after database connection is established
    startServer();
  } catch (error) {
    console.error(" MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process if we can't connect to database
  }
};

// Function to start the Express server
const startServer = () => {
  const PORT = config.PORT;

  server.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(` WhatsApp Web Clone Backend ready!`);
    console.log(` Open http://localhost:${PORT} to test`);
    console.log(` WebSocket server is active on ws://localhost:${PORT}`);
  });
};

// Connect to database and start server
connectDB();

// Export for testing purposes
module.exports = { app, server, wss };
