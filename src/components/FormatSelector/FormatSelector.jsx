import React from 'react';
import { MODE_OPTIONS } from '../../api/cobalt';
import './FormatSelector.css';

const ICONS = {
  video: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  audio: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  mute: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ),
};

const FormatSelector = ({ mode, onModeChange }) => {
  return (
    <div className="format-selector animate-scale-in">
      <div className="format-section">
        <h3 className="format-section-title">Format</h3>
        <div className={`mode-segmented-control selected-${mode}`}>
          <div className="mode-segmented-slider" />
          {MODE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`mode-segmented-btn ${mode === option.value ? 'active' : ''}`}
              onClick={() => onModeChange(option.value)}
              id={`mode-${option.value}`}
            >
              <span className="mode-btn-icon">{ICONS[option.icon]}</span>
              <span className="mode-btn-label">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormatSelector;
