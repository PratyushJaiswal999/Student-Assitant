import { useEffect, useState } from 'react';
import { RotateCcw, RefreshCw, Check, X } from 'lucide-react';

/**
 * QuizResults — score count-up, perfect-score highlight, no disabled retest button.
 * onRetest: only rendered when there are wrong answers.
 */
export default function QuizResults({ questions, answers, onRetest, onRestart }) {
  const total = questions.length;
  const correct = questions.filter((q, i) => answers[i] === q.correctIndex).length;
  const percent = Math.round((correct / total) * 100);
  const isPerfect = percent === 100;

  // Score count-up: 0 → percent in ~500ms
  const [displayScore, setDisplayScore] = useState(0);
  useEffect(() => {
    if (percent === 0) return;
    const duration = 500;
    const steps = 30;
    const increment = percent / steps;
    const stepMs = duration / steps;
    let current = 0;
    const id = setInterval(() => {
      current = Math.min(current + increment, percent);
      setDisplayScore(Math.round(current));
      if (current >= percent) clearInterval(id);
    }, stepMs);
    return () => clearInterval(id);
  }, [percent]);

  const wrongQuestions = questions.filter((q, i) => answers[i] !== q.correctIndex);

  let verdict = '';
  if (isPerfect) verdict = '🏆 Perfect!';
  else if (percent >= 80) verdict = '🎉 Great job!';
  else if (percent >= 60) verdict = '👍 Good effort!';
  else verdict = '📚 Keep studying!';

  return (
    <div className="panel quiz-results">
      <h2 className="results-title">{verdict}</h2>
      <p className="results-subtitle">Here's how you did:</p>

      <div className="results-score">
        <span className="score-number" aria-label={`${percent} percent`}>
          {displayScore}%
        </span>
        <span className="score-label">{correct} / {total} correct</span>
      </div>

      {/* Perfect score — highlighted line instead of retest button */}
      {isPerfect && (
        <p className="perfect-line">
          You got every question right. Impressive!
        </p>
      )}

      {wrongQuestions.length > 0 && (
        <div className="wrong-answers-section">
          <h3>Missed ({wrongQuestions.length})</h3>
          {wrongQuestions.map(q => {
            const yourIndex = answers[questions.indexOf(q)];
            return (
              <div key={q.id} className="wrong-item">
                <p className="wrong-q">{q.question}</p>
                <p className="wrong-correct">
                  <Check size={12} />
                  {q.options[q.correctIndex]}
                </p>
                {yourIndex !== undefined && yourIndex !== null && (
                  <p className="wrong-yours">
                    <X size={12} />
                    {q.options[yourIndex]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="results-actions">
        {/* Retest only if there are wrong answers */}
        {wrongQuestions.length > 0 && (
          <button
            id="retest-btn"
            className="btn-retest"
            onClick={() => onRetest(wrongQuestions)}
          >
            <RotateCcw size={14} />
            Retry wrong ({wrongQuestions.length})
          </button>
        )}
        <button id="restart-btn" className="btn-restart" onClick={onRestart}>
          <RefreshCw size={14} />
          Start over
        </button>
      </div>
    </div>
  );
}
