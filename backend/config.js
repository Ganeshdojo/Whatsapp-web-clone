// Configuration file for our WhatsApp Web Clone backend
// Load environment variables from .env file
require("dotenv").config();

module.exports = {
  // MongoDB Connection String - Get this from your MongoDB Atlas dashboard
  // Go to your cluster → Connect → Connect your application → Copy the connection string
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/whatsapp",

  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
};
