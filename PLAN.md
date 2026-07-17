# Study Assistant — Build Plan

Chosen option: **Study Assistant** (notes/topic → flashcards or quiz → flip through, take quiz, retest wrong answers).

Goal: a clean, simple, working core. No fancy state libraries, no UI framework you have to fight with. Every piece should be easy to explain in the interview.

---

## 1. Tech Stack (kept deliberately simple)

- **Frontend:** React + Vite (plain JavaScript, no TypeScript)
- **Styling:** plain CSS file(s), no CSS framework — one less thing to explain/debug
- **State:** `useState` / `useReducer` in React, no Redux/Zustand — the app is small enough that plain hooks are enough, and it's easier to walk through in an interview
- **Backend:** a small Express server with **one route**, `/api/generate` — its only job is to hide the API key and call the LLM
- **AI provider:** Groq (fast, free tier, good at returning clean JSON) — but any provider works, model choice doesn't affect grading
- **Deploy (optional):** frontend on Vercel/Netlify, backend on Render/Railway — optional per the assignment, skip if short on time

Why a backend at all: the assignment requires the API key never ships to the browser. A single Express route is the smallest possible way to satisfy that.

---

## 2. Folder Structure

```
study-assistant/
  backend/
    server.js          # Express app, one POST route
    prompt.js           # builds the prompt + JSON schema instructions
    validateResponse.js # checks the AI's JSON has the right shape
    .env                 # API key (gitignored)
  frontend/
    src/
      App.jsx
      api.js             # fetch call to backend, with abort support
      components/
        InputForm.jsx
        LoadingState.jsx
        ErrorState.jsx
        EmptyState.jsx
        ModeToggle.jsx
        flashcards/
          FlashcardDeck.jsx
          Flashcard.jsx
        quiz/
          Quiz.jsx
          QuizQuestion.jsx
          QuizResults.jsx
      styles/
        app.css
    index.html
  README.md
  PROGRESS.md
```

Keep components small and single-purpose. If a file is doing two jobs, split it.

---

## 3. Data Contract (the shape the AI must return)

Decide this before writing any prompt code — everything else depends on it.

**Flashcards:**
```json
{
  "type": "flashcards",
  "topic": "Photosynthesis",
  "cards": [
    { "id": "c1", "front": "What is chlorophyll?", "back": "The green pigment that absorbs light for photosynthesis." }
  ]
}
```

**Quiz:**
```json
{
  "type": "quiz",
  "topic": "Photosynthesis",
  "questions": [
    {
      "id": "q1",
      "question": "Where does photosynthesis mainly occur?",
      "options": ["Roots", "Chloroplasts", "Mitochondria", "Nucleus"],
      "correctIndex": 1
    }
  ]
}
```

Both are simple arrays of flat objects — easy to validate, easy to render, easy to reason about when something goes wrong.

---

## 4. Data Flow

1. User pastes notes/topic into a textarea, picks "Flashcards" or "Quiz" (`ModeToggle`).
2. Frontend sends `POST /api/generate` with `{ text, mode }`, using `AbortController` (see race-condition handling below).
3. Backend builds a strict prompt (`prompt.js`) that tells the model: *return ONLY JSON, matching this exact shape, no prose, no markdown fences.*
4. Backend calls the LLM.
5. Backend runs the raw response through `validateResponse.js`:
   - Try `JSON.parse` — if it throws, return a `400` with `{ error: "bad_json" }`.
   - Check top-level shape matches expected `type` and array field — if not, return `400` with `{ error: "bad_shape" }`.
   - If array is empty, return `400` with `{ error: "empty" }`.
6. Backend sends validated JSON (or a clear error) to frontend.
7. Frontend renders flashcards or quiz, OR shows an error/retry state.

Keeping validation on the **backend** means the frontend only ever deals with either "clean data" or "a known error code" — never raw AI text. This makes the frontend components much simpler.

---

## 5. Error & Edge-Case Handling (20% of the grade — treat this as core work, not an afterthought)

