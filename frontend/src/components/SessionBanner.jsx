import { History, X } from 'lucide-react';
import { formatSavedAt } from '../hooks/useSession';

/**
 * SessionBanner — shown at the top of the result area when a saved session exists.
 * Lets the user resume their last session or dismiss and start fresh.
 */
export default function SessionBanner({ session, onResume, onDismiss }) {
  const when = formatSavedAt(session.savedAt);
  const label = session.result.type === 'flashcards'
    ? `${session.result.cards.length} flashcards`
    : `${session.result.questions.length}-question quiz`;

  return (
    <div className="session-banner state-enter" role="status">
      <div className="session-banner-left">
        <History size={15} className="session-icon" />
        <div>
          <span className="session-label">Last session</span>
          <span className="session-detail">
            {session.result.topic
              ? <><strong>{session.result.topic}</strong> · {label}</>
              : label
            }
            {when && <span className="session-when"> · {when}</span>}
          </span>
        </div>
      </div>
      <div className="session-banner-right">
        <button
          id="resume-session-btn"
          className="btn-resume"
          onClick={onResume}
        >
          Resume
        </button>
        <button
          id="dismiss-session-btn"
          className="btn-icon-subtle"
          onClick={onDismiss}
          aria-label="Dismiss saved session"
          title="Dismiss"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
