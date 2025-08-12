const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

// Import our routes (we'll create these next)
const apiRoutes = require("./routes/api");

// Create an Express application
const app = express();

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
    message: "WhatsApp Web Clone Backend is running! 🚀",
    timestamp: new Date().toISOString(),
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
    console.log("✅ Connected to MongoDB successfully!");

    // Start the server only after database connection is established
    startServer();
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // Exit the process if we can't connect to database
  }
};

// Function to start the Express server
const startServer = () => {
  const PORT = config.PORT;

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📱 WhatsApp Web Clone Backend ready!`);
    console.log(`🌐 Open http://localhost:${PORT} to test`);
  });
};

// Connect to database and start server
connectDB();
