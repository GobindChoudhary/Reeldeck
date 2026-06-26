import React from 'react';
import './DownloadCard.css';

function formatSize(bytes) {
  if (!bytes || bytes === 0) return 'Unknown size';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec === 0) return '';
  return `${formatSize(bytesPerSec)}/s`;
}

function formatEta(seconds) {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '';
  if (seconds < 60) return `${Math.ceil(seconds)}s remaining`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.ceil(seconds % 60);
  return `${mins}m ${secs}s remaining`;
}

const DownloadCard = ({
  status,
  downloadData,
  downloadProgress,
  previewBlobUrl,
  mode,
  onSave,
  onCancelFetch,
  onReset,
  error,
}) => {
  const getFilename = () => {
    if (!downloadData) return 'media_file.mp4';
    if (downloadData.filename) return downloadData.filename;
    if (downloadData.picker && downloadData.picker[0]?.filename) {
      return downloadData.picker[0].filename;
    }
    if (downloadData.output?.filename) return downloadData.output.filename;
    return 'media_file.mp4';
  };

  const hasPreview = status === 'preview' || status === 'complete';

  if (status === 'idle') return null;

  return (
    <div className="download-card animate-scale-in">
      <div className={`deck-panel ${status}`}>
        {/* LED Status Header */}
        <div className="deck-header">
          <div className="deck-leds">
            <span className={`deck-led led-green ${status === 'preview' ? 'active' : ''}`} title="Ready" />
            <span className={`deck-led led-amber ${status === 'fetching' ? 'active animate-pulse' : ''}`} title="Fetching" />
            <span className={`deck-led led-cyan ${status === 'complete' ? 'active' : ''}`} title="Complete" />
            <span className={`deck-led led-red ${status === 'error' ? 'active animate-pulse' : ''}`} title="Error" />
          </div>
          <span className="deck-title">
            {status === 'loading' && 'FETCHING_MEDIA'}
            {status === 'ready' && 'PROCESSING'}
            {status === 'fetching' && 'DOWNLOADING_FOR_PREVIEW'}
            {status === 'preview' && 'READY'}
            {status === 'complete' && 'FILE_SAVED'}
            {status === 'error' && 'DECK_ERROR // UNIT_FAULT'}
          </span>
        </div>

        {/* Loading skeleton */}
        {status === 'loading' && (
          <div className="deck-skeleton">
            <div className="skeleton-player shimmer" />
            <div className="skeleton-info">
              <div className="skeleton-line skeleton-line-sm shimmer" />
              <div className="skeleton-line skeleton-line-md shimmer" />
            </div>
          </div>
        )}

        {/* Ready state — brief transitional */}
        {status === 'ready' && (
          <div className="deck-progress-section">
            <div className="loading-indicator">
              <span className="spinner spinner-amber" />
              <span>Preparing preview...</span>
            </div>
          </div>
        )}

        {/* Video/Audio Player — shown once blob is ready */}
        {hasPreview && previewBlobUrl && (
          <div className="deck-screen-container">
            <div className="deck-screen">
              {mode === 'audio' ? (
                <div className="audio-player-wrapper" key={previewBlobUrl}>
                  <audio className="deck-audio-player" src={previewBlobUrl} controls />
                </div>
              ) : (
                <video className="deck-video-player" key={previewBlobUrl} src={previewBlobUrl} controls preload="metadata" playsInline />
              )}
            </div>
          </div>
        )}



        {/* Progress Bar (during fetch) */}
        {status === 'fetching' && downloadProgress && (
          <div className="deck-progress-section">
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${downloadProgress.percentage || 0}%` }}
              />
              <span className="progress-bar-text">
                {downloadProgress.percentage || 0}%
              </span>
            </div>
            <div className="progress-stats">
              <span className="progress-stat">{formatSize(downloadProgress.received)} / {formatSize(downloadProgress.total)}</span>
              <span className="progress-stat">{formatSpeed(downloadProgress.speed)}</span>
              <span className="progress-stat">{formatEta(downloadProgress.eta)}</span>
            </div>
          </div>
        )}

        {/* Error content */}
        {status === 'error' && error && (
          <div className="deck-error-content">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Complete success banner */}
        {status === 'complete' && (
          <div className="deck-complete-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>File saved successfully — {getFilename()}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="deck-footer">
          {status === 'fetching' && (
            <div className="deck-fetching-actions">
              <button className="btn btn-cancel" onClick={onCancelFetch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                Cancel Download
              </button>
            </div>
          )}

          {status === 'preview' && (
            <div className="deck-preview-actions">
              <button className="btn btn-primary download-btn" onClick={onSave} id="save-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Save to Computer
              </button>
              <button className="btn btn-secondary reset-deck-btn" onClick={onReset}>
                New Download
              </button>
            </div>
          )}

          {status === 'complete' && (
            <div className="deck-complete-actions">
              <button className="btn btn-secondary" onClick={onReset}>
                New Download
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="deck-ready-actions">
              <button className="btn btn-primary" onClick={onReset}>
                Reset & Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadCard;
