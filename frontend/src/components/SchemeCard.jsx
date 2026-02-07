import { useState } from 'react';
import './SchemeCard.css';

const SchemeCard = ({ scheme, index, isPotential = false, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div 
      className={`scheme-card glass-card ${isPotential ? 'potential' : ''} animate-fade-in`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Card Header */}
      <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="card-title-section">
          <h3 className="scheme-name">{scheme.name}</h3>
          {scheme.is_rule_based && !isPotential && (
            <span className="trust-badge">Verified Match</span>
          )}
        </div>
        <button className={`expand-btn ${isExpanded ? 'expanded' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* Description */}
      <p className={`scheme-description ${language === 'Assamese' ? 'lang-as' : ''}`}>
        {scheme.description}
      </p>

      {/* Why Eligible */}
      {scheme.why_eligible && (
        <div className="why-eligible">
          <h4>✨ Why You Qualify</h4>
          <p className={language === 'Assamese' ? 'lang-as' : ''}>
            {scheme.why_eligible}
          </p>
        </div>
      )}

      {/* Missing Info for Potential Matches */}
      {isPotential && scheme.missing_info && (
        <div className="missing-info">
          <h4>📝 Information Needed</h4>
          <ul>
            {scheme.missing_info.map((info, i) => (
              <li key={i}>{info.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Expanded Content */}
      {isExpanded && (
        <div className="expanded-content animate-fade-in">
          {/* Journey Roadmap */}
          <div className="journey-roadmap">
            <h4>🗺️ Your Eligibility Journey</h4>
            <div className="roadmap-steps">
              <div className="roadmap-step completed">
                <div className="step-icon">1</div>
                <div className="step-content">
                  <span className="step-title">Discovery</span>
                  <span className="step-desc">Scheme identified ✓</span>
                </div>
              </div>
              <div className="roadmap-connector"></div>
              <div className={`roadmap-step ${!isPotential ? 'completed' : 'current'}`}>
                <div className="step-icon">2</div>
                <div className="step-content">
                  <span className="step-title">Eligibility</span>
                  <span className="step-desc">{isPotential ? 'Needs more info' : 'Confirmed ✓'}</span>
                </div>
              </div>
              <div className="roadmap-connector"></div>
              <div className="roadmap-step">
                <div className="step-icon">3</div>
                <div className="step-content">
                  <span className="step-title">Documents</span>
                  <span className="step-desc">Gather requirements</span>
                </div>
              </div>
              <div className="roadmap-connector"></div>
              <div className="roadmap-step">
                <div className="step-icon">4</div>
                <div className="step-content">
                  <span className="step-title">Apply</span>
                  <span className="step-desc">Submit application</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          {scheme.documents && (
            <div className="documents-section">
              <h4>📄 Required Documents</h4>
              <div className="documents-grid">
                {scheme.documents.map((doc, i) => (
                  <div key={i} className="document-item">
                    <div className="doc-icon">📋</div>
                    <div className="doc-info">
                      <span className="doc-name">{doc.name}</span>
                      <span className="doc-desc">{doc.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps to Apply */}
          {scheme.steps && (
            <div className="steps-section">
              <h4>📝 How to Apply</h4>
              <ol className="apply-steps">
                {scheme.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {/* Official Link */}
          {scheme.official_link && (
            <a 
              href={scheme.official_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="official-link btn btn-secondary"
            >
              🔗 Visit Official Website
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default SchemeCard;
