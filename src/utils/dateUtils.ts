/**
 * Formats a date for URL paths in the format /YYYY/MM/DD
 */
export function getFormattedDateForURL(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `/${year}/${month}/${day}`;
}

/**
 * Formats a date for display in a human-readable format
 */
export function formatDisplayDate(dateString: string, options: Intl.DateTimeFormatOptions = {}): string {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
}

/**
 * Creates a complete post URL from date and slug
 */
export function createPostURL(dateString: string, slug: string): string {
  return `${getFormattedDateForURL(dateString)}/${slug}`;
} 