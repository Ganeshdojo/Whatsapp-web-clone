import { useState } from 'react'

import { 
  PaperClipIcon,
  MicrophoneIcon,
  PaperAirplaneIcon
} from '@heroicons/react/24/outline'

const SendMessage = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-3">
      {/* Attach Button */}
      <button
        type="button"
        className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        title="Attach file"
      >
        <PaperClipIcon className="w-5 h-5" />
      </button>

      {/* Message Input */}
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-500 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          rows="1"
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />
      </div>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim()}
        className={`p-3 rounded-full transition-all ${
          message.trim()
            ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl transform hover:scale-105'
            : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }`}
        title="Send message"
      >
        {message.trim() ? (
          <PaperAirplaneIcon className="w-5 h-5" />
        ) : (
          <MicrophoneIcon className="w-5 h-5" />
        )}
      </button>
    </form>
  )
}

export default SendMessage
