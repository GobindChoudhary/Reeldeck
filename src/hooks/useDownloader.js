import { useState, useCallback, useRef } from 'react';
import { fetchDownload, fetchFileInfo } from '../api/cobalt';

function extractMediaUrl(data) {
  if (!data) return null;
  if (data.status === 'tunnel' || data.status === 'redirect') {
    return { url: data.url, filename: data.filename || 'media_file.mp4' };
  }
  if (data.status === 'picker' && data.picker?.length > 0) {
    const item = data.picker[0];
    return { url: item.url, filename: item.filename || data.filename || 'media_file.mp4' };
  }
  if (data.status === 'local-processing') {
    const tunnelUrl = data.tunnel?.[0];
    if (tunnelUrl) {
      return { url: tunnelUrl, filename: data.output?.filename || 'media_file.mp4' };
    }
  }
  return null;
}

export function useDownloader() {
  const [status, setStatus] = useState('idle');
  const [downloadData, setDownloadData] = useState(null);
  const [error, setError] = useState(null);
  const [downloadProgress, setDownloadProgress] = useState(null);
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  const abortRef = useRef(null);
  const blobUrlRef = useRef(null);

  const cancelFetch = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const fetchMediaBlob = useCallback(async (url) => {
    setStatus('fetching');
    setDownloadProgress({ received: 0, total: 0, percentage: 0, speed: 0, eta: 0 });

    const abortController = new AbortController();
    abortRef.current = abortController;

    try {
      const response = await fetch(url, { signal: abortController.signal });
      const contentLength = response.headers.get('Content-Length')
        || response.headers.get('Estimated-Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      const reader = response.body.getReader();
      const chunks = [];
      let received = 0;
      let startTime = Date.now();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;

        if (total) {
          const elapsed = (Date.now() - startTime) / 1000;
          const speed = elapsed > 0 ? received / elapsed : 0;
          const remaining = total - received;
          const eta = speed > 0 ? remaining / speed : 0;

          setDownloadProgress({
            received,
            total,
            percentage: Math.round((received / total) * 100),
            speed,
            eta,
          });
        }
      }

      const blob = new Blob(chunks, { type: response.headers.get('Content-Type') || undefined });
      const blobUrl = URL.createObjectURL(blob);

      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
      blobUrlRef.current = blobUrl;
      setPreviewBlobUrl(blobUrl);
      setDownloadProgress(prev => prev ? { ...prev, percentage: 100 } : null);
      setStatus('preview');
    } catch (err) {
      if (err.name === 'AbortError') {
        setStatus('ready');
        setDownloadProgress(null);
        setError(null);
      } else {
        setError(err.message || 'Failed to fetch media for preview.');
        setStatus('error');
      }
    } finally {
      abortRef.current = null;
    }
  }, []);

  const getDownload = useCallback(async (url, options = {}) => {
    cancelFetch();
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }

    setStatus('loading');
    setError(null);
    setDownloadData(null);
    setDownloadProgress(null);
    setPreviewBlobUrl(null);
    setFileInfo(null);

    try {
      const data = await fetchDownload(url, options);

      if (data.status === 'error') {
        throw new Error(data.error?.code || 'Unknown error');
      }

      setDownloadData(data);
      setStatus('ready');

      if (data.url) {
        fetchFileInfo(data.url).then(info => {
          if (info) setFileInfo(info);
        });
      }

      const mediaInfo = extractMediaUrl(data);
      if (mediaInfo?.url) {
        fetchMediaBlob(mediaInfo.url);
      }

      return data;
    } catch (err) {
      setError(err.message);
      setStatus('error');
      return null;
    }
  }, [cancelFetch, fetchMediaBlob]);

  const saveFile = useCallback((filename) => {
    if (!blobUrlRef.current) return;

    const a = document.createElement('a');
    a.href = blobUrlRef.current;
    a.download = filename || 'media_file';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setStatus('complete');
  }, []);

  const reset = useCallback(() => {
    cancelFetch();
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setStatus('idle');
    setDownloadData(null);
    setDownloadProgress(null);
    setError(null);
    setPreviewBlobUrl(null);
    setFileInfo(null);
  }, [cancelFetch]);

  return {
    status,
    downloadData,
    downloadProgress,
    previewBlobUrl,
    fileInfo,
    error,
    getDownload,
    saveFile,
    cancelFetch,
    reset,
  };
}
