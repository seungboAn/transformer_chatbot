import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToBot } from '../config/supabase';
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendMessageToBot(userMessage.text);
      
      const botMessage = {
        text: response.message || "I'm sorry, I couldn't process that request.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add error message
      const errorMessage = {
        text: "I'm sorry, I encountered an error. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container" role="log" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}-message ${message.isError ? 'error-message' : ''}`}
            role="article"
          >
            <p>{message.text}</p>
            <small className="timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message loading-message">
            <p>Thinking...</p>
            <div className="loading-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-form">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          aria-label="Message input"
          rows="3"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          aria-label="Send message"
          disabled={isLoading || !inputMessage.trim()}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default ChatInterface; 