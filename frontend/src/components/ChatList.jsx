import { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import { 
  MagnifyingGlassIcon, 
  LockClosedIcon, 
  PlusIcon, 
  EllipsisVerticalIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  UserGroupIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const ChatList = ({ conversations, selectedChat, onChatSelect }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { isDark, toggleTheme } = useTheme()

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">55</span>
            </div>
            <h1 className="text-xl font-semibold">WhatsApp</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <LockClosedIcon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <PlusIcon className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <EllipsisVerticalIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
        <div className="relative">
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          <div className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-3 py-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-600">
        <div className="flex space-x-1">
          {['All', 'Unread', 'Favourites', 'Groups'].map((tab) => (
            <button
              key={tab}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                tab === 'All'
                  ? 'bg-green-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Left Navigation Icons */}
      <div className="absolute left-0 top-20 bottom-20 w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-600 flex flex-col items-center py-4 space-y-4">
        <button className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
          <PhoneIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
          <UserGroupIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
          <div className="w-5 h-5 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"></div>
        </button>
        <div className="flex-1"></div>
        <button className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto ml-16">
        {filteredConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {searchTerm ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <div
              key={conversation._id}
              onClick={() => onChatSelect(conversation)}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                selectedChat?._id === conversation._id ? 'bg-gray-100 dark:bg-gray-700 border-l-4 border-l-green-500' : ''
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
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {conversation.user_name || 'Unknown User'}
                    </h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(conversation.latestMessage?.timestamp)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
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
      <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
        <div className="flex items-center justify-between">
          <button
            onClick={toggleTheme}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors"
          >
            <div className="w-5 h-5">
              {isDark ? '☀️' : '🌙'}
            </div>
            <span className="text-xs">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <div className="text-center text-xs text-gray-500 dark:text-gray-400">
            <p>WhatsApp Web Clone - Demo Version</p>
            <p>Messages are stored locally only</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatList
