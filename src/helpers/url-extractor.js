/**
 * Enhanced URL extraction and validation utilities
 */

class URLExtractor {
  /**
   * Extract and validate URLs from text with improved accuracy
   * @param {string} text - Text containing potential URLs
   * @returns {Array<string>} Array of valid URLs
   */
  static extractURLs(text) {
    if (!text) return [];

    // More precise regex that stops at common word boundaries
    const urlPattern = /https?:\/\/[a-zA-Z0-9][-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-a-zA-Z0-9()@:%_\\+.~#?&=]*/gi;
    const matches = text.match(urlPattern) || [];
    
    return matches.map(url => this.cleanURL(url)).filter(url => this.isValidURL(url));
  }

  /**
   * Clean extracted URL by removing common trailing characters
   * @param {string} url - Raw URL
   * @returns {string} Cleaned URL
   */
  static cleanURL(url) {
    if (!url) return url;

    // Remove trailing characters that are likely not part of the URL
    // Strip trailing punctuation/brackets that get captured from surrounding text
    cleanedURL = cleanedURL.replace(/[)\]>,;:!?.]+$/, '');
    
    // Common patterns where URLs get concatenated with text
    const patterns = [
      { pattern: /\/I$/, replacement: '/' },        // /I at end -> /
      { pattern: /\/So$/, replacement: '/' },       // /So at end -> /
      { pattern: /\/and$/, replacement: '/' },      // /and at end -> /
      { pattern: /\/that$/, replacement: '/' },     // /that at end -> /
      { pattern: /\/to$/, replacement: '/' },       // /to at end -> /
      { pattern: /\/[A-Z][a-z]+$/, replacement: '/' } // Any word starting with capital
    ];

    let cleanedURL = url;
    for (const { pattern, replacement } of patterns) {
      cleanedURL = cleanedURL.replace(pattern, replacement);
    }

    // Ensure URL ends properly
    if (!cleanedURL.endsWith('/') && !cleanedURL.includes('?') && !cleanedURL.includes('#')) {
      // Only add trailing slash for domain-only URLs
      const pathPart = cleanedURL.replace(/^https?:\/\/[^\/]+/, '');
      if (!pathPart || pathPart === '/') {
        cleanedURL = cleanedURL.replace(/\/$/, '') + '/';
      }
    }

    return cleanedURL;
  }

  /**
   * Validate if a string is a proper URL
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   */
  static isValidURL(url) {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol) && 
             urlObj.hostname.includes('.') &&
             !urlObj.hostname.endsWith('.com/I'); // Specific fix for our case
    } catch {
      return false;
    }
  }

  /**
   * Extract the best URL from Jira story content
   * @param {Object} story - Story object with description and other fields
   * @returns {string|null} Best URL found or null
   */
  static extractBestURL(story) {
    if (!story) return null;

    // 1. Try extracted URLs from Jira (if available)
    if (story.extractedUrls && story.extractedUrls.length > 0) {
      for (const url of story.extractedUrls) {
        const cleaned = this.cleanURL(url);
        if (this.isValidURL(cleaned)) {
          return cleaned;
        }
      }
    }

    // 2. Extract from description
    const descriptionURLs = this.extractURLs(story.description || '');
    if (descriptionURLs.length > 0) {
      return descriptionURLs[0];
    }

    // 3. Extract from title
    const titleURLs = this.extractURLs(story.title || '');
    if (titleURLs.length > 0) {
      return titleURLs[0];
    }

    // 4. Extract from acceptance criteria
    if (story.acceptanceCriteria && Array.isArray(story.acceptanceCriteria)) {
      for (const criteria of story.acceptanceCriteria) {
        const criteriaURLs = this.extractURLs(criteria);
        if (criteriaURLs.length > 0) {
          return criteriaURLs[0];
        }
      }
    }

    return null;
  }
}

module.exports = URLExtractor;