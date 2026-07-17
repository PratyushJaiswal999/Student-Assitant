import { RefreshCw } from 'lucide-react';

/** ErrorState — dashed-card sketch motif, one verb: "Retry" */

const MESSAGES = {
  bad_json: {
    title: "That response didn't come through right.",
    detail: 'The AI returned something we couldn\'t parse. Hit Retry and it usually works.',
  },
  bad_shape: {
    title: "That response didn't come through right.",
    detail: 'The response format was unexpected. Try again or rephrase your input.',
  },
  empty: {
    title: "Couldn't make cards from that.",
    detail: 'Try adding a bit more detail or a longer passage.',
  },
  network_error: {
    title: 'Connection failed.',
    detail: 'Check your internet connection and try again.',
  },
  provider_error: {
    title: 'The AI had a moment.',
    detail: 'The AI service had a hiccup. Try again in a few seconds.',
  },
  bad_input: {
    title: 'Add some text first.',
    detail: 'Paste your notes or a topic above before generating.',
  },
};

export default function ErrorState({ code, onRetry }) {
  const msg = MESSAGES[code] ?? {
    title: 'Something went wrong.',
    detail: 'An unexpected error occurred. Please try again.',
  };

  return (
    <div className="panel error-state" role="alert">
      {/* Dashed card sketch — same visual language as skeleton and empty */}
      <div className="error-sketch" aria-hidden="true">
        <div className="error-sketch-card" />
        <div className="error-sketch-card" />
      </div>
      <h3>{msg.title}</h3>
      <p>{msg.detail}</p>
      <button id="retry-btn" className="btn-retry" onClick={onRetry}>
        <RefreshCw size={14} strokeWidth={2.5} />
        Retry
      </button>
    </div>
  );
}
