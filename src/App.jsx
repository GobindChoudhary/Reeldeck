import React, { useState } from 'react';
import { useDownloader } from './hooks/useDownloader';
import Header from './components/Header/Header';
import PlatformBadges from './components/PlatformBadges/PlatformBadges';
import URLInput from './components/URLInput/URLInput';
import FormatSelector from './components/FormatSelector/FormatSelector';
import DownloadCard from './components/DownloadCard/DownloadCard';
import Features from './components/Features/Features';
import Footer from './components/Footer/Footer';

const App = () => {
  const [mode, setMode] = useState('auto');
  const [currentUrl, setCurrentUrl] = useState('');

  const {
    status,
    error,
    downloadData,
    downloadProgress,
    previewBlobUrl,
    getDownload,
    saveFile,
    cancelFetch,
    reset,
  } = useDownloader();

  const handleUrlSubmit = async (url) => {
    setCurrentUrl(url);
    await getDownload(url, {
      downloadMode: mode,
    });
  };

  const handleSave = () => {
    saveFile();
  };

  const handleCancelFetch = () => {
    cancelFetch();
  };

  const handleReset = () => {
    reset();
    setCurrentUrl('');
  };

  const isBusy = status === 'loading' || status === 'fetching';
  const showFormatSelector = status !== 'loading' && status !== 'fetching';

  const handleModeChange = (newMode) => {
    setMode(newMode);
    if (currentUrl && (status === 'ready' || status === 'fetching' || status === 'preview')) {
      getDownload(currentUrl, {
        downloadMode: newMode,
      });
    }
  };

  return (
    <div className="app">
      <main className="main-content">
        <Header />
        <PlatformBadges />

        <div className="container">
          <URLInput
            onSubmit={handleUrlSubmit}
            isLoading={status === 'loading'}
            disabled={isBusy}
          />

          {showFormatSelector && (
            <FormatSelector
              mode={mode}
              onModeChange={handleModeChange}
            />
          )}

          <DownloadCard
            status={status}
            downloadData={downloadData}
            downloadProgress={downloadProgress}
            previewBlobUrl={previewBlobUrl}
            mode={mode}
            onSave={handleSave}
            onCancelFetch={handleCancelFetch}
            onReset={handleReset}
            error={error}
          />
        </div>
      </main>

      <Features />
      <Footer />
    </div>
  );
};

export default App;
