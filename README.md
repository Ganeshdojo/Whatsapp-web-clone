# WhatsApp Web Clone

A full-stack WhatsApp Web-like chat interface that displays real-time WhatsApp conversations using webhook data. Built with Node.js, Express, MongoDB, and React.

## 🚀 Features

- **Webhook Payload Processing**: Automatically processes WhatsApp Business API webhooks
- **Real-time Chat Interface**: WhatsApp Web-like UI with message bubbles and status indicators
- **Conversation Management**: Group messages by user with conversation history
- **Status Tracking**: Monitor message delivery status (sent, delivered, read)
- **Demo Message System**: Send and store new messages (demo only)
- **Responsive Design**: Works on both mobile and desktop devices

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Socket.IO** - Real-time communication (bonus feature)

### Frontend
- **React** - User interface library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 📁 Project Structure

```
whatsapp-web-clone/
├── backend/                 # Backend server
│   ├── server.js           # Main server file
│   ├── config.js           # Configuration
│   ├── routes/             # API routes
│   ├── models/             # Database models
│   ├── scripts/            # Data processing scripts
│   └── package.json        # Backend dependencies
├── frontend/               # React frontend (coming soon)
├── whatsapp sample payloads/ # Sample webhook data
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd whatsapp-web-clone
```

### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.template)
cp env.template .env

# Edit .env with your MongoDB connection string
# Get this from: MongoDB Atlas → Your Cluster → Connect → Connect your application

# Process sample payloads
node scripts/process-payloads.js

# Start development server
npm run dev
```

### 3. Frontend Setup (Coming Soon)
```bash
cd frontend
npm install
npm start
```

## 🔧 Environment Variables

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/whatsapp?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 📱 API Endpoints

- `GET /` - Health check
- `GET /api/health` - API health check
- `GET /api/conversations` - Get all conversations
- `GET /api/messages/:wa_id` - Get messages for a user
- `POST /api/messages` - Send demo message

## 🗄️ Database Schema

The `processed_messages` collection stores:
- Message content and metadata
- User information (name, phone number)
- Message status (sent, delivered, read)
- Timestamps and conversation grouping

## 🎯 Development Phases

- ✅ **Phase 1**: Backend Foundation (Complete)
- 🔄 **Phase 2**: Frontend Development (Next)
- ⏳ **Phase 3**: Real-time Features (Bonus)
- ⏳ **Phase 4**: Deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is for educational purposes and evaluation.

## 🆘 Support

If you encounter any issues:
1. Check the troubleshooting section in backend/README.md
2. Verify your MongoDB connection string
3. Ensure all dependencies are installed
4. Check the console for error messages

---

**Built with ❤️ for the RapidQuest Full Stack Developer evaluation**
