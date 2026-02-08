import { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

const ChatInterface = ({ messages, onSendMessage, isLoading, language }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const placeholders = {
    English: "Tell me about yourself",
    Assamese: "আপোনাৰ বিষয়ে কওক"
  };

  return (
    <div className="chat-interface glass-card">
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="welcome-section">
          <h2 className="welcome-title">
            {language === 'Assamese' ? 'নমস্কাৰ!' : 'Welcome!'}
          </h2>
          <p className="welcome-text">
            {language === 'Assamese' 
              ? 'মই আপোনাক চৰকাৰী আঁচনি বিচাৰি উলিয়াবলৈ সহায় কৰিম।'
              : "I'm here to help you discover government schemes you may be eligible for."
            }
          </p>
          <div className="example-prompts">
            <p className="example-label">Try saying:</p>
            <button 
              className="example-btn"
              onClick={() => setInputValue("I am a 19 year old student from Assam, my family income is around 1.5 lakh per year")}
            >
              "I am a 19 year old student from Assam, my family income is around 1.5 lakh per year"
            </button>
            <button 
              className="example-btn lang-as"
              onClick={() => setInputValue("মই অসমৰ এজন ২২ বছৰীয়া ছোৱালী, আমাৰ পৰিয়ালৰ আয় ১ লাখ টকা")}
            >
              "মই অসমৰ এজন ২২ বছৰীয়া ছোৱালী, আমাৰ পৰিয়ালৰ আয় ১ লাখ টকা"
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.type} animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {msg.type === 'assistant' && (
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-content">
              <p className={language === 'Assamese' ? 'lang-as' : ''}>
                {msg.content}
              </p>
              {msg.isRuleBased && (
                <span className="trust-badge">Safe Logic</span>
              )}
            </div>
            {msg.type === 'user' && (
              <div className="message-avatar user-avatar">👤</div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="message assistant animate-fade-in">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={`chat-input ${language === 'Assamese' ? 'lang-as' : ''}`}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholders[language] || placeholders.English}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-btn btn-primary"
          disabled={!inputValue.trim() || isLoading}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;
