import { useEffect } from 'react';
import { Check, X } from 'lucide-react';

/** QuizQuestion — 4 options, arrow key selection, colorblind-safe correct/wrong indicators */

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuizQuestion({ question, onAnswer, answered }) {
  const { question: text, options, correctIndex, id } = question;
  const hasAnswered = answered !== null && answered !== undefined;

  // Arrow keys to select option when unanswered
  useEffect(() => {
    if (hasAnswered) return;
    function onKey(e) {
      if (e.target.tagName === 'TEXTAREA') return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
      if (map[e.key] !== undefined) {
        onAnswer(map[e.key]);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasAnswered, onAnswer]);

  return (
    <div className="quiz-question-card">
      <p className="question-text">{text}</p>
      <div className="options-list" role="list">
        {options.map((opt, i) => {
          const isCorrect = i === correctIndex;
          const isWrong = hasAnswered && i === answered && !isCorrect;
          const isReveal = hasAnswered && !isCorrect && i !== answered;

          let className = 'option-btn';
          if (hasAnswered) {
            if (isCorrect) className += ' correct';
            else if (isWrong) className += ' wrong';
            else if (isReveal) className += ' reveal';
          }

          return (
            <button
              key={`${id}-opt-${i}`}
              id={`option-${id}-${i}`}
              className={className}
              onClick={() => !hasAnswered && onAnswer(i)}
              disabled={hasAnswered}
              role="listitem"
            >
              <span className="option-letter">{LETTERS[i]}</span>
              {opt}
              {/* Non-color cue for colorblind users */}
              {hasAnswered && isCorrect && (
                <span className="option-icon" aria-label="Correct">
                  <Check size={15} strokeWidth={2.5} />
                </span>
              )}
              {hasAnswered && isWrong && (
                <span className="option-icon" aria-label="Incorrect">
                  <X size={15} strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
