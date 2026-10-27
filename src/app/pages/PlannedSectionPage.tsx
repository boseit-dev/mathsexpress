import { CalendarClock } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { MessageLayout } from './MessageLayout';

interface PlannedSectionPageProps {
  title: string;
  /** What this section will do once it is built. */
  summary: string;
  /** Where "Back to home" goes. Omit when this page is itself the home page. */
  homePath?: string;
}

/**
 * Honest stand-in for a navigation destination that a later phase will build, so every link
 * works during development. None of these may remain when MathsExpress 2.0 is released.
 */
export function PlannedSectionPage({ title, summary, homePath }: PlannedSectionPageProps) {
  return (
    <MessageLayout
      icon={CalendarClock}
      eyebrow="Planned for a later phase"
      title={title}
      actions={
        homePath && (
          <ButtonLink to={homePath} variant="secondary">
            Back to home
          </ButtonLink>
        )
      }
    >
      <p>{summary}</p>
      <p>This part of MathsExpress 2.0 hasn’t been built yet.</p>
    </MessageLayout>
  );
}
