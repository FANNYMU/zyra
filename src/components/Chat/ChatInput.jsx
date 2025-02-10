import { useState, useRef } from 'react'
import { Image as ImageIcon, Send as SendIcon } from 'lucide-react'

function ChatInput({ onSendMessage, theme = 'emerald' }) {
  const [message, setMessage] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  const themeColors = {
    emerald: {
      bg: 'bg-[#0c1716]',
      border: 'border-emerald-800/20',
      text: 'text-emerald-300',
      placeholder: 'placeholder-emerald-500/50',
      focus: 'focus:ring-emerald-500/30',
      hover: 'hover:bg-emerald-800/10',
      hoverBorder: 'hover:border-emerald-700/30',
      icon: 'text-emerald-400',
      hoverIcon: 'hover:text-emerald-300',
      disabled: 'disabled:opacity-50'
    },
    blue: {
      bg: 'bg-[#0c1620]',
      border: 'border-blue-800/20',
      text: 'text-blue-300',
      placeholder: 'placeholder-blue-500/50',
      focus: 'focus:ring-blue-500/30',
      hover: 'hover:bg-blue-800/10',
      hoverBorder: 'hover:border-blue-700/30',
      icon: 'text-blue-400',
      hoverIcon: 'hover:text-blue-300',
      disabled: 'disabled:opacity-50'
    }
  };

  const colors = themeColors[theme];

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
        <div className={`mb-2 flex items-center gap-2 ${colors.hover} p-2 rounded-lg mx-2`}>
          <img 
            src={URL.createObjectURL(selectedImage)} 
            alt="Selected" 
            className="h-10 w-10 object-cover rounded"
          />
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className={`${colors.icon} ${colors.hoverIcon}`}
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
          className={`flex-1 h-12 px-4 ${colors.bg} text-base ${colors.text} ${colors.placeholder} focus:outline-none focus:ring-2 ${colors.focus} transition-all border-0 rounded-lg`}
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
          className={`p-3 ${colors.icon} ${colors.hoverIcon} ${colors.hover} rounded-lg transition-colors`}
        >
          <ImageIcon className="w-5 h-5" />
        </button>
        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 ${colors.icon} ${colors.hoverIcon} ${colors.disabled} disabled:cursor-not-allowed rounded-lg transition-colors ${colors.hover}`}
        >
          <SendIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}

export default ChatInput 