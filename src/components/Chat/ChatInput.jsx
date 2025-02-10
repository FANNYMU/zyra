import { useState } from 'react'

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t border-dark-100 bg-dark-200 p-4"
    >
      <div className="flex gap-2 ">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda..."
          className=" flex-1 rounded-lg bg-dark-100 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Kirim
        </button>
      </div>
    </form>
  )
}

export default ChatInput 