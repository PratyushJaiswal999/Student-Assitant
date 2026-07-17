import { useState, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { loadSession, saveSession, clearSession } from './hooks/useSession';
import { generate } from './api';
import InputForm from './components/InputForm';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import EmptyState from './components/EmptyState';
import SessionBanner from './components/SessionBanner';
import FlashcardDeck from './components/flashcards/FlashcardDeck';
import Quiz from './components/quiz/Quiz';
import { Sun, Moon } from 'lucide-react';
import './styles/app.css';

let requestCounter = 0;

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();

  // ── Session ─────────────────────────────────────────────
  // Load once at startup; null if nothing saved or corrupted
  const [savedSession, setSavedSession] = useState(() => loadSession());

  const [text, setText] = useState('');
  const [mode, setMode] = useState('flashcards');
  const [uiState, setUiState] = useState('idle');
  const [result, setResult] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  const abortRef = useRef(null);
  const latestRequestId = useRef(0);

  // ── Generate ─────────────────────────────────────────────
  async function handleGenerate() {
    if (abortRef.current) abortRef.current.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    requestCounter += 1;
    const myId = requestCounter;
    latestRequestId.current = myId;

    setUiState('loading');
    setResult(null);
    setErrorCode(null);
    setSavedSession(null); // hide banner while generating

    try {
      const data = await generate(text, mode, controller.signal);
      if (myId !== latestRequestId.current) return;
      setResult(data);
      setUiState('done');
      // Persist to localStorage on success
      saveSession(data, text, mode);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (myId !== latestRequestId.current) return;
      setErrorCode(err.code ?? 'unknown_error');
      setUiState('error');
    }
  }

  // ── Resume saved session ──────────────────────────────────
  function handleResumeSession() {
    if (!savedSession) return;
    setText(savedSession.text ?? '');
    setMode(savedSession.mode ?? 'flashcards');
    setResult(savedSession.result);
    setUiState('done');
    setSavedSession(null);
  }

  function handleDismissSession() {
    clearSession();
    setSavedSession(null);
  }

  // ── Retry / Restart ───────────────────────────────────────
  function handleRetry() { handleGenerate(); }

  function handleRestart() {
    if (abortRef.current) abortRef.current.abort();
    setUiState('idle');
    setResult(null);
    setErrorCode(null);
    clearSession();
  }

  const isLoading = uiState === 'loading';

  return (
    <>
      <div className="app-wrapper">
        <header className="app-header">
          <div className="header-top">
            <h1>
              Study <span className="highlight">Assistant</span>
            </h1>
            <button
              id="theme-toggle"
              className="btn-theme"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <p>Turn your notes into flashcards or a quiz — powered by AI</p>
        </header>

        <main className="app-main">
          <InputForm
            text={text}
            onTextChange={setText}
            mode={mode}
            onModeChange={setMode}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />

          {/* Saved session banner — shown in idle state when a session exists */}
          {uiState === 'idle' && savedSession && (
            <SessionBanner
              session={savedSession}
              onResume={handleResumeSession}
              onDismiss={handleDismissSession}
            />
          )}

          {uiState === 'idle' && (
            <div className="state-enter">
              <EmptyState variant="initial" />
            </div>
          )}
          {uiState === 'loading' && (
            <div className="state-enter">
              <LoadingState mode={mode} />
            </div>
          )}
          {uiState === 'error' && (
            <div className="state-enter">
              <ErrorState code={errorCode} onRetry={handleRetry} />
            </div>
          )}
          {uiState === 'done' && result && (
            <div className="state-enter-slow">
              {result.type === 'flashcards'
                ? <FlashcardDeck data={result} />
                : <Quiz data={result} onRestart={handleRestart} />
              }
            </div>
          )}
        </main>
      </div>

      {/* Mobile sticky action bar */}
      <div className="sticky-bar">
        <InputForm
          text={text}
          onTextChange={setText}
          mode={mode}
          onModeChange={setMode}
          onSubmit={handleGenerate}
          isLoading={isLoading}
          stickyBar
        />
      </div>
    </>
  );
}
