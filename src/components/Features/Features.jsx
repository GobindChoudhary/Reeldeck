import React from 'react';
import './Features.css';

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: '5+ Platforms',
    description: 'Instagram, TikTok, Facebook, Twitter/X — all in one place.',
    led: 'green',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: '100% Free & Safe',
    description: 'No charges, no ads, no data collection. Privacy-first.',
    led: 'cyan',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Lightning Fast',
    description: 'Paste a link and download in seconds. No signup, no waiting.',
    led: 'amber',
  },
];

const ledColors = {
  green: 'var(--green-accent)',
  cyan: 'var(--cyan-accent)',
  amber: 'var(--amber-accent)',
};

const Features = () => {
  return (
    <section className="features section" id="features">
      <div className="container">
        <div className="features-panel">
          <div className="features-header">
            <span className="features-panel-subtitle"><span className="features-panel-logo">WHY&nbsp;REEL<span className="features-panel-logo-hl">DECK</span></span>?</span>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="feature-card"
                style={{ '--feature-led': ledColors[feature.led] }}
              >
                <div className="feature-led-strip">
                  <span className="feature-led-dot" />
                </div>
                <div className="feature-body">
                  <div className="feature-icon-wrap">
                    <div className="feature-icon">{feature.icon}</div>
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
