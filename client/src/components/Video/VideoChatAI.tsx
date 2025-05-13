import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types';
import { videoService } from '../../services/videoService';
import { Send, Clock } from 'lucide-react';

interface VideoChatAIProps {
  videoId: string;
  onTimestampClick: (seconds: number) => void;
}

const VideoChatAI: React.FC<VideoChatAIProps> = ({ videoId, onTimestampClick }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi there! I can answer questions about this video. What would you like to know?'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message to AI
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputMessage.trim() || isLoading) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    
    try {
      // Get AI response
      const response = await videoService.chatWithAI(videoId, inputMessage);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: response.timestamp
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Format timestamp display
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Render message content with timestamp highlights
  const renderMessageContent = (message: ChatMessage) => {
    if (!message.timestamp) {
      return <p>{message.content}</p>;
    }
    
    return (
      <div>
        <p>{message.content}</p>
        <button
          onClick={() => onTimestampClick(message.timestamp!.seconds)}
          className="inline-flex items-center mt-2 text-sm bg-primary/10 text-primary rounded-md px-2 py-1 hover:bg-primary/20 transition-colors"
        >
          <Clock className="w-3 h-3 mr-1" />
          Go to {message.timestamp.text}
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-card-hover'
              }`}
            >
              {renderMessageContent(message)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card-hover rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-muted animate-bounce delay-150"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef}></div>
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about this video..."
          className="input flex-1"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isLoading}
          className={`btn btn-primary p-2 ${
            !inputMessage.trim() || isLoading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default VideoChatAI;