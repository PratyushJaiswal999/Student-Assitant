import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

export default function Quiz({ data, onRestart }) {
  const { topic, questions: allQuestions } = data;
  const [questions, setQuestions] = useState(allQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);

  const total = questions.length;
  const progress = ((currentIndex + 1) / total) * 100;
  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex] ?? null;
  const hasAnswered = currentAnswer !== null;

  function handleAnswer(optionIndex) {
    setAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  }

  function handleNext() {
    if (currentIndex < total - 1) setCurrentIndex(i => i + 1);
    else setDone(true);
  }

  function handleRetest(wrongQuestions) {
    // Client-side filter — no new AI call
    setQuestions(wrongQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setDone(false);
  }

  if (done) {
    return (
      <QuizResults
        questions={questions}
        answers={answers}
        onRetest={handleRetest}
        onRestart={onRestart}
      />
    );
  }

  return (
    <div className="panel">
      <div className="quiz-header">
        <div>
          {topic && (
            <div className="topic-badge">
              <span className="topic-name">{topic}</span>
            </div>
          )}
          <h2>Quiz</h2>
        </div>
        <span className="quiz-counter" aria-live="polite">
          {currentIndex + 1} / {total}
        </span>
      </div>

      <div className="progress-bar-wrap" aria-hidden="true">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <QuizQuestion
        question={currentQuestion}
        onAnswer={handleAnswer}
        answered={currentAnswer}
      />

      {hasAnswered && (
        <div className="next-btn-wrap">
          <button id="next-question-btn" className="btn-next" onClick={handleNext}>
            {currentIndex < total - 1 ? (
              <>Next <ChevronRight size={15} /></>
            ) : (
              'See Results'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
