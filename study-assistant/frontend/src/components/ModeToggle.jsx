import { useRef, useLayoutEffect, useState } from 'react';
import { Layers, ClipboardList } from 'lucide-react';

/**
 * ModeToggle — Flashcards / Quiz selector with a sliding pill indicator.
 * The pill moves smoothly via absolute positioning measured from the DOM.
 */
export default function ModeToggle({ mode, onChange, disabled }) {
  const flashcardsRef = useRef(null);
  const quizRef = useRef(null);
  const containerRef = useRef(null);
  const [sliderStyle, setSliderStyle] = useState({ left: 3, width: 100 });

  // Measure active button position and update slider
  useLayoutEffect(() => {
    const activeRef = mode === 'flashcards' ? flashcardsRef : quizRef;
    const btn = activeRef.current;
    const container = containerRef.current;
    if (!btn || !container) return;
    const btnRect = btn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setSliderStyle({
      left: btnRect.left - containerRect.left,
      width: btnRect.width,
    });
  }, [mode]);

  return (
    <div
      className="mode-toggle"
      ref={containerRef}
      role="group"
      aria-label="Select study mode"
    >
      {/* Sliding pill */}
      <div
        className="mode-toggle-slider"
        aria-hidden="true"
        style={{ left: sliderStyle.left, width: sliderStyle.width }}
      />

      <button
        id="mode-flashcards"
        ref={flashcardsRef}
        className={mode === 'flashcards' ? 'active' : ''}
        onClick={() => onChange('flashcards')}
        disabled={disabled}
        aria-pressed={mode === 'flashcards'}
      >
        <Layers size={14} />
        Flashcards
      </button>
      <button
        id="mode-quiz"
        ref={quizRef}
        className={mode === 'quiz' ? 'active' : ''}
        onClick={() => onChange('quiz')}
        disabled={disabled}
        aria-pressed={mode === 'quiz'}
      >
        <ClipboardList size={14} />
        Quiz
      </button>
    </div>
  );
}
