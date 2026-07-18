/**
 * api.js — fetch wrapper for POST /api/generate
 * Supports AbortController so stale requests can be cancelled.
 */

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

/**
 * @param {string} text      - user notes/topic
 * @param {'flashcards'|'quiz'} mode
 * @param {AbortSignal} signal - from AbortController
 * @returns {Promise<object>} - validated data or throws with .code property
 */
export async function generate(text, mode, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode }),
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw err; // let caller handle abort separately
    }
    const networkError = new Error('Network error — check your connection and try again.');
    networkError.code = 'network_error';
    throw networkError;
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const apiError = new Error(body.message || 'Something went wrong');
    apiError.code = body.error || 'unknown_error';
    throw apiError;
  }

  return body;
}
