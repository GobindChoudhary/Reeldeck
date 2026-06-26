/**
 * Platform Detection Utility
 * Detects which social media platform a URL belongs to.
 */

const PLATFORM_PATTERNS = [
  {
    id: 'instagram',
    name: 'Instagram',
    color: '#E4405F',
    patterns: [
      /instagram\.com/i,
      /instagr\.am/i,
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    color: '#00F2EA',
    patterns: [
      /tiktok\.com/i,
      /vm\.tiktok\.com/i,
    ],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    color: '#1877F2',
    patterns: [
      /facebook\.com/i,
      /fb\.watch/i,
      /fb\.com/i,
    ],
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    color: '#1DA1F2',
    patterns: [
      /twitter\.com/i,
      /x\.com/i,
    ],
  },
];

/**
 * Detect the platform from a URL.
 *
 * @param {string} url - The URL to check
 * @returns {{ id: string, name: string, color: string } | null}
 */
export function detectPlatform(url) {
  if (!url) return null;

  for (const platform of PLATFORM_PATTERNS) {
    for (const pattern of platform.patterns) {
      if (pattern.test(url)) {
        return {
          id: platform.id,
          name: platform.name,
          color: platform.color,
        };
      }
    }
  }

  return null;
}

/**
 * Validate if a string is a valid URL.
 *
 * @param {string} url - The string to validate
 * @returns {boolean}
 */
export function isValidUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Get all supported platforms info (for display).
 *
 * @returns {Array<{ id: string, name: string, color: string }>}
 */
export function getSupportedPlatforms() {
  return PLATFORM_PATTERNS.map(({ id, name, color }) => ({ id, name, color }));
}
