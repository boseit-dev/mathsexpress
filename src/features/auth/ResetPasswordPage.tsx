import { Form, Link, useLoaderData } from 'react-router';
import { FormMessage } from '@/components/forms/FormMessage';
import { PasswordField } from '@/components/forms/PasswordField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { errorMessages } from '@/domain/errors';
import type { ResetPasswordData } from './authHandlers';
import { AuthHeading } from './AuthHeading';
import { useFormState } from '@/app/forms/useFormState';
import styles from './AuthPage.module.css';

export function ResetPasswordPage() {
  const { signedIn, fromResetLink } = useLoaderData<ResetPasswordData>();
  const { formMessage, fieldError, isSubmitting } = useFormState();

  // Only straight after a reset link. Anyone else at a signed-in computer is sent for a link
  // to the account's email, so they can't take over the account by changing its password.
  if (!fromResetLink) {
    return (
      <>
        <AuthHeading title="Reset your password" />
        <FormMessage tone="error">
          {signedIn ? errorMessages.reset_link_required : errorMessages.link_invalid}
        </FormMessage>
        <ButtonLink to={paths.forgotPassword} className={styles.submit}>
          {signedIn ? 'Send me a reset link' : 'Request a new link'}
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Choose a new password" />
      <FormMessage tone="error">{formMessage}</FormMessage>
      <Form method="post" noValidate className={styles.form}>
        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          hint="8 to 72 characters, including letters and numbers."
          error={fieldError('password')}
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          error={fieldError('confirmPassword')}
        />
        <SubmitButton
          size="large"
          className={styles.submit}
          pending={isSubmitting()}
          pendingLabel="Saving…"
        >
          Save new password
        </SubmitButton>
      </Form>
      <p className={styles.footer}>
        <Link to={paths.root}>Cancel</Link>
      </p>
    </>
  );
}
