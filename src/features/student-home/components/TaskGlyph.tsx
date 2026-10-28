import type { AssignmentKind } from '@/domain/assignment';

export type TaskGlyphName = AssignmentKind | 'due' | 'done' | 'arrow';

// Original MathsExpress task icons, drawn on a 24px grid with round 2px strokes.
const GLYPH_PATHS: Record<TaskGlyphName, string> = {
  // An open exercise book with a plus sign on the right-hand page.
  homework:
    'M3.5 6c2.8-1.3 5.6-1.3 8.5.5v12.8c-2.9-1.8-5.7-1.8-8.5-.5ZM12 6.5c2.9-1.8 5.7-1.8 8.5-.5v12.8c-2.8-1.3-5.6-1.3-8.5.5M15 11.5h3M16.5 10v3',
  // A question card with a tick: answer, then check.
  quiz: 'M7 3.5h10a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3v-11a3 3 0 0 1 3-3ZM8.5 12.5l2.5 2.5 4.5-5',
  // Three rising bars: practice builds up.
  practice: 'M5.5 19.5v-5M12 19.5v-9M18.5 19.5V5M3.5 20.5h17',
  // A loop arrow around a point: go back over it.
  revision: 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4.5H15M12 12h.01',
  // A calendar page with the due day marked.
  due: 'M6.5 5h11a2.5 2.5 0 0 1 2.5 2.5v10a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5ZM8 3v4M16 3v4M4 10h16M12 14.5h.01',
  done: 'M5 12.5 9.5 17 19 7.5',
  arrow: 'M5 12h13M13 7l5 5-5 5',
};

/** A decorative task icon. Always pair it with text. */
export function TaskGlyph({ name, className }: { name: TaskGlyphName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={GLYPH_PATHS[name]} />
    </svg>
  );
}
