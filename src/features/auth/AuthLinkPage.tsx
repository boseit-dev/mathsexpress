import { Link, useLoaderData } from 'react-router';
import { FormMessage } from '@/components/forms/FormMessage';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { errorMessages } from '@/domain/errors';
import type { AuthLinkResult } from './authHandlers';
import { AuthHeading } from './AuthHeading';
import styles from './AuthPage.module.css';

/** Shown when an email link or Google sign-in could not be completed. */
export function AuthLinkPage() {
  const { error } = useLoaderData<AuthLinkResult>();

  return (
    <>
      <AuthHeading title="That didn’t work" />
      <FormMessage tone="error">{errorMessages[error]}</FormMessage>
      <ButtonLink to={paths.signIn} size="large" className={styles.submit}>
        Go to sign in
      </ButtonLink>
      <p className={styles.footer}>
        Need a new password link? <Link to={paths.forgotPassword}>Reset your password</Link>
      </p>
    </>
  );
}
