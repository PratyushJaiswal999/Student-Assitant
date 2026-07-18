# Study Assistant

An AI-powered study tool that converts your notes or any topic into **flashcards** or a **quiz** in seconds.

## Demo

🎬 [Watch the demo video](https://drive.google.com/file/d/1LRUMIRnKCOmRpycNfmNgep3TjMDbK_cw/view?usp=sharing)

## Features

- 🃏 **Flashcards** — click to flip, navigate with prev/next, progress bar
- 📝 **Quiz** — 4-option multiple-choice, instant feedback, see correct answers
- 🔁 **Retest wrong answers** — client-side filter, no extra API call
- ⚡ **Fast** — powered by Groq (llama-3.3-70b)
- 🛡️ **Robust error handling** — malformed JSON, bad shape, empty results, network errors, stale requests

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite, plain CSS |
| Backend | Node.js + Express |
| AI | Groq (`llama-3.3-70b-versatile`) |
| State | `useState` / `useRef` only |

## Setup

### 1. Get a Groq API key
Sign up at [console.groq.com](https://console.groq.com/keys) — it's free.

### 2. Configure backend
```bash
cd study-assistant/backend
copy .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### 3. Install & run backend
```bash
cd study-assistant/backend
npm install
npm start
# Runs on http://localhost:3001
```

### 4. Install & run frontend
```bash
cd study-assistant/frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

## Project Structure

```
study-assistant/
  backend/
    server.js            Express app, one POST /api/generate route
    prompt.js            Builds the LLM prompt with strict JSON-only instructions
    validateResponse.js  Validates the AI JSON shape (bad_json / bad_shape / empty)
    .env                 Your Groq API key (gitignored)
  frontend/
    src/
      App.jsx            Root component — state, request ID guard, AbortController
      api.js             fetch wrapper with abort support
      components/
        InputForm.jsx    Textarea + mode toggle + generate button
        LoadingState.jsx Spinner + slow-request warning
        ErrorState.jsx   Error messages mapped from error codes + Retry button
        EmptyState.jsx   Initial and empty-result states
        ModeToggle.jsx   Flashcards / Quiz selector
        flashcards/
          FlashcardDeck.jsx  Card navigation + progress bar
          Flashcard.jsx      3D CSS flip animation
        quiz/
          Quiz.jsx           Quiz flow state machine
          QuizQuestion.jsx   One question + 4 options
          QuizResults.jsx    Score + wrong review + retest
      styles/app.css     All styles — dark theme, responsive
```

## Error Handling

| Scenario | Behaviour |
|---|---|
| Malformed JSON from AI | `bad_json` → "Couldn't read that response" + Retry |
| Wrong JSON shape | `bad_shape` → "Unexpected response format" + Retry |
| AI returns 0 items | `empty` → "No items generated" message |
| Slow response (>8s) | "This is taking a while…" warning appears |
| Network failure | `network_error` → error state + Retry |
| User clicks Generate twice | Previous request aborted via `AbortController`; stale response discarded via request ID |

## AI Usage Note

- The AI (Groq / llama-3.3-70b) is prompted to return **only JSON**, with an exact schema.
- All validation happens on the **backend** — the frontend only ever sees clean data or a known error code.
- The API key is kept server-side only; it never reaches the browser.

## Limitations

- No persistence — refresh = start over (by design, localStorage is a stretch goal)
- Requires a Groq API key and Node.js backend running locally
