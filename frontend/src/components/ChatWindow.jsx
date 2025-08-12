import { useState, useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import SendMessage from './SendMessage'

const ChatWindow = ({ chat, onSendMessage }) => {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef(null)

  // Fetch messages for the selected chat
  useEffect(() => {
    if (chat?._id) {
      fetchMessages(chat._id)
    }
  }, [chat?._id])

  const fetchMessages = async (waId) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/messages/${waId}`)
      const data = await response.json()
      setMessages(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching messages:', error)
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (messageText) => {
    if (!messageText.trim()) return

    const messageData = {
      wa_id: chat._id,
      content: messageText,
      user_name: 'Demo User',
      from: chat._id,
      to: '918329446654' // Business number
    }

    // Optimistically add message to UI
    const tempMessage = {
      _id: `temp-${Date.now()}`,
      content: messageText,
      from: chat._id,
      timestamp: new Date().toISOString(),
      status: 'sent',
      message_type: 'text'
    }

    setMessages(prev => [...prev, tempMessage])

    // Send to backend
    await onSendMessage(messageData)

    // Refresh messages to get the real message from backend
    fetchMessages(chat._id)
  }

  if (!chat) {
    return null
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
          {chat.user_name?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-gray-900">{chat.user_name || 'Unknown User'}</h2>
          <p className="text-sm text-gray-500">
            {chat.from} • {chat.messageCount || 0} messages
          </p>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            📞
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            📹
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full">
            ⋮
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">💬</div>
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <MessageBubble 
                key={message._id} 
                message={message} 
                isOwnMessage={message.from === chat._id}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Send Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <SendMessage onSendMessage={handleSendMessage} />
      </div>
    </div>
  )
}

export default ChatWindow
