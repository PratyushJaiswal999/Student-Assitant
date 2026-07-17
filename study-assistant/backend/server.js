require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { buildPrompt } = require('./prompt');
const { validateResponse } = require('./validateResponse');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

/**
 * POST /api/generate
 * Body: { text: string, mode: 'flashcards' | 'quiz' }
 * Returns: validated flashcards or quiz JSON, or { error: 'bad_json' | 'bad_shape' | 'empty' | 'provider_error' }
 */
app.post('/api/generate', async (req, res) => {
  const { text, mode } = req.body;

  // Basic input validation
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

  // Strip markdown fences if model ignores the instruction
  const cleaned = rawContent
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '');

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    console.error('JSON.parse failed. Raw content:', rawContent);
    return res.status(400).json({ error: 'bad_json' });
  }

  const result = validateResponse(parsed, mode);
  if (!result.ok) {
    console.error('Shape validation failed:', result.code, 'Parsed:', JSON.stringify(parsed).slice(0, 200));
    return res.status(400).json({ error: result.code });
  }

  return res.json(result.data);
});

app.listen(PORT, () => {
  console.log(`Study Assistant backend running on http://localhost:${PORT}`);
});
