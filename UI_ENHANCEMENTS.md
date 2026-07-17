# UI Enhancements

This builds on `UI_DESIGN.md` — read that one first, it has the core system (light/dark theme, type, the highlighter effect, the dot-grid background). This file collects everything else worth adding to make the app feel finished rather than merely functional, all still following the same "index cards + connecting the dots" concept — nothing here introduces a new, unrelated visual idea.

Treat this as optional polish for Phase 9 in `PLAN.md`, after the core states (loading/error/empty/success) already work. Polish the real thing before adding any of this.

---

## 1. Quick recap of the core system (from UI_DESIGN.md)

- Light/dark theme via one `data-theme` attribute + CSS variables, defaults to OS preference, remembered after a manual switch.
- Type: Fraunces (display) + IBM Plex Sans (body) + IBM Plex Mono (numbers/scores).
- Emphasis = bigger + bolder + an actual highlighter-marker stroke behind the text (`.highlight`), used sparingly — one emphasized thing per view.
- Background = a faint dot-grid where 1–2 connections quietly draw and fade at a time; respects `prefers-reduced-motion`.

Everything below extends that system into places it didn't cover yet.

---

## 2. Micro-interactions

Small, quick, and purposeful — never bouncy, never longer than ~250ms.

- **Buttons:** background/opacity transition only (`150ms ease`). No scale-pop, no shadow-lift — keep it flat and calm like the rest of the paper concept.
- **Flashcard flip:** a real 3D flip (`transform: rotateY`), `400ms`, eased so it settles rather than snaps — like turning over a physical card.
- **Quiz option select:** border color transitions to `--accent-ink` on click, `150ms`. On submit, correct answer gets `.highlight--animated` (from UI_DESIGN.md section 4) drawing in over `400ms`.
- **Mode toggle (Flashcards/Quiz):** the active option's underline slides to the new position instead of just swapping color — a single continuous motion, not two separate fades.
- **Generate button while loading:** label crossfades to a short pulsing label rather than being replaced by a spinner icon — keeps the button's shape stable so the layout doesn't jump.

---

## 3. Transitions between states

The four required states (loading / error / empty / success) shouldn't just swap instantly — a short crossfade (`200ms`) between them makes the app feel considered instead of glitchy. Rules:

- Fade out the old state, then fade in the new one — don't cross-dissolve two full layouts on top of each other, it reads as messy.
- Never animate content *in* from off-screen (no slide-ins from the side) — keep motion vertical and small (`8px` rise + fade), consistent with the "settling onto a desk" feel.
- The loading → success transition is the one place a slightly longer beat (`300–350ms`) is fine, since it's rewarding a wait.

---

## 4. Loading state: skeleton, not a spinner

Instead of a generic spinner, show pale, static outlines shaped like the actual result — a row of blank card outlines for flashcard mode, a blank question block for quiz mode. This does double duty: it reads as "on-brand" (still looks like index cards) and sets expectations for what's coming.

```css
.skeleton-card {
  background: var(--surface);
  border: 1px dashed var(--text-muted);
  border-radius: 8px;
  opacity: 0.5;
}
```

Keep a small spinner or pulsing dot *somewhere* too (e.g. next to the Generate button) so it's unambiguous that something is actively happening, not just a static empty layout.

---

## 5. Empty and error states, in the app's own voice

Per the writing guidance this system follows: errors don't apologize and aren't vague, and an empty screen is an invitation to act.

- **First-load empty state:** a couple of faint card outlines (reuse the skeleton style at lower opacity) with a short line like "Paste your notes above to generate your first set of cards." Not "No data yet" — say what to do.
- **Zero results returned:** "Couldn't make cards from that — try adding a bit more detail." Specific about what happened and what to try, not "Something went wrong."
- **Malformed/failed response:** "That response didn't come through right." + a Retry button labeled exactly **Retry**, not "Try again" or "Reload" — one verb, used consistently everywhere it appears.
- Error and empty illustrations should use the *same* dashed-outline card motif as the loading skeleton — one consistent "nothing here yet" visual language across all three non-success states, instead of a different icon for each.

---

## 6. Quiz-specific polish

- **Progress bar**, not just "Question 3 of 8" — a thin bar in `--accent-ink` along the top of the quiz card, filling as the user advances. Pairs with the mono-font counter, doesn't replace it.
- **Score reveal:** the final score number counts up quickly (0 → final score, ~500ms) in the mono face rather than just appearing — small moment of payoff at the end of the quiz.
- **Retest-wrong button:** only rendered if there's at least one wrong answer — if the user got everything right, replace it with a `.highlight` congratulatory line instead of a disabled button.

---

## 7. Mobile-specific

- **Flashcards:** support swipe left/right to move between cards (in addition to visible Prev/Next buttons — swipe is an addition, never the only way).
- **Quiz options:** full-width tap targets, minimum 44px height.
- **Sticky action bar:** on small screens, keep the Generate / Next / Retry button pinned to the bottom of the viewport rather than requiring a scroll to reach it.
- Dot-grid background density drops on narrow viewports (fewer dots, same opacity) so it doesn't turn into visual noise on a small screen.

---

## 8. Accessibility (part of "attractive," not separate from it)

- Visible keyboard focus ring on every interactive element, styled in `--accent-ink` rather than the browser default blue, so it matches the theme instead of clashing with it.
- Arrow keys move between flashcards and quiz options when the deck/question has focus.
- All color-only signals (correct/wrong) are paired with a non-color cue — an icon or underline style, not just green/red — for colorblind users.
- Confirm contrast of `--text-muted` against both `--bg` values meets at least 4.5:1 before finalizing the exact hex values in UI_DESIGN.md — check this once real text is in place, not just in theory.

---

## 9. Icons

Use a single line-icon set throughout (e.g. Lucide) at a consistent stroke width — no mixing filled and outline icons. Keep the icon vocabulary small and literal: a sun/moon for theme, a flip/refresh glyph for retry, simple chevrons for next/prev. Nothing decorative that isn't also functional.
