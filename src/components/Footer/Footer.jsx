import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <p className="footer-disclaimer-text">
            Use responsibly. Respect copyright laws. No media is stored on our servers.
          </p>
          <div className="footer-meta">
            <span className="footer-credit">
              REELDECK // {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
