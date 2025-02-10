function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <img 
        src="https://ui-avatars.com/api/?name=Zyra&background=646cff"
        alt="Zyra"
        className="w-8 h-8 rounded-full"
      />
      <div className="bg-dark-100 rounded-2xl px-4 py-2 rounded-bl-none">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator 