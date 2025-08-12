import { useTheme } from '../hooks/useTheme'

const MessageBubble = ({ message, isOwnMessage }) => {
  const { isDark } = useTheme()
  
  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✓'
      case 'delivered':
        return '✓✓'
      case 'read':
        return '✓✓'
      default:
        return '✓'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'text-gray-400 dark:text-gray-500'
      case 'delivered':
        return 'text-gray-400 dark:text-gray-500'
      case 'read':
        return 'text-blue-500 dark:text-blue-400'
      default:
        return 'text-gray-400 dark:text-gray-500'
    }
  }

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm message-bubble ${
        isOwnMessage 
          ? 'bg-green-500 text-white rounded-br-md' 
          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-600'
      }`}>
        {/* Message Content */}
        <p className="text-sm leading-relaxed break-words">
          {message.content}
        </p>
        
        {/* Message Footer - Time and Status */}
        <div className={`flex items-center justify-between mt-2 text-xs ${
          isOwnMessage ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <span>{formatTime(message.timestamp)}</span>
          
          {/* Status Indicators (only for own messages) */}
          {isOwnMessage && (
            <div className="flex items-center space-x-1">
              <span className={`${getStatusColor(message.status)}`}>
                {getStatusIcon(message.status)}
              </span>
              {message.status === 'read' && (
                <span className="text-blue-400 dark:text-blue-300">👁️</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
