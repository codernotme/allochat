/**
 * Utility to mask words based on patterns.
 * In a real implementation, this would be used on the server within Convex.
 */
export function maskContent(text: string, filters: { pattern: string; action: string }[]) {
  let maskedText = text;
  
  for (const filter of filters) {
    if (filter.action === 'mask') {
      try {
        // Simple case-insensitive replacement
        const regex = new RegExp(filter.pattern, 'gi');
        maskedText = maskedText.replace(regex, (match) => '*'.repeat(match.length));
      } catch (e) {
        // Fallback for non-regex strings
        const escaped = filter.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        maskedText = maskedText.replace(regex, (match) => '*'.repeat(match.length));
      }
    }
  }
  
  return maskedText;
}

export function shouldBlockContent(text: string, filters: { pattern: string; action: string }[]) {
  for (const filter of filters) {
    if (filter.action === 'block') {
      try {
        const regex = new RegExp(filter.pattern, 'gi');
        if (regex.test(text)) return true;
      } catch (e) {
        if (text.toLowerCase().includes(filter.pattern.toLowerCase())) return true;
      }
    }
  }
  return false;
}
