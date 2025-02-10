import { useState, useRef } from 'react'
import { Image as ImageIcon, Send as SendIcon } from 'lucide-react'

function ChatInput({ onSendMessage }) {
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message, selectedImage)
      setMessage('')
      setSelectedImage(null)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      setSelectedImage(file)
    } else {
      alert('Please select a valid image file (JPEG, PNG, or GIF)')
    }
  }

  return (
    <form 
      onSubmit={handleSubmit}
      className="w-full p-1.5"
    >
      {selectedImage && (
        <div className="mb-2 flex items-center gap-2 bg-emerald-800/20 p-2 rounded-lg mx-2">
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Selected" 
            className="h-10 w-10 object-cover rounded"
          />
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="text-emerald-400 hover:text-emerald-300"
          >
            Remove
          </button>
        </div>
      )}
      <div className="relative flex items-center gap-2 px-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda..."
          className="flex-1 h-12 px-4 bg-[#0c1716] text-base text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all border-0 rounded-lg"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-800/20 rounded-lg transition-colors"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!message.trim()}
          className="p-3 text-emerald-400 hover:text-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors hover:bg-emerald-800/20"
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

export default ChatInput 