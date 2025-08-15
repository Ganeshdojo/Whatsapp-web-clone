# WhatsApp Web Clone - Full Stack Project

A complete WhatsApp Web clone built with modern web technologies, featuring real-time messaging, WebSocket support, and full-stack integration.

##  Project Status

###  **Day 1: Backend Development (COMPLETED)**
- [x] Set up MongoDB Atlas cluster
- [x] Create Express server with basic routes
- [x] Implement Message model and CRUD operations
- [x] Create payload processing script
- [x] Test with sample data

###  **Day 2: Frontend Development (COMPLETED)**
- [x] Set up React project with Vite
- [x] Integrate Tailwind CSS using Vite plugin
- [x] Build ChatList component (conversations sidebar)
- [x] Build ChatWindow component (messages display)
- [x] Implement message bubbles and status indicators
- [x] Add send message functionality
- [x] Implement Dark and Light Theme
- [x] Mobile responsiveness with WhatsApp-like navigation
- [x] Real WhatsApp payload integration
- [x] Professional UI with Lucide React icons

###  **Day 3: Integration & Deployment (COMPLETED)**
- [x] Connect frontend to backend APIs
- [x] Add WebSocket for real-time updates
- [x] Polish UI and responsiveness
- [x] Testing and bug fixes

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React +      │◄──►│   (Express +    │◄──►│   (MongoDB      │
│   Vite)         │    │   WebSocket)    │    │   Atlas)        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         │              ┌─────────────────┐
         └──────────────►│  WebSocket     │
                        │  Real-time     │
                        │  Updates       │
                        └─────────────────┘
```

##  Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS with Vite plugin
- **Lucide React** - Professional icon library
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **WebSocket** - Real-time communication
- **CORS** - Cross-origin resource sharing

### Infrastructure
- **MongoDB Atlas** - Cloud database
- **Railway** - Deployment platform
- **Environment Variables** - Configuration management

##  Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Railway account (for deployment)

### Backend Setup

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp env.example .env
   # Edit .env with your MongoDB URI
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Start production server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Update API and WebSocket URLs if needed
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## API Endpoints

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/messages/:wa_id` - Get messages for a user
- `POST /api/messages` - Send a new message
- `GET /api/health` - Health check

### WebSocket Events
- `connection` - Client connects
- `new_message` - New message received
- `status_update` - Message status changed
- `new_conversation` - New conversation started

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/whatsapp
PORT=5000
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
VITE_APP_NAME=WhatsApp Web Clone
VITE_APP_VERSION=1.0.0
```

##  Real-time Features

### WebSocket Integration
- **Automatic Reconnection** - Exponential backoff strategy
- **Event-driven Updates** - Real-time message delivery
- **Status Synchronization** - Message read/delivered status
- **Multi-client Support** - Multiple browser tabs/windows

### Message Flow
1. User types and sends message
2. Message sent to backend API
3. Backend saves to MongoDB
4. WebSocket broadcasts to all connected clients
5. Real-time UI updates across all clients

##  Responsive Design

### Mobile-First Approach
- **WhatsApp-like Navigation** - Back button on mobile
- **Conditional Rendering** - ChatList/ChatWindow based on screen size
- **Touch-Friendly** - Proper button sizes and spacing
- **Progressive Enhancement** - Works on all device sizes

### Breakpoints
- **Mobile**: `< 768px` - Single column layout
- **Desktop**: `≥ 768px` - Sidebar + chat window layout

##  UI Components

### ChatList
- **Search Functionality** - Real-time conversation filtering
- **Avatar System** - Initials with dynamic colors
- **Status Indicators** - Online/offline status
- **Theme Toggle** - Dark/light mode switch

### ChatWindow
- **Message Bubbles** - WhatsApp-style message display
- **Status Icons** - Sent, delivered, read indicators
- **Auto-scroll** - Automatic scroll to latest message
- **Input Controls** - Send button, attachment options

##  Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
```bash
# Test backend endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/conversations
```

##  Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check your connection string in `.env`
   - Verify network access in MongoDB Atlas

2. **WebSocket Connection Failed**
   - Ensure backend is running on correct port
   - Check firewall settings

3. **Frontend Build Errors**
   - Clear `node_modules` and reinstall
   - Check Node.js version compatibility

4. **CORS Issues**
   - Verify CORS configuration in backend
   - Check frontend API URL configuration

##  Performance Features

### Frontend Optimizations
- **Code Splitting** - Vite automatic optimization
- **Lazy Loading** - Dynamic imports for components
- **Memoization** - React.memo and useCallback usage
- **Efficient Rendering** - Minimal re-renders

### Backend Optimizations
- **Database Indexing** - Optimized MongoDB queries
- **Connection Pooling** - Efficient database connections
- **WebSocket Management** - Proper cleanup and error handling
- **Error Boundaries** - Graceful error handling

##  Security Features

- **CORS Protection** - Controlled cross-origin access
- **Input Validation** - Server-side data validation
- **Error Handling** - Secure error messages
- **Environment Isolation** - Separate dev/prod configs