| Case | How it's handled |
| --- | --- |
| Malformed JSON | Backend `try/catch` on `JSON.parse`, returns `400 bad_json` → frontend shows "Couldn't read that response, try again" + Retry button |
| Wrong shape (missing fields, wrong type) | `validateResponse.js` checks required keys exist and are the right type → `400 bad_shape` → same retry UI |
| Empty result (`cards: []`) | Treated as a distinct `empty` state → "No cards could be made from that text — try adding more detail" |
| Slow response | Loading spinner shown immediately; a client-side timeout (e.g. 20s) flips to a "This is taking a while" message with a Retry option, without cancelling the real request |
| Failed request (network/500) | `catch` block on the fetch → generic error state + Retry |
| **Stale response overwriting a newer one** | Every generate click creates a new `AbortController` and a request id. Before rendering a response, check its id still matches the latest request id in state. If the user clicks Generate twice, only the most recent response is ever rendered — the old fetch is aborted. |
| No crashes on bad input | All rendering of AI data goes through the validated shape only — components never touch raw AI text directly |

This table is basically the spec for `ErrorState.jsx` and the fetch logic in `api.js`. Build these early, not last.

---

## 6. Component Responsibilities

- **`InputForm`** — textarea, mode toggle, Generate button. Disabled while loading.
- **`LoadingState`** — spinner + one of the required loading states.
- **`EmptyState`** — shown before first generate, and for the "0 cards returned" case.
- **`ErrorState`** — shown for any handled failure, always has a Retry button that re-runs the last request.
- **`FlashcardDeck`** — holds current card index, renders `Flashcard`, has next/prev.
- **`Flashcard`** — flip animation (CSS only, no library needed), shows front/back.
- **`Quiz`** — holds current question index + user's answers in state.
- **`QuizQuestion`** — renders one question + options, calls back up on answer select.
- **`QuizResults`** — shows score, list of wrong answers, and a "Retest wrong answers" button that re-runs `Quiz` with just the missed questions (client-side filter, no new AI call needed).

---

## 7. Step-by-Step Build Order (mapped to ~8 hours, commit after each)

Small commits, one logical change each — matches the "small, meaningful commits" requirement.

| # | Task | Est. time | Commit message |
| --- | --- | --- | --- |
| 1 | Scaffold Vite React app + Express backend folder, basic hello-world on both | 30 min | `chore: scaffold frontend and backend` |
| 2 | Express `/api/generate` route returning a **hardcoded mock** flashcards JSON | 30 min | `feat: add mock generate endpoint` |
| 3 | Build `InputForm` + `ModeToggle`, wire fetch to the mock endpoint | 30 min | `feat: add input form wired to mock API` |
| 4 | Write `prompt.js`, connect backend to the real LLM API, replace mock | 1 hr | `feat: connect backend to LLM with structured prompt` |
| 5 | Write `validateResponse.js`, return proper error codes | 45 min | `feat: validate AI response shape on backend` |
| 6 | Build `LoadingState`, `ErrorState`, `EmptyState`, retry logic, request-id/abort handling | 1 hr 15 min | `feat: add loading, error, empty states and stale-response guard` |
| 7 | Build `FlashcardDeck` + `Flashcard` (flip, next/prev) | 1 hr | `feat: add flashcard flip and navigation` |
| 8 | Build `Quiz`, `QuizQuestion`, `QuizResults`, scoring, retest-wrong flow | 1 hr 30 min | `feat: add quiz mode with scoring and retest` |
| 9 | Mobile responsive CSS pass (test at 375px width) | 45 min | `style: make layout responsive for mobile` |
| 10 | Manual testing: unplug wifi, break the prompt on purpose, click Generate twice fast, empty textarea, etc. | 30 min | `test: manual pass on error and edge cases` |
| 11 | Write README, record demo screen capture | 30 min | `docs: add README with setup, AI-usage note, and limitations` |

Total: ~8 hours. If time runs short, cut in this order: mobile polish → quiz retest → flashcard flip animation (keep the flip functional even if not animated). **Never cut the error handling step — that's the highest-weighted part.**

---

## 8. Stretch Goals (only after everything above is solid — do NOT start these early)

- Let the AI return mixed block types (e.g. a summary card alongside flashcards) and render each with a small "block registry" (a `{ type: Component }` map)
- Stream the response token-by-token instead of waiting for the full JSON
- A refinement loop: "make these harder" as a follow-up prompt that edits the existing set instead of regenerating from scratch
- Save/reload a session using `localStorage`
- Dark mode toggle, keyboard navigation (arrow keys to flip/advance cards)

A finished core beats a half-working stretch feature — this is explicitly called out in the grading notes.
