const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const config = require("../config");
const Message = require("../models/Message");

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("✅ Connected to MongoDB successfully!");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Function to read all JSON files from the sample payloads folder
const readPayloadFiles = () => {
  const payloadsDir = path.join(__dirname, "../../whatsapp sample payloads");
  const files = fs.readdirSync(payloadsDir);

  // Filter only JSON files
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  console.log(`📁 Found ${jsonFiles.length} JSON files to process`);

  return jsonFiles.map((file) => {
    const filePath = path.join(payloadsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    return {
      filename: file,
      data: JSON.parse(content),
    };
  });
};

// Function to extract message data from payload
const extractMessageData = (payload) => {
  try {
    const entry = payload.metaData.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;

    // Check if this is a message payload
    if (value.messages && value.messages.length > 0) {
      const message = value.messages[0];
      const contact = value.contacts[0];

      return {
        message_id: message.id,
        meta_msg_id: message.id, // For messages, meta_msg_id is the same as message_id
        wa_id: contact.wa_id,
        from: message.from,
        to: value.metadata.display_phone_number,
        message_type: "text",
        content: message.text.body,
        status: "sent", // Default status for new messages
        timestamp: new Date(parseInt(message.timestamp) * 1000), // Convert Unix timestamp
        user_name: contact.profile.name,
        conversation_id: contact.wa_id,
      };
    }

    return null; // Not a message payload
  } catch (error) {
    console.error("❌ Error extracting message data:", error);
    return null;
  }
};

// Function to extract status data from payload
const extractStatusData = (payload) => {
  try {
    const entry = payload.metaData.entry[0];
    const changes = entry.changes[0];
    const value = changes.value;

    // Check if this is a status payload
    if (value.statuses && value.statuses.length > 0) {
      const status = value.statuses[0];

      return {
        meta_msg_id: status.meta_msg_id,
        status: status.status,
        timestamp: new Date(parseInt(status.timestamp) * 1000),
      };
    }

    return null; // Not a status payload
  } catch (error) {
    console.error("❌ Error extracting status data:", error);
    return null;
  }
};

// Function to process all payloads
const processPayloads = async () => {
  try {
    console.log("🚀 Starting payload processing...");

    // Read all JSON files
    const payloads = readPayloadFiles();

    // Separate message and status payloads
    const messagePayloads = [];
    const statusPayloads = [];

    payloads.forEach(({ filename, data }) => {
      if (data.payload_type === "whatsapp_webhook") {
        // Check if it's a message payload
        if (data.metaData.entry[0].changes[0].value.messages) {
          messagePayloads.push({ filename, data });
        }
        // Check if it's a status payload
        else if (data.metaData.entry[0].changes[0].value.statuses) {
          statusPayloads.push({ filename, data });
        }
      }
    });

    console.log(`📨 Found ${messagePayloads.length} message payloads`);
    console.log(`📊 Found ${statusPayloads.length} status payloads`);

    // Process messages first
    console.log("\n📝 Processing messages...");
    const messageMap = new Map(); // message_id → _id mapping

    for (const { filename, data } of messagePayloads) {
      const messageData = extractMessageData(data);
      if (messageData) {
        try {
          // Check if message already exists
          const existingMessage = await Message.findOne({
            message_id: messageData.message_id,
          });

          if (existingMessage) {
            console.log(
              `⏭️  Message already exists: ${messageData.message_id}`
            );
            messageMap.set(messageData.message_id, existingMessage._id);
          } else {
            // Create new message
            const newMessage = new Message(messageData);
            const savedMessage = await newMessage.save();
            messageMap.set(messageData.message_id, savedMessage._id);
            console.log(
              `✅ Saved message: ${messageData.content.substring(0, 50)}...`
            );
          }
        } catch (error) {
          console.error(
            `❌ Error saving message from ${filename}:`,
            error.message
          );
        }
      }
    }

    // Process status updates
    console.log("\n📊 Processing status updates...");
    let statusUpdates = 0;

    for (const { filename, data } of statusPayloads) {
      const statusData = extractStatusData(data);
      if (statusData) {
        try {
          // Find message by meta_msg_id and update status
          const updatedMessage = await Message.findOneAndUpdate(
            { meta_msg_id: statusData.meta_msg_id },
            {
              status: statusData.status,
              updated_at: new Date(),
            },
            { new: true }
          );

          if (updatedMessage) {
            statusUpdates++;
            console.log(
              `✅ Updated status to ${
                statusData.status
              }: ${updatedMessage.content.substring(0, 50)}...`
            );
          } else {
            console.log(
              `⚠️  Could not find message for status update: ${statusData.meta_msg_id}`
            );
          }
        } catch (error) {
          console.error(
            `❌ Error updating status from ${filename}:`,
            error.message
          );
        }
      }
    }

    console.log("\n🎉 Payload processing completed!");
    console.log(`📊 Summary:`);
    console.log(`   - Messages processed: ${messageMap.size}`);
    console.log(`   - Status updates: ${statusUpdates}`);

    // Show final data count
    const totalMessages = await Message.countDocuments();
    console.log(`   - Total messages in database: ${totalMessages}`);
  } catch (error) {
    console.error("❌ Error processing payloads:", error);
  }
};

// Main execution
const main = async () => {
  try {
    // Connect to database
    await connectDB();

    // Process payloads
    await processPayloads();

    // Close database connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Main execution error:", error);
  }
};

// Run the script
main();
