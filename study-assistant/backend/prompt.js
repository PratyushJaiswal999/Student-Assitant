/**
 * Builds the prompt for the LLM based on mode (flashcards | quiz).
 * Instructs the model to return ONLY JSON — no prose, no markdown fences.
 */

const FLASHCARD_SCHEMA = `{
  "type": "flashcards",
  "topic": "<short topic label>",
  "cards": [
    { "id": "c1", "front": "<question>", "back": "<answer>" }
  ]
}`;

const QUIZ_SCHEMA = `{
  "type": "quiz",
  "topic": "<short topic label>",
  "questions": [
    {
      "id": "q1",
      "question": "<question text>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correctIndex": 0
    }
  ]
}`;

function buildPrompt(text, mode) {
  const isFlashcards = mode === 'flashcards';
  const schema = isFlashcards ? FLASHCARD_SCHEMA : QUIZ_SCHEMA;
  const countTarget = isFlashcards ? '8–12 flashcards' : '6–10 multiple-choice questions';

  return `You are a study-material generator. A student has provided the following notes or topic:

---
${text.trim()}
---

Your task: generate ${countTarget} from the content above.

CRITICAL RULES — follow every one or your response will be rejected:
1. Return ONLY a single JSON object. No markdown, no code fences, no explanation, no text before or after the JSON.
2. The JSON must match this EXACT schema (same field names, same types):
${schema}
3. ${isFlashcards
    ? 'The "cards" array must have at least 4 items. Each item must have exactly the keys: id, front, back — all strings.'
    : 'The "questions" array must have at least 4 items. Each item must have exactly the keys: id, question, options (array of 4 strings), correctIndex (integer 0–3).'}
4. The "type" field must be exactly "${mode}" (lowercase).
5. Do NOT wrap the JSON in backticks or any other characters.

Respond with valid JSON only.`;
}

module.exports = { buildPrompt };
