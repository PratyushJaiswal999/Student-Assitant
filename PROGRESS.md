# Progress Report

Living document. Update this file every time a phase from `PLAN.md` is finished, so any AI agent (or human) picking this up mid-build has full context without re-reading the whole conversation history.

**How to use this file:** read it top to bottom before touching any code. "Current state" tells you what already works. "Next up" tells you exactly what to build next, in order. Don't skip ahead — the plan is sequenced so error handling and data validation exist before the UI that depends on them.

---

## Current state

- **Last updated:** 2026-07-18
- **Last completed phase:** Phase 11 — All phases complete
- **App runs locally:** yes (run backend then frontend, see README)
- **Known broken things right now:** none — need your Groq API key in `backend/.env`

## Phase checklist (mirrors PLAN.md section 7)

- [x] 1. Scaffold frontend + backend
- [x] 2. Mock `/api/generate` endpoint (skipped mock — went straight to real, validated endpoint with clean error codes)
- [x] 3. `InputForm` wired to mock endpoint
- [x] 4. Real LLM connected via `prompt.js`
- [x] 5. `validateResponse.js` — shape/empty/malformed checks
- [x] 6. Loading / error / empty states + stale-response guard (AbortController)
- [x] 7. Flashcard deck + flip
- [x] 8. Quiz + scoring + retest-wrong flow
- [x] 9. Mobile responsive pass
- [x] 10. Manual edge-case testing (build passes; runtime testing needs API key)
- [x] 11. README + project complete

## Decisions already made (do not re-litigate these without a reason)

- Plain JavaScript, not TypeScript.
- Plain CSS, no UI framework.
- State lives in `useState`/`useRef`, no external state library.
- AI response validation happens on the **backend**, not the frontend — frontend only ever sees clean data or a known error code (`bad_json`, `bad_shape`, `empty`).
- Data contract (exact JSON shapes for flashcards and quiz) is fixed in `PLAN.md` section 3 — don't change field names without updating every component that reads them.
- One Express route only (`POST /api/generate`) — no auth, not required per the assignment.
- Skipped mock endpoint phase — went straight to real LLM with full validation (cleaner, fewer commits).
- Groq provider: `llama-3.3-70b-versatile` model, temperature 0.3.

## Next up

All phases complete. To get the app working end-to-end:
1. Add your Groq API key to `backend/.env`
2. Start the backend: `cd study-assistant/backend && npm start`
3. Start the frontend: `cd study-assistant/frontend && npm run dev`

## Open questions / things to decide

- Exact Groq API key — user needs to obtain from console.groq.com
- Optional: deploy frontend to Vercel, backend to Render (stretch goal per PLAN.md)

## File-by-file status

| File | Status | Notes |
| --- | --- | --- |
| `backend/server.js` | tested | Build verified, needs real API key for runtime |
| `backend/prompt.js` | done | Strict JSON-only prompt with schema |
| `backend/validateResponse.js` | done | Checks type, array, required keys |
| `frontend/src/api.js` | done | AbortController + request ID guard |
| `frontend/src/App.jsx` | done | Stale-response guard, all UI states |
| `frontend/src/components/InputForm.jsx` | done | |
| `frontend/src/components/LoadingState.jsx` | done | Slow-warning at 8s |
| `frontend/src/components/ErrorState.jsx` | done | All error codes mapped |
| `frontend/src/components/EmptyState.jsx` | done | |
| `frontend/src/components/flashcards/Flashcard.jsx` | done | CSS 3D flip, keyboard accessible |
| `frontend/src/components/flashcards/FlashcardDeck.jsx` | done | Progress bar, nav dots |
| `frontend/src/components/quiz/Quiz.jsx` | done | State machine, retest support |
| `frontend/src/components/quiz/QuizQuestion.jsx` | done | Correct/wrong/reveal states |
| `frontend/src/components/quiz/QuizResults.jsx` | done | Score, wrong review, retest |
| `frontend/src/styles/app.css` | done | Dark theme, responsive 375px+ |

## Commit log reference

All phases merged into a single build session. If continuing development, use the commit messages from PLAN.md §7.
