import { useState, useEffect } from 'react'
import { ThemeProvider } from './contexts/ThemeContext'
import ChatList from './components/ChatList'
import ChatWindow from './components/ChatWindow'
import './App.css'

function App() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [showChat, setShowChat] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch conversations from backend
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch('/api/conversations')
        const data = await response.json()
        setConversations(data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching conversations:', error)
        setLoading(false)
      }
    }

    fetchConversations()
  }, [])

  const handleChatSelect = (chat) => {
    setSelectedChat(chat)
    if (isMobile) {
      setShowChat(true)
    }
  }

  const handleBackToChats = () => {
    setShowChat(false)
    setSelectedChat(null)
  }

  const handleNewMessage = async (messageData) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      })

      if (response.ok) {
        // Refresh conversations to show new message
        const updatedResponse = await fetch('/api/conversations')
        const updatedData = await updatedResponse.json()
        setConversations(updatedData)
        
        // If this is the currently selected chat, refresh its messages
        if (selectedChat && selectedChat._id === messageData.wa_id) {
          setSelectedChat(prev => ({
            ...prev,
            latestMessage: {
              content: messageData.content,
              timestamp: new Date().toISOString()
            }
          }))
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading WhatsApp Web Clone...</p>
        </div>
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 chat-container ${
        isMobile ? 'flex-col' : 'flex-row'
      }`}>
        {/* Left Sidebar - Chat List */}
        <div className={`sidebar ${
          isMobile && showChat ? 'hidden' : 'block'
        } ${
          isMobile ? 'w-full h-full' : 'w-1/3'
        } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
          <ChatList 
            conversations={conversations}
            selectedChat={selectedChat}
            onChatSelect={handleChatSelect}
          />
        </div>

        {/* Right Side - Chat Window */}
        <div className={`chat-window ${
          isMobile && !showChat ? 'hidden' : 'block'
        } ${
          isMobile ? 'w-full h-full' : 'flex-1'
        } bg-gray-50 dark:bg-gray-900 ${
          isMobile && showChat ? 'active' : ''
        }`}>
          {selectedChat ? (
            <ChatWindow 
              chat={selectedChat}
              onSendMessage={handleNewMessage}
              onBackToChats={isMobile ? handleBackToChats : null}
            />
          ) : (
            <div className="flex items-center justify-center h-full whatsapp-pattern">
              <div className="text-center text-gray-500 dark:text-gray-400">
                <div className="text-6xl mb-4">💬</div>
                <h2 className="text-xl font-semibold mb-2">Welcome to WhatsApp Web Clone</h2>
                <p>Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
