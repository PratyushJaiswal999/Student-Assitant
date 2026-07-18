/** EmptyState — dashed card sketch motif with clear action-oriented copy */
export default function EmptyState({ variant = 'initial' }) {
  if (variant === 'empty') {
    return (
      <div className="panel empty-state">
        <div className="empty-sketch" aria-hidden="true">
          <div className="empty-sketch-card tall" />
          <div className="empty-sketch-card short" />
          <div className="empty-sketch-card tall" style={{ opacity: 0.3 }} />
        </div>
        <h3>Couldn't make cards from that.</h3>
        <p>Try adding a bit more detail or a longer passage.</p>
      </div>
    );
  }

  return (
    <div className="panel empty-state">
      <div className="empty-sketch" aria-hidden="true">
        <div className="empty-sketch-card tall" />
        <div className="empty-sketch-card short" />
        <div className="empty-sketch-card tall" style={{ opacity: 0.3 }} />
      </div>
      <h3>Paste your notes above to generate your first set of cards.</h3>
      <p>
        Works with any topic — paste a paragraph, lecture notes, or just type a subject
        like <em>"The Water Cycle"</em> and pick Flashcards or Quiz.
      </p>
    </div>
  );
}
