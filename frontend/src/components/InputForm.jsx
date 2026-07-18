import ModeToggle from './ModeToggle';

/**
 * InputForm — also used in the mobile sticky bar (stickyBar prop = true).
 * In sticky bar mode, only renders the generate button (no textarea/toggle).
 */
export default function InputForm({ text, onTextChange, mode, onModeChange, onSubmit, isLoading, stickyBar }) {
  const canSubmit = text.trim().length > 0 && !isLoading;

  function handleSubmit(e) {
    e.preventDefault();
    if (canSubmit) onSubmit();
  }

  // Sticky bar: just the generate button
  if (stickyBar) {
    return (
      <button
        id="sticky-generate-btn"
        type="button"
        className="btn-generate"
        disabled={!canSubmit}
        onClick={onSubmit}
        aria-label="Generate study material"
      >
        {isLoading ? (
          <>
            Generating
            <span className="btn-loading-dots" aria-hidden="true">
              <span /><span /><span />
            </span>
          </>
        ) : (
          '✨ Generate'
        )}
      </button>
    );
  }

  return (
    <form className="panel input-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="notes-textarea">Your notes or topic</label>
      <textarea
        id="notes-textarea"
        value={text}
        onChange={e => onTextChange(e.target.value)}
        placeholder='Paste your notes, a paragraph, or just type a topic — e.g. "The French Revolution"'
        disabled={isLoading}
        aria-label="Notes or topic input"
      />
      <div className="form-row">
        <ModeToggle mode={mode} onChange={onModeChange} disabled={isLoading} />
        <button
          id="generate-btn"
          type="submit"
          className="btn-generate"
          disabled={!canSubmit}
          aria-label="Generate study material"
        >
          {isLoading ? (
            <>
              Generating
              <span className="btn-loading-dots" aria-hidden="true">
                <span /><span /><span />
              </span>
            </>
          ) : (
            '✨ Generate'
          )}
        </button>
      </div>
    </form>
  );
}
