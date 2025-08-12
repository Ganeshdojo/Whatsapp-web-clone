const express = require("express");
const Message = require("../models/Message");

// Create a router - this is like a mini-Express app for our API routes
const router = express.Router();

// GET /api/conversations - Get all conversations grouped by user
router.get("/conversations", async (req, res) => {
  try {
    console.log("📱 Fetching conversations...");

    // Use MongoDB aggregation to group messages by user
    // This is like saying "give me all users and their latest message"
    const conversations = await Message.aggregate([
      // First, sort messages by timestamp (newest first)
      { $sort: { timestamp: -1 } },

      // Group by wa_id (WhatsApp user ID)
      {
        $group: {
          _id: "$wa_id",
          // Get the most recent message for each user
          latestMessage: { $first: "$$ROOT" },
          // Count total messages for each user
          messageCount: { $sum: 1 },
          // Get user name from the latest message
          user_name: { $first: "$user_name" },
          // Get the phone number
          from: { $first: "$from" },
        },
      },

      // Sort conversations by latest message timestamp
      { $sort: { "latestMessage.timestamp": -1 } },
    ]);

    console.log(`✅ Found ${conversations.length} conversations`);
    res.json(conversations);
  } catch (error) {
    console.error("❌ Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// GET /api/messages/:wa_id - Get all messages for a specific user
router.get("/messages/:wa_id", async (req, res) => {
  try {
    const { wa_id } = req.params; // Get the wa_id from the URL
    console.log(`📱 Fetching messages for user: ${wa_id}`);

    // Find all messages for this user, sorted by timestamp (oldest first)
    const messages = await Message.find({ wa_id })
      .sort({ timestamp: 1 }) // 1 means ascending (oldest to newest)
      .select("-__v"); // Don't include the __v field (MongoDB version field)

    console.log(`✅ Found ${messages.length} messages for user ${wa_id}`);
    res.json(messages);
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /api/messages - Send a new demo message
router.post("/messages", async (req, res) => {
  try {
    const { wa_id, content, user_name, from, to } = req.body;

    // Validate required fields
    if (!wa_id || !content || !from || !to) {
      return res.status(400).json({
        error: "Missing required fields: wa_id, content, from, to",
      });
    }

    console.log(`📱 Creating new demo message for user: ${wa_id}`);

    // Create a new message
    const newMessage = new Message({
      message_id: `demo-${Date.now()}`, // Generate a unique ID for demo messages
      meta_msg_id: `demo-${Date.now()}`, // Same as message_id for demo
      wa_id,
      from,
      to,
      message_type: "text",
      content,
      status: "sent",
      timestamp: new Date(),
      user_name: user_name || "Demo User",
      conversation_id: wa_id,
    });

    // Save the message to database
    const savedMessage = await newMessage.save();

    console.log("✅ Demo message created successfully");
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("❌ Error creating demo message:", error);
    res.status(500).json({ error: "Failed to create demo message" });
  }
});

// GET /api/health - Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "WhatsApp Web Clone Backend",
  });
});

// Export the router so we can use it in server.js
module.exports = router;
