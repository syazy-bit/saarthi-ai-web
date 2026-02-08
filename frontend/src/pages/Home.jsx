import { useState } from 'react';
import ChatInterface from '../components/ChatInterface';
import SchemeCard from '../components/SchemeCard';
import LanguageToggle from '../components/LanguageToggle';
import { sendChatMessage } from '../services/api';

function Home() {
  const [messages, setMessages] = useState([]);
  const [eligibleSchemes, setEligibleSchemes] = useState([]);
  const [potentialSchemes, setPotentialSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('English');
  const [userProfile, setUserProfile] = useState(null);

  const handleSendMessage = async (message) => {
    // Add user message to chat
    const userMsg = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await sendChatMessage(message);

      // Update language if detected
      if (data.detected_language) {
        setLanguage(data.detected_language);
      }

      // Add AI response
      const aiMsg = { 
        type: 'assistant', 
        content: data.response, 
        timestamp: new Date(),
        isRuleBased: data.is_rule_based 
      };
      setMessages(prev => [...prev, aiMsg]);

      // Update schemes
      setEligibleSchemes(data.eligible_schemes || []);
      setPotentialSchemes(data.potential_schemes || []);
      setUserProfile(data.extracted_profile);

    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = { 
        type: 'assistant', 
        content: 'Sorry, I encountered an error. Please make sure the backend is running and try again.', 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header glass-card">
        <div className="header-content">
          <div className="logo">
            <h1>Saarthi AI</h1>
          </div>
          <p className="tagline">Your Guide to Government Schemes</p>
        </div>
        <LanguageToggle language={language} onLanguageChange={setLanguage} />
      </header>

      {/* Main Content */}
      <main className="app-main">
        <div className="chat-section">
          <ChatInterface 
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            language={language}
          />
        </div>

        {/* Results Section */}
        {(eligibleSchemes.length > 0 || potentialSchemes.length > 0) && (
          <div className="results-section animate-fade-in">
            {eligibleSchemes.length > 0 && (
              <div className="schemes-list">
                <h2 className="section-title">
                  <span className="trust-badge">Rule-Based Match</span>
                  Eligible Schemes
                </h2>
                {eligibleSchemes.map((scheme, index) => (
                  <SchemeCard 
                    key={scheme.id} 
                    scheme={scheme} 
                    index={index}
                    language={language}
                  />
                ))}
              </div>
            )}

            {potentialSchemes.length > 0 && (
              <div className="schemes-list potential">
                <h2 className="section-title">Need More Info</h2>
                <p className="section-desc text-secondary">
                  These schemes might be relevant, but I need more details to confirm.
                </p>
                {potentialSchemes.map((scheme, index) => (
                  <SchemeCard 
                    key={scheme.id} 
                    scheme={scheme} 
                    index={index}
                    isPotential={true}
                    language={language}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p className="disclaimer">
          ⚠️ Saarthi AI is for guidance only. Final eligibility is determined by official authorities.
        </p>
      </footer>
    </div>
  );
}

export default Home;
