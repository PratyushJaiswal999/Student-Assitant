import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Flashcard from './Flashcard';

/** FlashcardDeck — nav, progress bar, arrow keys, swipe support */
export default function FlashcardDeck({ data }) {
  const { topic, cards } = data;
  const [index, setIndex] = useState(0);

  const total = cards.length;
  const current = cards[index];
  const progress = ((index + 1) / total) * 100;

  // Arrow key navigation
  useEffect(() => {
    function onKey(e) {
      if (e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setIndex(i => Math.min(i + 1, total - 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setIndex(i => Math.max(i - 1, 0));
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [total]);

  // Touch swipe support
  const touchStartX = useRef(null);
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setIndex(i => Math.min(i + 1, total - 1)); // swipe left → next
      else setIndex(i => Math.max(i - 1, 0));                 // swipe right → prev
    }
    touchStartX.current = null;
  }

  const MAX_DOTS = 9;
  const showDots = total <= MAX_DOTS;

  return (
    <div className="panel flashcard-deck">
      <div className="deck-header">
        <div>
          {topic && (
            <div className="topic-badge">
              <span className="topic-name">{topic}</span>
            </div>
          )}
          <h2>Flashcards</h2>
        </div>
        <span className="deck-counter" aria-live="polite">
          {index + 1} / {total}
        </span>
      </div>

      <div className="progress-bar-wrap" aria-hidden="true">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Flashcard card={current} />
      </div>

      <div className="deck-nav">
        <button
          id="prev-card-btn"
          className="btn-nav"
          onClick={() => setIndex(i => i - 1)}
          disabled={index === 0}
          aria-label="Previous card"
        >
          <ChevronLeft size={18} />
        </button>

        {showDots && (
          <div className="nav-dots" aria-hidden="true">
            {cards.map((_, i) => (
              <div key={i} className={`nav-dot${i === index ? ' active' : ''}`} />
            ))}
          </div>
        )}

        <button
          id="next-card-btn"
          className="btn-nav"
          onClick={() => setIndex(i => i + 1)}
          disabled={index === total - 1}
          aria-label="Next card"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
