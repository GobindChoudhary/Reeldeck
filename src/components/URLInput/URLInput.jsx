import React, { useState, useRef } from 'react';
import { detectPlatform, isValidUrl } from '../../utils/platformDetect';
import './URLInput.css';

const URLInput = ({ onSubmit, isLoading, disabled }) => {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    setError('');

    if (value.length > 10) {
      setPlatform(detectPlatform(value));
    } else {
      setPlatform(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError('');
      if (text.length > 10) {
        setPlatform(detectPlatform(text));
      }
      inputRef.current?.focus();
    } catch {
      setError('Could not access clipboard. Please paste manually.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError('Please enter a video URL');
      return;
    }

    if (!isValidUrl(url.trim())) {
      setError('Please enter a valid URL (starting with https://)');
      return;
    }

    setError('');
    onSubmit(url.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="url-input-wrapper animate-fade-in-up delay-2">
      <form className="url-input-form" onSubmit={handleSubmit}>
        <div className={`url-input-container ${platform ? 'has-platform' : ''} ${error ? 'has-error' : ''}`}>
          
          {/* Platform Indicator */}
          {platform && (
            <div
              className="url-input-platform"
              style={{ '--platform-color': platform.color }}
            >
              <span className="url-input-platform-dot" />
              <span className="url-input-platform-name">{platform.name}</span>
            </div>
          )}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            className="url-input-field"
            placeholder="Paste video link here..."
            value={url}
            onChange={handleUrlChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
            spellCheck="false"
            id="url-input"
          />

          {/* Action buttons */}
          <div className="url-input-actions">
            {!url && (
              <button
                type="button"
                className="url-input-paste-btn"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                <span className="paste-text">Paste</span>
              </button>
            )}
            {url && !isLoading && (
              <button
                type="button"
                className="url-input-clear-btn"
                onClick={() => { setUrl(''); setPlatform(null); setError(''); }}
                title="Clear"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary url-input-submit"
              disabled={isLoading || !url.trim()}
              id="fetch-video-btn"
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  <span className="btn-text">Fetching...</span>
                </>
              ) : (
                <>
                  <svg className="submit-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                  <span className="btn-text">Get Video</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="url-input-error animate-fade-in">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default URLInput;
