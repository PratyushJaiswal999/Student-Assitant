import { useEffect, useState } from 'react';

/** LoadingState — skeleton shaped like the actual result, not a generic spinner */
export default function LoadingState({ mode }) {
  const [showSlow, setShowSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSlow(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="panel skeleton-loading" role="status" aria-live="polite" aria-label="Generating…">
      {/* Header row skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-line medium" />
        <div className="skeleton-line short" />
      </div>

      {mode === 'flashcards' ? (
        /* 3 blank card outlines — looks like a card deck */
        <div className="skeleton-cards-row">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
      ) : (
        /* Blank question block + 4 option placeholders */
        <div className="skeleton-question-block">
          <div className="skeleton-line long" />
          <div className="skeleton-line medium" style={{ marginBottom: '0.5rem' }} />
          <div className="skeleton-option" />
          <div className="skeleton-option" />
          <div className="skeleton-option" />
          <div className="skeleton-option" />
        </div>
      )}

      {/* Small spinning indicator — confirms something is actively happening */}
      <div className="skeleton-note">
        <div className="skeleton-spinner" aria-hidden="true" />
        <span>Generating your {mode === 'flashcards' ? 'flashcards' : 'quiz'}…</span>
      </div>

      {showSlow && (
        <p className="skeleton-slow-warning">
          ⏳ Still thinking — hang tight, this sometimes takes a moment.
        </p>
      )}
    </div>
  );
}
