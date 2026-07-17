# Study Assistant — Frontend Assignment Submission

An AI-powered interactive study application that converts free-form text notes or topics into fully structured **flashcards** or **quizzes** in seconds.

---

## ⏱️ Time Spent
- **Total Time:** `~6.5 hours` (fully completed the core assignment, error handling checklist, and 4 stretch goals).

---

## 🛠️ Setup & Running Locally

Ensure you have [Node.js](https://nodejs.org/) installed. 

### 1. Configure the API Key
1. Get a free Groq API key at [console.groq.com](https://console.groq.com/keys).
2. Go to the backend folder:
   ```bash
   cd study-assistant/backend
   ```
3. Create a `.env` file from the example:
   ```bash
   copy .env.example .env
   ```
4. Open the `.env` file and replace `your_groq_api_key_here` with your real Groq API key.

### 2. Start the Backend Server (Express)
From the `study-assistant/backend` folder:
```bash
npm install
npm start
```
*The backend server will run on [http://localhost:3001](http://localhost:3001).*

### 3. Start the Frontend Dev Server (React + Vite)
Open a new terminal window, navigate to the frontend folder:
```bash
cd study-assistant/frontend
npm install
npm run dev
```
*The website will open automatically at [http://localhost:5173](http://localhost:5173).*

---

## 🤖 AI-Usage Note
- **Code Assistance:** Claude Sonnet 3.5 & Gemini Flash were used as pair-programming assistants to design the responsive CSS layout tokens, structure the initial React folders, help configure Vanta background setups, and test standard edge-case error bounds.
- **Backend API:** The backend utilizes the `llama-3.3-70b-versatile` model hosted on Groq's high-speed API to turn the user's notes into validated, structured JSON formats.

---

## 🛡️ Unpredictable AI Handling & Error Management
We place a premium on handling bad AI output. The application does not crash under any edge case:

- **Malformed JSON:** The backend wraps `JSON.parse` in a `try/catch` and returns a `400 bad_json` if the LLM output is malformed.
- **Wrong Shape:** `validateResponse.js` strictly checks the JSON data contract (types of keys, structure, non-empty arrays). If it fails, it returns `400 bad_shape`.
- **Empty Output:** If the LLM generates 0 items, the backend returns an `empty` error code.
- **Stale Response Overwrite:** Uses `AbortController` combined with a unique request-ID count. If a user triggers two generation calls in rapid succession, the previous fetch request is aborted immediately, and any delayed stale response is discarded.
- **Slow Requests:** A smart loading screen displays a warning after 8 seconds (*"Still thinking — hang tight..."*) without breaking the API promise.
- **Rate Limiter:** Backend features a rate limiter (`express-rate-limit`) restricting users to **15 requests per 15 minutes** per IP to prevent API key abuse. 

---

## ✨ Implemented Stretch Goals

### 1. 💾 Session Save & Reload (`localStorage`)
- The application automatically persists the generated cards or quiz state, including the source text and chosen mode, into local storage. 
- When refreshing or reopening the browser, a **Session Banner** appears letting you resume your last study deck instantly with zero extra API requests.

### 2. ⌨️ Keyboard Navigation & Accessibility
- **Flashcards:** Press `Space` or `Enter` to flip a card. Use `←` / `→` arrow keys to change cards.
- **Quiz:** Press number keys `1`, `2`, `3`, `4` to select options.
- **Accessibility:** All colorblind-safe states include non-color indicators (Check ✓ / X icons) instead of just red/green styles. Clear focus rings match the custom color variables.

### 3. 🌙 Light & Dark Mode
- Theme defaults to **Light Theme** on first visit and persists toggles.
- Supports smooth background image transition crossfades.

### 4. 🎨 Custom Blurs & Theme-Aware Backgrounds
- **Light Theme:** Features a blurred (`8px`), brightened (`1.12`), and low-contrast version of `front.jpg` to keep typography highly readable.
- **Dark Theme:** Features a blurred (`8px`), dimmed (`0.55`) version of `dark.jpg` to fit comfortable dark-mode aesthetics.

---

## 📂 Project Architecture

```
study-assistant/
  backend/
    server.js            # Express app with rate limiting & /api/generate endpoint
    prompt.js            # Strict prompt builder forcing JSON schema output
    validateResponse.js  # Shape, array and schema checker for raw LLM JSON
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

## ⚠️ Known Limitations
- **Offline Mode:** Requires an active internet connection to contact the server and Groq's API.
- **Local Dev Server:** The API key is stored server-side in a local `.env` file, meaning the local Node.js backend must remain active to serve frontend requests.
