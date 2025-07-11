import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState('Türkçe');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  // Transparan olması gereken sayfalar
  const transparentRoutes = ['/', '/koleksiyon', '/golden', '/nest'];
  const isTransparentPage = transparentRoutes.includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleLang = () => setLangOpen(!langOpen);
  const selectLanguage = (lang) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <header className={`header ${isTransparentPage ? 'header-transparent' : ''} ${!isVisible ? 'header-hidden' : ''}`}>
      <div className="container">
        <div className="logo">
           <svg width="300" height="300" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M60,150 A90,90 0 0 1 150,60" stroke="white" stroke-width="2" fill="none" />
      <path d="M150,240 A90,90 0 0 1 240,150" stroke="white" stroke-width="2" fill="none" />
      <circle cx="260" cy="40" r="4" fill="white" />
   
      <line x1="95" y1="170" x2="205" y2="170" stroke="white" stroke-width="2" />
     
    </svg>

          <div className="logo-text-container">
            <span className="logo-text">OCTALIGHT</span>
            <span className="logo-tagline">Light. space. Emotion.</span>
          </div>
        </div>

        <nav className="nav">
          <ul className="nav-menu">
            <li><a href="#" className="nav-link">HAKKIMIZDA</a></li>
            <li><a href="/koleksiyon" className="nav-link">KOLEKSİYON</a></li>
            <li><a href="#" className="nav-link">TASARIMCILAR</a></li>
            <li><a href="#" className="nav-link">HABERLER</a></li>
            <li><a href="#" className="nav-link">MAĞAZALAR</a></li>
          </ul>
        </nav>

        <div className="header-right">
          <div
            className="language-selector"
            onClick={toggleLang}
            tabIndex={0}
            onBlur={() => setTimeout(() => setLangOpen(false), 150)}
          >
            <span>{language}</span>
            <svg
              className={`dropdown-icon ${langOpen ? 'open' : ''}`}
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {langOpen && (
              <ul className="language-dropdown">
                {['Türkçe', 'English', 'Deutsch'].map((lang) => (
                  <li
                    key={lang}
                    onClick={() => selectLanguage(lang)}
                    className={language === lang ? 'active' : ''}
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="header-icons">
            <button className="icon-btn search-btn" aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button className="icon-btn profile-btn" aria-label="Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
