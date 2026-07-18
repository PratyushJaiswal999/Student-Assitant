# Study Assistant — Frontend Assignment Submission

An AI-powered interactive study application that converts free-form text notes or topics into fully structured **flashcards** or **quizzes** in seconds.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://student-assitant-sigma.vercel.app/)
[![Demo Video](https://img.shields.io/badge/Demo_Video-Google_Drive-34A853?style=for-the-badge&logo=google-drive&logoColor=white)](https://drive.google.com/file/d/1LRUMIRnKCOmRpycNfmNgep3TjMDbK_cw/view?usp=sharing)

## ⏱️ Time Spent
- **Total Time:** `~6.5 hours` (fully completed the core assignment, error handling checklist, and 4 stretch goals).

---

## ✨ Features

- 🃏 **Flashcards** — click to flip, navigate with prev/next, progress bar
- 📝 **Quiz** — 4-option multiple-choice, instant feedback, see correct answers
- 🔁 **Retest wrong answers** — client-side filter, no extra API call
- 💾 **Session Save & Reload** — persists state to `localStorage`, resume without extra API calls
- ⌨️ **Keyboard Navigation** — Space/Enter to flip, arrow keys to navigate, number keys for quiz options
- 🌗 **Light & Dark Mode** — smooth theme transitions with theme-aware backgrounds
- ⚡ **Fast** — powered by Groq (`llama-3.3-70b-versatile`)
- 🛡️ **Robust error handling** — malformed JSON, bad shape, empty results, network errors, stale requests, rate limiting

---

## 🧱 Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite, plain CSS |
| Backend | Node.js + Express |
| AI | Groq (`llama-3.3-70b-versatile`) |
| State | `useState` / `useRef` only |

---

## 🚀 Setup & Running Locally

Ensure you have [Node.js](https://nodejs.org/) installed.

### 1. Configure the API Key
1. Get a free Groq API key at [console.groq.com](https://console.groq.com/keys).
2. Go to the backend folder:
   ```bash
   cd backend
   ```
3. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
4. Open `.env` and replace `your_groq_api_key_here` with your real Groq API key.

### 2. Start the Backend Server (Express)
From the `backend` folder:
```bash
npm install
npm start
```
*Runs on [http://localhost:3001](http://localhost:3001).*

### 3. Start the Frontend Dev Server (React + Vite)
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
npm run dev
```
*Opens at [http://localhost:5173](http://localhost:5173).*

---

## 🗂️ Project Structure

```
Student-Assitant/
  backend/
    server.js            # Express app with rate limiting & /api/generate endpoint
    prompt.js            # Strict prompt builder forcing JSON schema output
    validateResponse.js  # Shape, array and schema checker for raw LLM JSON
    .env                 # Your Groq API key (gitignored)
  frontend/
    src/
      App.jsx            # Main app state controller & stale-request guard
      api.js             # API request builder with abort support
      hooks/
        useTheme.js      # Handles light/dark mode and localStorage persistence
        useSession.js    # Manages saving and reloading state from localStorage
      components/
        InputForm.jsx    # User input, mode toggle, and generate buttons
        LoadingState.jsx # Skeleton layout shaped like cards/quiz blocks
        ErrorState.jsx   # Error screen mapping codes (e.g. rate limit, shape)
        EmptyState.jsx   # Friendly empty prompt invitation
        SessionBanner.jsx# Bottom banner showing relative saved session age
        ModeToggle.jsx   # Flashcards / Quiz selector
        flashcards/
          FlashcardDeck.jsx  # Navigates the deck, shows progress
          Flashcard.jsx      # CSS 3D flip card, space/enter triggers
        quiz/
          Quiz.jsx           # State machine controlling quiz workflow
          QuizQuestion.jsx   # Renders option buttons with non-color indicators
          QuizResults.jsx    # Scoring, counts up anim, retests wrong questions
      styles/app.css     # Dark/light variables, glassmorphism panel styling
```

---

## 🛡️ Error Handling

| Scenario | Behaviour |
|---|---|
| Malformed JSON from AI | `bad_json` → "Couldn't read that response" + Retry |
| Wrong JSON shape | `bad_shape` → "Unexpected response format" + Retry |
| AI returns 0 items | `empty` → "No items generated" message |
| Slow response (>8s) | "This is taking a while…" warning appears |
| Network failure | `network_error` → error state + Retry |
| User clicks Generate twice | Previous request aborted via `AbortController`; stale response discarded via request ID |
| Too many requests | Rate limiter: 15 requests / 15 min per IP |

---

## 🌟 Implemented Stretch Goals

### 1. 💾 Session Save & Reload (`localStorage`)
- Auto-persists generated cards/quiz state, source text, and chosen mode to local storage.
- On refresh, a **Session Banner** lets you resume your last study deck instantly — zero extra API requests.

### 2. ⌨️ Keyboard Navigation & Accessibility
- **Flashcards:** Press `Space` or `Enter` to flip. Use `←` / `→` arrow keys to change cards.
- **Quiz:** Press number keys `1`, `2`, `3`, `4` to select options.
- **Accessibility:** All colorblind-safe states include non-color indicators (✓ / ✗ icons).

### 3. 🌗 Light & Dark Mode
- Defaults to **Light Theme** on first visit, persists toggle preference.
- Smooth background image transition crossfades between themes.

### 4. 🎨 Custom Blurs & Theme-Aware Backgrounds
- **Light Theme:** Blurred (`8px`), brightened (`1.12`) background for high readability.
- **Dark Theme:** Blurred (`8px`), dimmed (`0.55`) background for comfortable dark-mode aesthetics.

---

## 🤖 AI Usage Note
- **Code Assistance:** Claude Sonnet 3.5 & Gemini Flash were used as pair-programming assistants for CSS layout tokens, React folder structure, Vanta background setup, and edge-case testing.
- **Backend API:** Uses `llama-3.3-70b-versatile` on Groq's high-speed API to convert notes into validated, structured JSON.
- All validation happens **server-side** — the frontend only ever sees clean data or a known error code.
- The API key is kept server-side only; it never reaches the browser.

---

## ⚠️ Known Limitations
- **Offline Mode:** Requires an active internet connection to contact the server and Groq's API.
- **Local Dev Server:** The API key is stored server-side in a local `.env` file — the Node.js backend must remain active for the frontend to work.
