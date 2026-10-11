// Timestamps are stored as real ISO strings (e.g. 2026-10-11T08:30:00.000Z) and
// formatted only when displayed. Older demo data uses plain text such as
// "Sep 24, 09:15 AM"; those values pass through unchanged.

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}T/;

export function nowIso(): string {
  return new Date().toISOString();
}

function parseIso(value: string): Date | null {
  if (!ISO_PATTERN.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "Just now", "5 min ago", "3 h ago", "2 d ago", then a date after a week. */
export function formatWhen(value?: string | null): string {
  if (!value) return '';
  const date = parseIso(value);
  if (!date) return value;

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/** Always an absolute date, e.g. "11 Oct 2026". */
export function formatDate(value?: string | null): string {
  if (!value) return '';
  const date = parseIso(value);
  if (!date) return value;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
