/**
 * useSession — persists the last successful result to localStorage.
 *
 * Saved shape:
 * {
 *   result: { type, topic, cards|questions },
 *   text:   the source text/topic the user typed,
 *   mode:   'flashcards' | 'quiz',
 *   savedAt: ISO timestamp
 * }
 *
 * Key: 'sa-session'
 */

const KEY = 'sa-session';

/** Load a previously saved session. Returns null if none or corrupted. */
export function loadSession() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Basic sanity check
    if (!parsed.result || !parsed.result.type) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Persist a completed session. */
export function saveSession(result, text, mode) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      result,
      text,
      mode,
      savedAt: new Date().toISOString(),
    }));
  } catch {
    // localStorage may be unavailable (private mode, quota exceeded) — fail silently
  }
}

/** Clear the saved session (called on "Start over"). */
export function clearSession() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // fail silently
  }
}

/** Human-readable relative time, e.g. "3 minutes ago" */
export function formatSavedAt(isoString) {
  if (!isoString) return '';
  try {
    const diff = Date.now() - new Date(isoString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins === 1) return '1 min ago';
    if (mins < 60) return `${mins} mins ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs === 1) return '1 hr ago';
    if (hrs < 24) return `${hrs} hrs ago`;
    const days = Math.floor(hrs / 24);
    return days === 1 ? 'yesterday' : `${days} days ago`;
  } catch {
    return '';
  }
}
