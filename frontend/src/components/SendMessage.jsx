import { useState } from 'react'

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
      {/* Emoji Button */}
      <button
        type="button"
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        title="Add emoji"
      >
        😊
      </button>

      {/* Attach Button */}
      <button
        type="button"
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
        title="Attach file"
      >
        📎
      </button>

      {/* Message Input */}
      <div className="flex-1 relative">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="w-full px-4 py-2 border border-gray-300 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        title="Send message"
      >
        <svg 
          className="w-5 h-5" 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path 
            fillRule="evenodd" 
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
            clipRule="evenodd" 
          />
        </svg>
      </button>
    </form>
  )
}

export default SendMessage
