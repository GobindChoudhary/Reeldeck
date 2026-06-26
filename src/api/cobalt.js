const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * Request a download from the Cobalt API.
 */
export async function fetchDownload(url, options = {}) {
  if (!API_URL) {
    throw new Error(
      'Cobalt API URL is not configured. Set VITE_API_URL in your .env file.'
    );
  }

  const body = {
    url: url.trim(),
    videoQuality: 'max',
    downloadMode: options.downloadMode || 'auto',
    audioFormat: options.audioFormat || 'mp3',
    audioBitrate: options.audioBitrate || '128',
    filenameStyle: 'pretty',
    alwaysProxy: true,
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const errorMessage = getErrorMessage(data);
    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Fetch file metadata (size via HEAD request) without downloading.
 */
export async function fetchFileInfo(downloadUrl) {
  try {
    const response = await fetch(downloadUrl, { method: 'HEAD' });
    if (!response.ok) return null;
    const size = response.headers.get('Content-Length');
    const type = response.headers.get('Content-Type');
    return {
      size: size ? parseInt(size, 10) : null,
      type: type || null,
    };
  } catch {
    return null;
  }
}

function getErrorMessage(data) {
  if (data?.error?.code) {
    const errorMap = {
      'error.api.link.invalid': 'The URL you entered is not valid. Please check and try again.',
      'error.api.link.unsupported': 'This platform or URL is not supported.',
      'error.api.fetch.fail': 'Could not fetch the video. The link may be broken or private.',
      'error.api.fetch.rate': 'Too many requests. Please wait a moment and try again.',
      'error.api.fetch.critical': 'Something went wrong on the server. Please try again later.',
      'error.api.content.video.unavailable': 'This video is unavailable or has been removed.',
      'error.api.youtube.login': 'YouTube requires login for this video. YouTube downloads are limited due to platform restrictions. Try Instagram, TikTok, Facebook, or X instead!',
      'error.api.youtube.age': 'This YouTube video is age-restricted and cannot be downloaded.',
      'error.api.youtube.decipher': 'YouTube blocked this request. Try again later or use a different video.',
      'error.api.content.video.live': 'Live videos cannot be downloaded.',
      'error.api.content.post.unavailable': 'This post is unavailable or private.',
    };

    return errorMap[data.error.code] || `Error: ${data.error.code}`;
  }

  return 'An unexpected error occurred. Please try again.';
}

export const MODE_OPTIONS = [
  { value: 'auto', label: 'Video', icon: 'video', description: 'Download video with audio' },
  { value: 'audio', label: 'Audio Only', icon: 'audio', description: 'Extract audio as MP3' },
  { value: 'mute', label: 'Muted Video', icon: 'mute', description: 'Video without audio' },
];
