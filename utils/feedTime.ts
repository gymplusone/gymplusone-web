/** Absolute local post time for full post view, e.g. `15:58 • 25/03/2026`. */
export function formatPostDetailTimestamp(createdAtMs: number): string {
  const d = new Date(createdAtMs);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${hh}:${mm} • ${day}/${month}/${year}`;
}

/**
 * Short relative timestamps for feed rows (Twitter / IG style).
 */
export function formatFeedTime(createdAtMs: number): string {
  const s = Math.max(0, Math.floor((Date.now() - createdAtMs) / 1000));
  if (s < 60) return 'now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  const date = new Date(createdAtMs);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
