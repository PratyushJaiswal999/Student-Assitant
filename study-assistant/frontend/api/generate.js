const Groq = require('groq-sdk');

// Initialize Groq (api key comes from Vercel env variable)
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Prompt Builder ─────────────────────────────────────────
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

CRITICAL RULES:
1. Return ONLY a single JSON object. No markdown, no code fences, no explanation, no text before or after the JSON.
2. The JSON must match this EXACT schema:
${schema}
3. ${isFlashcards
    ? 'The "cards" array must have at least 4 items. Each item must have exactly the keys: id, front, back.'
    : 'The "questions" array must have at least 4 items. Each item must have exactly the keys: id, question, options (array of 4 strings), correctIndex (0–3).'}
4. The "type" field must be exactly "${mode}" (lowercase).
5. Do NOT wrap the JSON in backticks.`;
}

// ── Validation ─────────────────────────────────────────────
function validateResponse(parsed, mode) {
  if (typeof parsed !== 'object' || parsed === null) return { ok: false, code: 'bad_shape' };
  if (parsed.type !== mode) return { ok: false, code: 'bad_shape' };

  if (mode === 'flashcards') {
    if (!Array.isArray(parsed.cards)) return { ok: false, code: 'bad_shape' };
    if (parsed.cards.length === 0) return { ok: false, code: 'empty' };
    for (const card of parsed.cards) {
      if (typeof card.id !== 'string' || typeof card.front !== 'string' || typeof card.back !== 'string') {
        return { ok: false, code: 'bad_shape' };
      }
    }
  } else if (mode === 'quiz') {
    if (!Array.isArray(parsed.questions)) return { ok: false, code: 'bad_shape' };
    if (parsed.questions.length === 0) return { ok: false, code: 'empty' };
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

// ── Serverless Handler ──────────────────────────────────────
module.exports = async (req, res) => {
  // CORS Headers for API accessibility
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const { text, mode } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'bad_input', message: 'text is required' });
  }
  if (mode !== 'flashcards' && mode !== 'quiz') {
    return res.status(400).json({ error: 'bad_input', message: 'mode must be flashcards or quiz' });
  }

  const prompt = buildPrompt(text, mode);

  let rawContent;
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2048,
    });
    rawContent = completion.choices[0]?.message?.content ?? '';
  } catch (err) {
    console.error('Groq API error:', err.message);
    return res.status(502).json({ error: 'provider_error', message: 'AI provider failed' });
  }

  const cleaned = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return res.status(400).json({ error: 'bad_json' });
  }

  const result = validateResponse(parsed, mode);
  if (!result.ok) {
    return res.status(400).json({ error: result.code });
  }

  return res.json(result.data);
};
