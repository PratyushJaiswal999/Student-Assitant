/**
 * Validates the parsed JSON from the AI response.
 * Returns { ok: true, data } or { ok: false, code: 'bad_shape' | 'empty' }
 * JSON.parse errors are handled upstream in server.js → code 'bad_json'
 */

function validateResponse(parsed, mode) {
  // Must have a "type" field matching the requested mode
  if (typeof parsed !== 'object' || parsed === null) {
    return { ok: false, code: 'bad_shape' };
  }

  if (parsed.type !== mode) {
    return { ok: false, code: 'bad_shape' };
  }

  if (mode === 'flashcards') {
    if (!Array.isArray(parsed.cards)) {
      return { ok: false, code: 'bad_shape' };
    }
    if (parsed.cards.length === 0) {
      return { ok: false, code: 'empty' };
    }
    // Validate each card has required keys
    for (const card of parsed.cards) {
      if (
        typeof card.id !== 'string' ||
        typeof card.front !== 'string' ||
        typeof card.back !== 'string'
      ) {
        return { ok: false, code: 'bad_shape' };
      }
    }
  } else if (mode === 'quiz') {
    if (!Array.isArray(parsed.questions)) {
      return { ok: false, code: 'bad_shape' };
    }
    if (parsed.questions.length === 0) {
      return { ok: false, code: 'empty' };
    }
    // Validate each question has required keys
    for (const q of parsed.questions) {
      if (
        typeof q.id !== 'string' ||
        typeof q.question !== 'string' ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correctIndex !== 'number'
      ) {
        return { ok: false, code: 'bad_shape' };
      }
    }
  } else {
    return { ok: false, code: 'bad_shape' };
  }

  return { ok: true, data: parsed };
}

module.exports = { validateResponse };
