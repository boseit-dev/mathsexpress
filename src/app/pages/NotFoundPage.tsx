import { Compass } from 'lucide-react';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { MessageLayout } from './MessageLayout';

export function NotFoundPage({ homePath = paths.root }: { homePath?: string }) {
  return (
    <MessageLayout
      icon={Compass}
      title="Page not found"
      actions={<ButtonLink to={homePath}>Go to home</ButtonLink>}
    >
      <p>The page you were looking for doesn’t exist or has moved.</p>
    </MessageLayout>
  );
}
