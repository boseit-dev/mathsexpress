import { useEffect } from 'react';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import { isRouteErrorResponse, useRevalidator, useRouteError } from 'react-router';
import { Button } from '@/components/ui/Button';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { MessageLayout } from './MessageLayout';
import { NotFoundPage } from './NotFoundPage';

function isNotFound(error: unknown): boolean {
  return isRouteErrorResponse(error) && error.status === 404;
}

/** Shown when a page fails to load or render. "Try again" re-runs the page's data loading. */
export function RouteErrorPage({ homePath = paths.root }: { homePath?: string }) {
  const error = useRouteError();
  const revalidator = useRevalidator();

  useEffect(() => {
    // Kept visible in the console until error monitoring is added.
    if (!isNotFound(error)) console.error('MathsExpress could not show this page:', error);
  }, [error]);

  if (isNotFound(error)) return <NotFoundPage homePath={homePath} />;

  const isRetrying = revalidator.state === 'loading';

  return (
    <MessageLayout
      icon={TriangleAlert}
      title="Something went wrong"
      actions={
        <>
          <Button onClick={() => void revalidator.revalidate()} disabled={isRetrying}>
            <RefreshCw />
            {isRetrying ? 'Trying again…' : 'Try again'}
          </Button>
          <ButtonLink to={homePath} variant="secondary">
            Go to home
          </ButtonLink>
        </>
      }
    >
      <p>This page didn’t load. Check your internet connection and try again.</p>
      <p>If it keeps happening, let your teacher know.</p>
    </MessageLayout>
  );
}
