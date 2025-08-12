import { useState } from 'react'

const ChatList = ({ conversations, selectedChat, onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredConversations = conversations.filter(conv =>
    conv.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.from?.includes(searchTerm)
  )

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  const truncateMessage = (content, maxLength = 50) => {
    if (!content) return ''
    return content.length > maxLength ? content.substring(0, maxLength) + '...' : content
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-green-500 text-white p-4">
        <h1 className="text-xl font-semibold">WhatsApp Web Clone</h1>
        <p className="text-sm opacity-90">Built with React + Tailwind CSS</p>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-gray-50 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <div className="absolute left-3 top-2.5 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onChatSelect(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?._id === conversation._id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {conversation.user_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {conversation.user_name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(conversation.latestMessage?.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 truncate">
                      {truncateMessage(conversation.latestMessage?.content)}
                    </p>
                    {conversation.messageCount > 0 && (
                      <span className="text-xs bg-green-500 text-white rounded-full px-2 py-1 min-w-[20px] text-center">
                        {conversation.messageCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-500">
        <p>WhatsApp Web Clone - Demo Version</p>
        <p>Messages are stored locally only</p>
      </div>
    </div>
  )
}

export default ChatList
