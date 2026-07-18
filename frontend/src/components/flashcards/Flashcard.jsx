import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

/**
 * Flashcard — CSS 3D flip (400ms settling ease).
 * Space/Enter to flip. Arrow keys handled by FlashcardDeck.
 */
export default function Flashcard({ card }) {
  const [flipped, setFlipped] = useState(false);

  // Reset flip when card changes (compare by id)
  const [prevId, setPrevId] = useState(card.id);
  if (card.id !== prevId) {
    setPrevId(card.id);
    setFlipped(false);
  }

  function handleFlip() {
    setFlipped(f => !f);
  }

  return (
    <div
      className="flashcard-scene"
      onClick={handleFlip}
      role="button"
      tabIndex={0}
      aria-label={flipped ? `Answer: ${card.back}. Press Space to flip back.` : `Question: ${card.front}. Press Space to flip.`}
      onKeyDown={e => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleFlip();
        }
      }}
    >
      <div className={`flashcard-inner${flipped ? ' flipped' : ''}`}>
        {/* Front */}
        <div className="flashcard-face front">
          <span className="face-label">Question</span>
          <p className="face-text">{card.front}</p>
          <span className="flip-hint">
            <RotateCcw size={11} />
            Click to reveal answer
          </span>
        </div>

        {/* Back */}
        <div className="flashcard-face back">
          <span className="face-label back-label">Answer</span>
          <p className="face-text">{card.back}</p>
        </div>
      </div>
    </div>
  );
}
