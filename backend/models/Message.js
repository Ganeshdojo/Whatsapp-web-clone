const mongoose = require("mongoose");

// Define the schema for our messages
// A schema is like a blueprint that tells MongoDB what our data should look like
const messageSchema = new mongoose.Schema(
  {
    // WhatsApp message ID - unique identifier from WhatsApp
    message_id: {
      type: String,
      required: true,
      unique: true,
    },

    // Meta message ID - used to link status updates to messages
    meta_msg_id: {
      type: String,
      required: true,
    },

    // WhatsApp ID of the user (for grouping conversations)
    wa_id: {
      type: String,
      required: true,
      index: true, // This makes searching by wa_id faster
    },

    // Phone number of the sender
    from: {
      type: String,
      required: true,
    },

    // Phone number of the recipient (business number)
    to: {
      type: String,
      required: true,
    },

    // Type of message: "text" for actual messages, "status_update" for status changes
    message_type: {
      type: String,
      required: true,
      enum: ["text", "status_update"], // Only allow these two values
    },

    // The actual content: message text or status
    content: {
      type: String,
      required: true,
    },

    // Message status: "sent", "delivered", "read"
    status: {
      type: String,
      default: "sent",
      enum: ["sent", "delivered", "read"],
    },

    // When the message was sent/received (WhatsApp timestamp)
    timestamp: {
      type: Date,
      required: true,
    },

    // Name of the user (from their profile)
    user_name: {
      type: String,
      default: "",
    },

    // Conversation ID (same as wa_id, for easy grouping)
    conversation_id: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    // These options add automatic timestamps
    timestamps: {
      created_at: true, // When we stored the message in our database
      updated_at: true, // When we last updated the message
    },
  }
);

// Create an index on multiple fields for faster queries
messageSchema.index({ wa_id: 1, timestamp: -1 });

// Export the model so we can use it in other files
module.exports = mongoose.model("Message", messageSchema);
