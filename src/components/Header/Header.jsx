import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('reeldeck-theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    localStorage.setItem('reeldeck-theme', isLight ? 'light' : 'dark');
  }, [isLight]);

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <div className="header-logo animate-fade-in">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="url(#logo-gradient)" />
              <circle cx="20" cy="20" r="10" stroke="#07080b" strokeWidth="2.5" strokeDasharray="6 3" />
              <circle cx="20" cy="20" r="4" fill="#07080b" />
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                  <stop stopColor="var(--amber-accent)" />
                  <stop offset="1" stopColor="var(--orange-accent)" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="logo-text">
            REEL<span className="logo-text-highlight">DECK</span>
          </span>
        </div>

        <button
          className="theme-toggle"
          onClick={() => setIsLight(p => !p)}
          aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
        >
          {isLight ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
