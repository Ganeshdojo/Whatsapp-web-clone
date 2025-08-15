# WhatsApp Web Clone - Frontend

This is the frontend implementation for Day 2 of the WhatsApp Web Clone project.

##  Features Implemented

###  Day 2 Requirements Completed

- [x] **React Project Setup with Vite**
  - Modern React 18+ with Vite build tool
  - Fast development server with HMR

- [x] **Tailwind CSS Integration**
  - Using the new Tailwind CSS v4 approach with Vite plugin
  - No tailwind.config.js required (new approach)
  - Dark and light theme support with `dark:` variants

- [x] **ChatList Component**
  - Conversations sidebar with search functionality
  - Filter tabs (All, Unread, Favourites, Groups)
  - Chat entries with avatars, names, last messages, timestamps
  - Unread message count indicators
  - Message status indicators (✓, ✓✓)
  - Responsive design with hover effects

- [x] **ChatWindow Component**
  - Message display area with scrollable content
  - Message bubbles with different styles for sent/received
  - Message status indicators and timestamps
  - Date separators between message groups
  - Typing indicators
  - End-to-end encryption notice

- [x] **Message Bubbles & Status Indicators**
  - Green bubbles for sent messages (WhatsApp style)
  - White/gray bubbles for received messages
  - Status icons: ✓ (sent), ✓✓ (delivered/read)
  - Timestamps below each message

- [x] **Send Message Functionality**
  - Text input field with placeholder
  - Enter key to send messages
  - Simulated typing indicators
  - Auto-scroll to bottom on new messages

- [x] **Dark and Light Theme Support**
  - Toggle between dark and light themes
  - Theme-aware color schemes using Tailwind's `dark:` variants
  - Consistent styling across all components

##  Design Features

- **Responsive Layout**: Two-column design (1/3 sidebar, 2/3 chat area)
- **WhatsApp Branding**: Green accent colors (#10B981) for primary elements
- **Modern UI**: Clean, minimalist design with proper spacing and typography
- **Interactive Elements**: Hover effects, focus states, and smooth transitions
- **Accessibility**: Proper contrast ratios and keyboard navigation

##  Technical Implementation

### Components Structure
```
src/
├── components/
│   ├── ChatList.jsx      # Left sidebar with conversations
│   └── ChatWindow.jsx    # Right side chat display
├── App.jsx               # Main app with theme toggle
├── main.jsx              # Entry point
└── index.css             # Tailwind CSS import
```

### State Management
- React hooks for local state management
- Theme toggle functionality
- Selected chat state
- Message composition and display

### Styling Approach
- Utility-first CSS with Tailwind CSS
- Dark mode support with `dark:` variants
- Responsive design with Tailwind's responsive prefixes
- Custom animations and transitions

##  Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

##  Browser Support

- Modern browsers with ES6+ support
- Responsive design for desktop and tablet
- Dark mode support across all browsers

##  Responsive Design

- Desktop-first design (768px+)
- Tablet-friendly layout
- Mobile-responsive components