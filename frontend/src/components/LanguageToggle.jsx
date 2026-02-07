import './LanguageToggle.css';

const LanguageToggle = ({ language, onLanguageChange }) => {
  return (
    <div className="language-toggle">
      <button 
        className={`lang-btn ${language === 'English' ? 'active' : ''}`}
        onClick={() => onLanguageChange('English')}
      >
        EN
      </button>
      <button 
        className={`lang-btn lang-as ${language === 'Assamese' ? 'active' : ''}`}
        onClick={() => onLanguageChange('Assamese')}
      >
        অসমীয়া
      </button>
    </div>
  );
};

export default LanguageToggle;
