# WhatsApp Web Clone Backend

This is the backend server for our WhatsApp Web Clone project. It processes webhook payloads and provides APIs for the frontend.

##  Quick Start

### 1. Update MongoDB Connection String

**IMPORTANT**: You need to update the MongoDB connection string in `config.js`:

1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace the placeholder in `config.js` with your actual connection string

**Example:**
```javascript
MONGODB_URI: 'mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/whatsapp?retryWrites=true&w=majority'
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Process Sample Payloads
This script reads the JSON files and populates your MongoDB database:
```bash
node scripts/process-payloads.js
```

### 4. Start the Server
```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

##  API Endpoints

- `GET /` - Health check
- `GET /api/health` - API health check
- `GET /api/conversations` - Get all conversations grouped by user
- `GET /api/messages/:wa_id` - Get messages for a specific user
- `POST /api/messages` - Send a new demo message

##  Database Schema

The `processed_messages` collection stores:
- Message content and metadata
- User information
- Message status (sent, delivered, read)
- Timestamps

##  Scripts

- `npm run dev` - Start server with nodemon (auto-restart)
- `npm start` - Start server normally
- `node scripts/process-payloads.js` - Process sample payloads

##  Project Structure

```
backend/
├── server.js              # Main server file
├── config.js              # Configuration (database connection)
├── routes/
│   └── api.js            # API routes
├── models/
│   └── Message.js        # Database model
├── scripts/
│   └── process-payloads.js # Payload processing script
└── package.json
```

##  Testing

1. Start the server: `npm run dev`
2. Open your browser to `http://localhost:5000`
3. You should see: "WhatsApp Web Clone Backend is running!"
4. Test the health endpoint: `http://localhost:5000/api/health`

##  Troubleshooting

- **Port already in use**: Change the PORT in `config.js` to another number (e.g., 5001)
- **Script errors**: Make sure you're in the `backend` directory when running scripts
