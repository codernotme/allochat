import { v } from 'convex/values';
import { QueryCtx } from './_generated/server';

/**
 * Applies active content filters to text.
 * This runs within the Convex environment.
 */
export async function applyContentFilters(ctx: QueryCtx, text: string): Promise<string> {
  const filters = await ctx.db.query('contentFilters').collect();
  let maskedText = text;

  for (const filter of filters) {
    try {
      if (filter.action === 'mask') {
        // Use a simple global replacement for common words
        // Note: Regex support in Convex is standard JS
        const regex = new RegExp(filter.pattern, 'gi');
        maskedText = maskedText.replace(regex, (match) => '*'.repeat(match.length));
      } else if (filter.action === 'block') {
        const regex = new RegExp(filter.pattern, 'gi');
        if (regex.test(text)) {
          throw new Error('CONTENT_BLOCKED_BY_FILTER');
        }
      }
    } catch (e: any) {
      if (e.message === 'CONTENT_BLOCKED_BY_FILTER') throw e;
      // If regex fails (invalid pattern), fallback to literal search
      if (maskedText.toLowerCase().includes(filter.pattern.toLowerCase())) {
        if (filter.action === 'block') throw new Error('CONTENT_BLOCKED_BY_FILTER');
        const literalRegex = new RegExp(filter.pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        maskedText = maskedText.replace(literalRegex, (match) => '*'.repeat(match.length));
      }
    }
  }

  return maskedText;
}
